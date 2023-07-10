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

onMounted(async () => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getCourierTickets();
});

const tickets = ref([]);

async function getCourierTickets() {
  try {
    const response = await TicketServices.getTickets();
    tickets.value = response.data;
  } catch (error) {
    console.log(error);
  }
}



async function logout() {
  // clear local storage
  localStorage.clear();
  // redirect to login
  router.push({ name: "login" });
}

async function openAddTicket() {
  router.push({ name: "ticket" });
}


function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-app-bar color="primary" app dark>
        <span class="mx-5" v-if="savedUser">{{ savedUser.firstName }} {{ savedUser.lastName }}</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="logout()">Logout</v-btn>
      </v-app-bar>


      <template v-if="tickets" cols="12" justify="center">
        <v-row class="my-5">
          <v-col cols="8">
            <h1>Tickets</h1>
          </v-col>
          <v-col class="d-flex justify-end" cols="4">
            <v-btn color="accent" @click="openAddTicket">Add</v-btn>
          </v-col>
        </v-row>
        <v-table class="rounded-lg elevation-5">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Created by</th>
              <th class="text-left">Pick up customer</th>
              <th class="text-left">Delivery customer</th>
              <th class="text-left">Corier</th>
              <th class="text-left">Status</th>
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
            </tr>
          </tbody>
        </v-table>
      </template>


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
