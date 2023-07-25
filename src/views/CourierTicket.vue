<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";

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
  createGraph();

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
