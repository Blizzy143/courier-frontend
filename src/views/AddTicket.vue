<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const savedUser = ref(null);

const graph = ref([]);

async function createGraph(){

  let A1 = new Node(0, "A1")
    let A2 = new Node(1, "A2")
    let A3 = new Node(2, "A3")
    let A4 = new Node(3, "A4")
    let A5 = new Node(4, "A5")
    let A6 = new Node(5, "A6")
    let A7 = new Node(6, "A7")

    let B1 = new Node(7, "B1")
    let B2 = new Node(8, "B2")
    let B3 = new Node(9, "B3")
    let B4 = new Node(10, "B4")
    let B5 = new Node(11, "B5")
    let B6 = new Node(12, "B6")
    let B7 = new Node(13, "B7")

    let C1 = new Node(14, "C1")
    let C2 = new Node(15, "C2")
    let C3 = new Node(16, "C3")
    let C4 = new Node(17, "C4")
    let C5 = new Node(18, "C5")
    let C6 = new Node(19, "C6")
    let C7 = new Node(20, "C7")

    let D1 = new Node(21, "D1")
    let D2 = new Node(22, "D2")
    let D3 = new Node(23, "D3")
    let D4 = new Node(24, "D4")
    let D5 = new Node(25, "D5")
    let D6 = new Node(26, "D6")
    let D7 = new Node(27, "D7")

    let E1 = new Node(28, "E1")
    let E2 = new Node(29, "E2")
    let E3 = new Node(30, "E3")
    let E4 = new Node(31, "E4")
    let E5 = new Node(32, "E5")
    let E6 = new Node(33, "E6")
    let E7 = new Node(34, "E7")

    let F1 = new Node(35, "F1")
    let F2 = new Node(36, "F2")
    let F3 = new Node(37, "F3")
    let F4 = new Node(38, "F4")
    let F5 = new Node(39, "F5")
    let F6 = new Node(40, "F6")
    let F7 = new Node(41, "F7")

    let G1 = new Node(42, "G1")
    let G2 = new Node(43, "G2")
    let G3 = new Node(44, "G3")
    let G4 = new Node(45, "G4")
    let G5 = new Node(46, "G5")
    let G6 = new Node(47, "G6")
    let G7 = new Node(48, "G7")

    A1.Add_child(A2.vertexNumber, 1)

    A2.Add_child(A3.vertexNumber, 1)
    A2.Add_child(B2.vertexNumber, 1)

    A3.Add_child(A4.vertexNumber, 1)

    A4.Add_child(A5.vertexNumber, 1)
    A4.Add_child(B4.vertexNumber, 1)

    A5.Add_child(A6.vertexNumber, 1)

    A6.Add_child(A7.vertexNumber, 1)
    A6.Add_child(B6.vertexNumber, 1)

    B1.Add_child(A1.vertexNumber, 1)

    B2.Add_child(A2.vertexNumber, 1)
    B2.Add_child(B1.vertexNumber, 1)
    B2.Add_child(C2.vertexNumber, 1)

    B3.Add_child(B2.vertexNumber, 1)
    B3.Add_child(A3.vertexNumber, 1)

    B4.Add_child(B3.vertexNumber, 1)
    B4.Add_child(C4.vertexNumber, 1)

    B5.Add_child(B4.vertexNumber, 1)
    B5.Add_child(A5.vertexNumber, 1)

    B6.Add_child(B5.vertexNumber, 1)
    B6.Add_child(C6.vertexNumber, 1)
    B6.Add_child(A6.vertexNumber, 1)

    B7.Add_child(B6.vertexNumber, 1)
    B7.Add_child(A7.vertexNumber, 1)

    C1.Add_child(B1.vertexNumber, 1)
    C1.Add_child(C2.vertexNumber, 1)

    C2.Add_child(C3.vertexNumber, 1)
    C2.Add_child(B2.vertexNumber, 1)
    C2.Add_child(D2.vertexNumber, 1)

    C3.Add_child(C4.vertexNumber, 1)
    C3.Add_child(B3.vertexNumber, 1)

    C4.Add_child(C5.vertexNumber, 1)
    C4.Add_child(D4.vertexNumber, 1)

    C5.Add_child(C6.vertexNumber, 1)
    C5.Add_child(B5.vertexNumber, 1)

    C6.Add_child(C7.vertexNumber, 1)
    C6.Add_child(B6.vertexNumber, 1)
    C6.Add_child(D6.vertexNumber, 1)

    C7.Add_child(B7.vertexNumber, 1)

    D1.Add_child(C1.vertexNumber, 1)
    D1.Add_child(D2.vertexNumber, 1)

    D2.Add_child(D1.vertexNumber, 1)
    D2.Add_child(D3.vertexNumber, 1)
    D2.Add_child(C2.vertexNumber, 1)
    D2.Add_child(E2.vertexNumber, 1)

    D3.Add_child(D2.vertexNumber, 1)
    D3.Add_child(D4.vertexNumber, 1)
    D3.Add_child(C3.vertexNumber, 1)

    D4.Add_child(D3.vertexNumber, 1)
    D4.Add_child(D5.vertexNumber, 1)
    D4.Add_child(E4.vertexNumber, 1)

    D5.Add_child(D4.vertexNumber, 1)
    D5.Add_child(D6.vertexNumber, 1)
    D5.Add_child(C5.vertexNumber, 1)

    D6.Add_child(D5.vertexNumber, 1)
    D6.Add_child(D7.vertexNumber, 1)
    D6.Add_child(C6.vertexNumber, 1)
    D6.Add_child(E6.vertexNumber, 1)

    D7.Add_child(D6.vertexNumber, 1)
    D7.Add_child(C7.vertexNumber, 1)

    E1.Add_child(D1.vertexNumber, 1)
    E1.Add_child(E2.vertexNumber, 1)

    E2.Add_child(E3.vertexNumber, 1)
    E2.Add_child(D2.vertexNumber, 1)
    E2.Add_child(F2.vertexNumber, 1)

    E3.Add_child(E4.vertexNumber, 1)
    E3.Add_child(D3.vertexNumber, 1)

    E4.Add_child(E5.vertexNumber, 1)
    E4.Add_child(F4.vertexNumber, 1)

    E5.Add_child(E6.vertexNumber, 1)
    E5.Add_child(D5.vertexNumber, 1)

    E6.Add_child(E7.vertexNumber, 1)
    E6.Add_child(D6.vertexNumber, 1)
    E6.Add_child(F6.vertexNumber, 1)

    E7.Add_child(D7.vertexNumber, 1)

    F1.Add_child(E1.vertexNumber, 1)

    F2.Add_child(F1.vertexNumber, 1)
    F2.Add_child(E2.vertexNumber, 1)
    F2.Add_child(G2.vertexNumber, 1)

    F3.Add_child(F2.vertexNumber, 1)
    F3.Add_child(E3.vertexNumber, 1)

    F4.Add_child(F3.vertexNumber, 1)
    F4.Add_child(G4.vertexNumber, 1)

    F5.Add_child(F4.vertexNumber, 1)
    F5.Add_child(E5.vertexNumber, 1)

    F6.Add_child(F5.vertexNumber, 1)
    F6.Add_child(E6.vertexNumber, 1)
    F6.Add_child(G6.vertexNumber, 1)

    F7.Add_child(F6.vertexNumber, 1)
    F7.Add_child(E7.vertexNumber, 1)

    G1.Add_child(F1.vertexNumber, 1)
    G1.Add_child(G2.vertexNumber, 1)

    G2.Add_child(G3.vertexNumber, 1)
    G2.Add_child(F2.vertexNumber, 1)

    G3.Add_child(G4.vertexNumber, 1)
    G3.Add_child(F3.vertexNumber, 1)

    G4.Add_child(G5.vertexNumber, 1)

    G5.Add_child(G6.vertexNumber, 1)
    G5.Add_child(F5.vertexNumber, 1)

    G6.Add_child(G7.vertexNumber, 1)
    G6.Add_child(F6.vertexNumber, 1)

    G7.Add_child(F7.vertexNumber, 1)

    graph.value.push(A1)
    graph.value.push(A2)
    graph.value.push(A3)
    graph.value.push(A4)
    graph.value.push(A5)
    graph.value.push(A6)
    graph.value.push(A7)

    graph.value.push(B1)
    graph.value.push(B2)
    graph.value.push(B3)
    graph.value.push(B4)
    graph.value.push(B5)
    graph.value.push(B6)
    graph.value.push(B7)

    graph.value.push(C1)
    graph.value.push(C2)
    graph.value.push(C3)
    graph.value.push(C4)
    graph.value.push(C5)
    graph.value.push(C6)
    graph.value.push(C7)

    graph.value.push(D1)
    graph.value.push(D2)
    graph.value.push(D3)
    graph.value.push(D4)
    graph.value.push(D5)
    graph.value.push(D6)
    graph.value.push(D7)

    graph.value.push(E1)
    graph.value.push(E2)
    graph.value.push(E3)
    graph.value.push(E4)
    graph.value.push(E5)
    graph.value.push(E6)
    graph.value.push(E7)

    graph.value.push(F1)
    graph.value.push(F2)
    graph.value.push(F3)
    graph.value.push(F4)
    graph.value.push(F5)
    graph.value.push(F6)
    graph.value.push(F7)

    graph.value.push(G1)
    graph.value.push(G2)
    graph.value.push(G3)
    graph.value.push(G4)
    graph.value.push(G5)
    graph.value.push(G6)
    graph.value.push(G7)
    
}

onMounted(() => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getCustomers();
  getCouriers();
  createGraph();
});

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
    couriers.value = response.data;
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


async function addTicket(){

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
      router.push("/clerk");
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
    let initial_paths  = Array(grp.length).fill(-1);
    let  paths = dijkstraDist(grp, source, initial_paths);
    return  extractPath(paths, destination, source);
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
  let my_path = path(graph.value, source,getIdFromName(name));
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
  console.log(ticket.value.est_delivery_time);
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
          <v-select  variant="outlined" @update:modelValue="onPickupCustomerChange" v-model="pickupcustomer" :items="customers" item-title="name" item-value="name"
            label="Pick up customer" return-object required>
          </v-select>

          <v-text-field variant="outlined" type="time" v-model="ticket.pickup_time" label="Pickup Time"  required></v-text-field>

          <v-select variant="outlined" @update:modelValue="onDeliveryCustomerChange"  v-model="deliverycustomer" :items="customers" item-title="name" item-value="name"
            label="Delivery customer" return-object required>
          </v-select>

          <v-select variant="outlined" v-model="courier" :items="couriers" :item-title="(item) => item.firstName + ' ' + item.lastName"
            item-value="id" label="Asign to" return-object required>
          </v-select>

        </v-card-text>
      </v-card>



      <v-card class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2">
        </v-card-title>
        <v-card-text>
          <v-text-field readonly variant="outlined" v-model="ticket.bill_pickup" label="Pickup Bill" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.est_delivery_time" label="Estimated delivery Time" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.bill_delivery" label="Delivery Bill" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.est_blocks" label="Estimated blocks" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="ticket.quoted_price" label="Quoted price" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
