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
    const response = await TicketServices.getCourierTickets(
      savedUser.value.id
    );
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


function closeSnackBar() {
  snackbar.value.value = false;
}

function viewTicket(temp) {
  router.push("/courier-ticket/" + temp.id);
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


        <v-table class="rounded-lg elevation-5">
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
              <td>{{ temp.assigned_to.firstName }} {{ temp.assigned_to.lastName}}</td>
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
