<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";
import moment from "moment";
import GraphJson from "../util/graph.json";


const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});



const savedUser = ref(null);

onMounted(async () => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getCourierTickets();
  createGraphFromJson();

});

const tickets = ref([]);

async function getCourierTickets() {
  try {
    const response = await TicketServices.getCourierTickets(
      savedUser.value.id
    );
    tickets.value = response.data;
    let temp = tickets.value.filter((ticket) => ticket.status !== "Delivered");
    if (temp.length > 0) {
      currentTicket.value = temp[0];
      start_navigation();
    } else {
      currentTicket.value = null;
      showing.value = "history";
    }
  } catch (error) {
    console.log(error);
  }
}

const currentTicket = ref(null);



async function logout() {
  // clear local storage
  localStorage.clear();
  // redirect to login
  router.push({ name: "login" });
}


function closeSnackBar() {
  snackbar.value.value = false;
}

function viewTicket(temp) {
  router.push("/courier-ticket/" + temp.id);
}

const driver_status_list = [
  { title: "Available" },
  { title: "Not Available" },
];

const showing = ref("home");

async function updateDriverStatus(status) {
  savedUser.value.status = status;
  localStorage.setItem("user", JSON.stringify(savedUser.value));
  await UserServices.updateUser(savedUser.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Status updated";
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Status update failed";
      }
    })
}

async function delivered(ticket) {
  ticket.status = 'Delivered';
  ticket.delivery_time = moment().format('LLLL');
  ticket.bonus = calculateBonus(ticket.pickup_time, ticket.delivery_time, ticket.est_delivery_time, ticket.quoted_price);
  try {
    const response = await TicketServices.updateTicket(ticket);
    snackbar.value = {
      value: true,
      color: "success",
      text: "Status updated successfully",
    };
    getCourierTickets();
  } catch (error) {
    snackbar.value = {
      value: true,
      color: "error",
      text: "Error updating status",
    };
  }
}

function calculateBonus(pick_up, delivery_time, est_time, quoted_price) {

  let delivery = moment(delivery_time);
  let pick = moment(delivery_time.split(',')[0] + ", " + delivery_time.split(',')[1] + ", 2023" + " " + pick_up + ":00");
  console.log('delivery', delivery)
  console.log('pick', pick)
  let duration = moment.duration(delivery.diff(pick));
  console.log(duration.asMinutes());
  if (duration.asMinutes() < parseInt(est_time)) {
    return (quoted_price * 0.1).toFixed(2);
  }

  return 0;
}

async function pickedup(ticket) {
  ticket.status = 'Picked up';
  ticket.pickup_time = moment().format('LLLL');
  try {
    const response = await TicketServices.updateTicket(ticket);
    snackbar.value = {
      value: true,
      color: "success",
      text: "Status updated successfully",
    };
    getCourierTickets();

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


async function start_navigation() {
  await route_pickup();
  await route_delivery();
  await route_back();
  console.log(pickup_path.value);
  console.log(delivery_path.value);
  console.log(back_path.value);
}
async function route_pickup() {
  let name = currentTicket.value.pickup_customer.location[12] + currentTicket.value.pickup_customer.location[0];
  let m_path = path(graph.value, source, getIdFromName(name));
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    pickup_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  // pickup_path.value.push(currentTicket.value.pickup_customer.location);
}

async function route_delivery() {
  let source_name = currentTicket.value.pickup_customer.location[12] + currentTicket.value.pickup_customer.location[0];
  let destination_name = currentTicket.value.delivery_customer.location[12] + currentTicket.value.delivery_customer.location[0];
  let m_path = path(graph.value, getIdFromName(source_name), getIdFromName(destination_name));
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    delivery_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  // delivery_path.value.push(currentTicket.value.delivery_customer.location);
}


async function route_back() {
  let destination_name = currentTicket.value.delivery_customer.location[12] + currentTicket.value.delivery_customer.location[0];
  let m_path = path(graph.value, getIdFromName(destination_name), source);
  for (let i = 0; i < m_path.length; i++) {
    let name = getNameFromId(m_path[i]);
    back_path.value.push("Ave " + name[1] + " Street " + name[0]);
  }
  // back_path.value.push("3rd Ave and C Street");
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





</script>

<template>
  <v-container>
    <div id="body">
      <v-app-bar color="primary" app dark>
        <span class="mx-5" v-if="savedUser">{{ savedUser.firstName }} {{ savedUser.lastName }}</span>
        <v-spacer></v-spacer>

        <v-btn color="secondary" @click="showing = 'home'">Home</v-btn>
        <v-btn color="secondary" @click="showing = 'history'">History</v-btn>
        <div v-if="savedUser">
          <v-menu class="mx-5" v-if="savedUser.user_role === 'courier'">
            <template v-slot:activator="{ props }">
              <v-chip class="mx-2" label v-bind="props" color="green" prepend-icon="mdi-airplane"
                append-icon="mdi-menu-down">
                <h4>{{ savedUser.status }}</h4>
              </v-chip>
            </template>

            <v-list>
              <v-list-item @click="updateDriverStatus(item.title)" v-for="(item, i) in driver_status_list" :key="i">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <v-btn color="secondary" @click="logout()">Logout</v-btn>
      </v-app-bar>

      <template v-if="showing === 'home'">
        <v-card v-if="currentTicket" class="rounded-lg elevation-1">
          <v-card-title class="my-5">Ticket # {{ currentTicket.id }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="rounded-lg elevation-1">
                  <v-card-title>Pickup details</v-card-title>
                  <v-card-text>
                    <v-text-field readonly variant="solo" v-model="currentTicket.pickup_customer.name"
                      label="Pickup customer name" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.pickup_customer.number"
                      label="Pickup customer number" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.pickup_customer.location"
                      label="Location" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.pickup_customer.delivery_instructions"
                      label="Instruction" required></v-text-field>
                  </v-card-text>
                </v-card>
                <v-card v-if="pickup_path" class="rounded-lg elevation-1 my-5">
                  <v-card-title>
                    Pickup path
                  </v-card-title>
                  <div class="d-flex justify-space-around my-5">
                    <v-timeline side="end" truncate-line="both">
                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          Acme courier service
                        </template>
                        3rd Ave and C Street
                      </v-timeline-item>

                      <v-timeline-item side="end" dot-color="teal-lighten-3" size="small" v-for="item in pickup_path"
                        :key="item">
                        {{ item }}
                      </v-timeline-item>

                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          {{ currentTicket.pickup_customer.name }}
                        </template>
                        {{ currentTicket.pickup_customer.location }}
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="rounded-lg elevation-1">
                  <v-card-title>Drop off details</v-card-title>
                  <v-card-text>
                    <v-text-field readonly variant="solo" v-model="currentTicket.delivery_customer.name"
                      label="Delivery customer name" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.delivery_customer.number"
                      label="Delivery customer number" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.delivery_customer.location"
                      label="Delivery" required></v-text-field>
                    <v-text-field readonly variant="solo" v-model="currentTicket.delivery_customer.delivery_instructions"
                      label="Instruction" required></v-text-field>
                  </v-card-text>
                </v-card>
                <v-card v-if="delivery_path" class="rounded-lg elevation-1 my-5">
                  <v-card-title>
                    Delivery path
                  </v-card-title>
                  <div class="d-flex justify-space-around my-5">
                    <v-timeline side="end" truncate-line="both">
                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          {{ currentTicket.pickup_customer.name }}
                        </template>
                        {{ currentTicket.pickup_customer.location }}
                      </v-timeline-item>

                      <v-timeline-item side="end" dot-color="teal-lighten-3" size="small" v-for="item in delivery_path"
                        :key="item">
                        {{ item }}
                      </v-timeline-item>

                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          {{ currentTicket.delivery_customer.name }}
                        </template>
                        {{ currentTicket.delivery_customer.location }}
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                </v-card>
                <v-card v-if="delivery_path" class="rounded-lg elevation-1 my-5">
                  <v-card-title>
                    Back to office path
                  </v-card-title>
                  <div class="d-flex justify-space-around my-5">
                    <v-timeline side="end" truncate-line="both">
                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          {{ currentTicket.delivery_customer.name }}
                        </template>
                        {{ currentTicket.delivery_customer.location }}
                      </v-timeline-item>

                      <v-timeline-item side="end" dot-color="teal-lighten-3" size="small" v-for="item in back_path"
                        :key="item">
                        {{ item }}
                      </v-timeline-item>

                      <v-timeline-item dot-color="blue-lighten-3">
                        <template v-slot:opposite>
                          Acme courier service
                        </template>
                        3rd Ave and C Street
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="pickedup(currentTicket)" v-if="currentTicket.status === 'created'" variant="flat" class="mr-2"
              color="primary">Picked up</v-btn>
            <v-btn @click="delivered(currentTicket)" v-else variant="flat" class="mr-2" color="green">Delivered</v-btn>
          </v-card-actions>
        </v-card>
      </template>

      <v-card v-if="currentTicket === null" class="rounded-lg elevation-5 my-5">
        <v-card-text>
          <h2>No tickets assigned</h2>
        </v-card-text>
      </v-card>

      <v-table v-if="showing === 'history'" class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Id</th>
            <th class="text-left">Created by</th>
            <th class="text-left">Pick up customer</th>
            <th class="text-left">Delivery customer</th>
            <th class="text-left">Corier</th>
            <th class="text-left">Status</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody v-if="tickets">
          <tr v-for="temp in tickets" :key="temp.data">
            <td>{{ temp.id }}</td>
            <td>{{ temp.creator.firstName }} {{ temp.creator.lastName }}</td>
            <td>{{ temp.pickup_customer.name }}</td>
            <td>{{ temp.delivery_customer.name }}</td>
            <td>{{ temp.assigned_to.firstName }} {{ temp.assigned_to.lastName }}</td>
            <td>{{ temp.status }}</td>
            <td><v-btn @click="viewTicket(temp)" color="primary">View ticket</v-btn></td>
          </tr>
        </tbody>
      </v-table>


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
