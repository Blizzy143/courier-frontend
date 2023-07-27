<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";
import GraphJson from "../util/graph.json";


const router = useRouter();
const route = useRoute();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const savedUser = ref(null);
const ticket = ref(null);


onMounted(() => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  const ticketId = route.params.id;
  getTicket(ticketId);
  createGraphFromJson();
});


const pickupcustomer = ref(null);
const deliverycustomer = ref(null);
const courier = ref(null);



async function getTicket(id) {
  try {
    const response = await TicketServices.getTicket(id);
    ticket.value = response.data;
    pickupcustomer.value = ticket.value.pickup_customer;
    deliverycustomer.value = ticket.value.delivery_customer;
    courier.value = ticket.value.assigned_to;
    start_navigation();
  } catch (error) {
    console.log(error);
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}


function calculateBonus(pick_up, delivery_time, est_time, quoted_price){
  
  let delivery = moment(delivery_time);
  let pick = moment(delivery_time.split(',')[0]+", " +delivery_time.split(',')[1] +", 2023"+ " " + pick_up + ":00");
  console.log('delivery', delivery)
  console.log('pick', pick)
  let duration = moment.duration(delivery.diff(pick));
  console.log(duration.asMinutes());
    if(duration.asMinutes() < parseInt(est_time)) {
      return (quoted_price * 0.1).toFixed(2);
    }

  return 0;
}

async function updateStatus() {

  if (ticket.value.status == 'Picked up') {
    ticket.value.picked_up_time = moment().format('LLLL');
  } else if (ticket.value.status == 'Delivered') {
    ticket.value.delivery_time = moment().format('LLLL');
    ticket.value.bonus = calculateBonus(ticket.value.pickup_time, ticket.value.delivery_time, ticket.value.est_delivery_time, ticket.value.quoted_price);
  }
  try {
    const response = await TicketServices.updateTicket(ticket.value);
    snackbar.value = {
      value: true,
      color: "success",
      text: "Status updated successfully",
    };
  } catch (error) {
    snackbar.value = {
      value: true,
      color: "error",
      text: "Error updating status",
    };
  }
}


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



const source = 16;

const pickup_path = ref([]);
const delivery_path = ref([]);
const back_path = ref([]);



async function start_navigation(){
  await route_pickup();
  await route_delivery();
  await route_back();
  console.log(pickup_path.value);
  console.log(delivery_path.value);
  console.log(back_path.value);
}


async function  route_pickup(){
  let name = pickupcustomer.value.location[12] + pickupcustomer.value.location[0];
  let m_path = path(graph.value, source,getIdFromName(name));
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    pickup_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  pickup_path.value.push(pickupcustomer.value.location);
}

async function  route_delivery(){
  let source_name = pickupcustomer.value.location[12] + pickupcustomer.value.location[0];
  let destination_name = deliverycustomer.value.location[12] + deliverycustomer.value.location[0];
  let m_path = path(graph.value, getIdFromName(source_name), getIdFromName(destination_name));
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    delivery_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  delivery_path.value.push(deliverycustomer.value.location);
}


async function  route_back(){
  let destination_name = deliverycustomer.value.location[12] + deliverycustomer.value.location[0];
  let m_path = path(graph.value,  getIdFromName(destination_name), source);
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    back_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  back_path.value.push("3rd Ave and C Street");
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
    let initial_paths  = Array(grp.length).fill(-1);
    let  paths = dijkstraDist(grp, source, initial_paths);
    return  extractPath(paths, destination, source);
}



</script>

<template>
  <v-container>
    <div id="body">

      <v-card v-if="ticket" class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2"> Pickup customer details
        </v-card-title>
        <v-card-text>
          <v-text-field readonly variant="outlined" v-model="ticket.pickup_customer.name" label="Pickup customer name"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.pickup_customer.number" label="Pickup customer number"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.pickup_customer.location" label="Location"
            required></v-text-field>
        </v-card-text>
      </v-card>
      <v-card v-if="ticket" class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2"> Delivery customer details
        </v-card-title>
        <v-card-text>
          <v-text-field readonly variant="outlined" v-model="ticket.delivery_customer.name" label="Delivery customer name"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.delivery_customer.number"
            label="Delivery customer number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.delivery_customer.location" label="Delivery"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.delivery_customer.delivery_instructions"
            label="Delivery instruction" required></v-text-field>
        </v-card-text>
      </v-card>

      <v-card v-if="ticket" class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2">
        </v-card-title>
        <v-card-text>

          <v-text-field readonly variant="outlined" v-model="ticket.pickup_time" label="Pickup Time"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.bill_pickup" label="Pickup Bill" type="number"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.est_delivery_time" label="Estimated delivery Time"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.bill_delivery" label="Delivery Bill" type="number"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.est_blocks" label="Estimated blocks" type="number"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.quoted_price" label="Quoted price" type="number"
            required></v-text-field>

          <v-text-field readonly variant="outlined" v-model="ticket.picked_up_time" label="Picked up time" 
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.delivery_time" label="Delivered time" 
            required></v-text-field>
          <v-text-field v-if="ticket.status === 'Delivered'" readonly v-model="ticket.bonus" variant="outlined" label="Bonus" 
            required></v-text-field>
   

          <v-select variant="outlined" v-model="ticket.status" :items="['created', 'Picked up', 'Delivered']"
            item-text="name" item-value="id" label="Status" return-object required>
          </v-select>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="updateStatus" variant="flat" class="mr-2" color="primary">Update status</v-btn>
        </v-card-actions>
    </v-card>

    <v-card>
      <v-card-title class="headline mb-2"> Navigation details
        </v-card-title>
        <v-card-text>
          <v-text-field readonly variant="outlined" v-model="pickup_path" label="Pickup path"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="delivery_path" label="Delivery path"
            required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="back_path" label="Back path"
            required></v-text-field>
        </v-card-text>
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
</v-container></template>
