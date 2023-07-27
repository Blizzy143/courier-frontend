<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";
import GraphJson from "../util/graph.json";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const savedUser = ref(null);

const graph = ref([]);

async function createGraphFromJson() {
  for (let i = 0; i < GraphJson.length; i++) {
    let node = new Node(GraphJson[i].vertexNumber, GraphJson[i].name);
    for (let j = 0; j < GraphJson[i].children.length; j++) {
      node.Add_child(GraphJson[i].children[j].first, GraphJson[i].children[j].second);
    }
    graph.value.push(node);
  }
}


onMounted(() => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getCustomers();
  getCouriers();
  createGraphFromJson();
});

async function back() {
  router.back();
}

const customers = ref([]);
const couriers = ref([]);

async function getCustomers() {
  const response = await AdminServices.getCustomers();
  if (response.status === 200) {
    customers.value = response.data;
  }
}

async function getCouriers() {
  const response = await UserServices.getCouriers();
  if (response.status === 200) {
    couriers.value = response.data.filter((courier) => courier.status === "Available");
  }
}


const ticket = ref({
  pickup_time: "",
  bill_pickup: "",
  bill_delivery: "",
  package_id: "",
  est_delivery_time: "",
  est_blocks: "",
  quoted_price: "",
  assigned_time: "",
  delivery_time: "",

  deliveryCustomerId: "",
  pickupCustomerId: "",
  creatorId: "",
  assignedToId: "",
});

const pickupcustomer = ref(null);
const deliverycustomer = ref(null);
const courier = ref(null);


async function addTicket() {

  // validate input
  if (pickupcustomer.value === null || deliverycustomer.value === null || ticket.value.pickup_time === "") {
    snackbar.value = {
      value: true,
      color: "error",
      text: "Please fill all fields",
    };
    return;
  }
  ticket.value.pickupCustomerId = pickupcustomer.value.id;
  ticket.value.deliveryCustomerId = deliverycustomer.value.id;
  ticket.value.creatorId = savedUser.value.id;
  ticket.value.assignedToId = courier.value.id;

  await TicketServices.addTicket(ticket.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value = {
          value: true,
          color: "success",
          text: "Ticket added successfully",
        };
        // sleep for 2 seconds
        setTimeout(() => {
          if (savedUser.value.user_role === "clerk")
            router.push({ name: "clerk" });
          else if (savedUser.value.user_role === "admin")
            router.push({ name: "admin" });
        }, 2000);

      }
    })
    .catch((error) => {
      snackbar.value = {
        value: true,
        color: "error",
        text: error.response.data.message,
      };
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

class Pair {
  constructor(destination_node, cost) {
    this.first = destination_node;
    this.second = cost;
  }
}

const infi = 1000000000;

class Node {
  constructor(vertexNumber, name) {
    this.vertexNumber = vertexNumber;
    this.name = name;
    this.children = [];
  }
  Add_child(vNumber, length) {
    const p = new Pair(vNumber, length);
    this.children.push(p);
  }
}

function dijkstraDist(g, s, path) {
  const dist = new Array(g.length).fill(infi);
  const visited = new Array(g.length).fill(false);

  for (let i = 0; i < g.length; i++) {
    path[i] = -1;
  }
  dist[s] = 0;
  path[s] = -1;
  let current = s;

  const sett = new Set();
  while (true) {
    visited[current] = true;
    for (let i = 0; i < g[current].children.length; i++) {
      const v = g[current].children[i].first;
      if (visited[v]) {
        continue;
      }
      sett.add(v);
      const alt = dist[current] + g[current].children[i].second;
      if (alt < dist[v]) {
        dist[v] = alt;
        path[v] = current;
      }
    }
    if (sett.has(current)) {
      sett.delete(current);
    }
    if (sett.size === 0) {
      break;
    }
    let minDist = infi;
    let index = 0;
    for (const a of sett) {
      if (dist[a] < minDist) {
        minDist = dist[a];
        index = a;
      }
    }
    current = index;
  }
  return path;
}


let my_path = [];

function extractPath(paths, dest, source) {
  if (dest !== source) {
    if (paths[dest] === -1) {
      console.log("Path not found!!");
      return [];
    }
    extractPath(paths, paths[dest], source);
    my_path.push(paths[dest]);
  }
  return my_path;
}

function getIdFromName(name) {
  let id = -1;
  for (let i = 0; i < graph.value.length; i++) {
    if (graph.value[i].name === name) {
      id = graph.value[i].vertexNumber;
      break;
    }
  }
  return id;
}

function getNameFromId(id) {
  let name = "";
  for (let i = 0; i < graph.value.length; i++) {
    if (graph.value[i].vertexNumber === id) {
      name = graph.value[i].name;
      break;
    }
  }
  return name;
}

function path(grp, source, destination) {
  my_path = [];
  let initial_paths = Array(grp.length).fill(-1);
  let paths = dijkstraDist(grp, source, initial_paths);
  return extractPath(paths, destination, source);
}

const source = 16;

async function onPickupCustomerChange(newValue) {
  pickupcustomer.value = newValue;
  calculateDistanceToPickup(newValue);
}


async function onDeliveryCustomerChange(newValue) {
  deliverycustomer.value = newValue;
  calculateDistanceToDelivery();
}

let pickup_blocks = 0;

function calculateDistanceToPickup(customer) {
  let name = customer.location[12] + customer.location[0];
  let my_path = path(graph.value, source, getIdFromName(name));
  pickup_blocks = my_path.length;
  ticket.value.bill_pickup = my_path.length * 1.5;
}



function calculateDistanceToDelivery() {
  calculateDistanceBack();
  let source_name = pickupcustomer.value.location[12] + pickupcustomer.value.location[0];
  let destination_name = deliverycustomer.value.location[12] + deliverycustomer.value.location[0];
  let my_path = path(graph.value, getIdFromName(source_name), getIdFromName(destination_name));

  let est_minutes = (pickup_blocks + my_path.length) * 3;
  // convert string to date and add est_minutes]

  ticket.value.est_delivery_time = est_minutes;
  ticket.value.est_blocks = pickup_blocks + my_path.length;
  ticket.value.bill_delivery = my_path.length * 1.5;
  ticket.value.quoted_price = (pickup_blocks + my_path.length) * 1.5;

}

let back_blocks = 0;

function calculateDistanceBack() {
  let destination_name = deliverycustomer.value.location[12] + deliverycustomer.value.location[0];
  let my_path = path(graph.value, getIdFromName(destination_name), source);
  back_blocks = my_path.length;
}



</script>

<template>
  <v-container>
    <div id="body">
      <v-app-bar color="primary" app dark>
        <span class="mx-5">Add ticket</span>
      </v-app-bar>

      <v-card class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2"> Ticket details
        </v-card-title>
        <v-card-text>
          <v-select variant="outlined" @update:modelValue="onPickupCustomerChange" v-model="pickupcustomer"
            :items="customers" item-title="name" item-value="name" label="Pick up customer" return-object required>
          </v-select>

          <v-text-field variant="outlined" type="time" v-model="ticket.pickup_time" label="Pickup Time"
            required></v-text-field>

          <v-select variant="outlined" @update:modelValue="onDeliveryCustomerChange" v-model="deliverycustomer"
            :items="customers" item-title="name" item-value="name" label="Delivery customer" return-object required>
          </v-select>

          <v-select variant="outlined" v-model="courier" :items="couriers"
            :item-title="(item) => item.firstName + ' ' + item.lastName" item-value="id" label="Asign to" return-object
            required>
          </v-select>

        </v-card-text>
      </v-card>



      <v-card class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2">
        </v-card-title>
        <v-card-text>
          <v-text-field readonly variant="solo" v-model="ticket.bill_pickup" label="Pickup Bill" type="number"
            required></v-text-field>
          <v-text-field readonly variant="solo" v-model="ticket.est_delivery_time" label="Estimated delivery Time"
            required></v-text-field>
          <v-text-field readonly variant="solo" v-model="ticket.bill_delivery" label="Delivery Bill" type="number"
            required></v-text-field>
          <v-text-field readonly variant="solo" v-model="ticket.est_blocks" label="Estimated blocks" type="number"
            required></v-text-field>
          <v-text-field readonly variant="solo" v-model="ticket.quoted_price" label="Quoted price" type="number"
            required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="router.back" variant="flat" class="mr-2" color="secondary">Cancel</v-btn>
          <v-btn @click="addTicket" variant="flat" class="mr-2" color="primary">Create ticket</v-btn>
        </v-card-actions>
      </v-card>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
