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

async function openEditTicket(ticket) {
  router.push("edit/" + ticket.id);
}

async function deleteTicket(ticket) {
  if (!confirm("Are you sure you want to delete this ticket?"))
    return;
  try {
    const response = await TicketServices.deleteTicket(ticket.id);
    snackbar.value = {
      value: true,
      color: "success",
      text: "Ticket deleted successfully",
    };
    getCourierTickets();
  } catch (error) {
    snackbar.value = {
      value: true,
      color: "error",
      text: "Error deleting ticket",
    };
  }
}


const addingCustomer = ref(false);

const customer = ref({
  name: "",
  number: "",
  location: "",
  delivery_instructions: ""
});

const avenues = ref(["1st Ave", "2nd Ave", "3rd Ave", "4th Ave", "5th Ave", "6th Ave", "7th Ave"]);
const selectedAvenue = ref("");
const streets = ref(["A street", "B street", "C street", "D street", "E street", "F street", "G street",]);
const selectedStreet = ref("");

async function addCustomer() {

  // validate customer
  if (customer.value.name === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Name is required";
    return;
  }
  if (customer.value.number === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Number is required";
    return;
  }
  if (selectedAvenue.value === "" || selectedStreet.value === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Location is required";
    return;
  }

  customer.value.location = selectedAvenue.value + " And " + selectedStreet.value;

  await AdminServices.addCustomer(customer.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Customer created";
        addingCustomer.value = false;
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Customer creation failed";
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Customer creation failed";
    });
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-app-bar color="primary" app dark>
        <span class="mx-5" v-if="savedUser">{{ savedUser.firstName }} {{ savedUser.lastName }}</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="addingCustomer = true">Add Customer</v-btn>
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
              <th class="text-left">Edit</th>
              <th class="text-left">Delete</th>
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
              <td>
                <v-btn class="mx-2" color="primary" @click="openEditTicket(temp)">Edit</v-btn>
              </td>
              <td> <v-btn class="mx-2" color="error" @click="deleteTicket(temp)">Delete</v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </template>

      <v-dialog v-model="addingCustomer" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Customer </v-card-title>
          <v-card-text>
            <v-text-field v-model="customer.name" label="Name" required></v-text-field>
            <v-text-field v-model="customer.number" label="Number" type="number" required></v-text-field>
            <v-row>
              <v-col cols="12" sm="6">
                <v-select v-model="selectedAvenue" :items="avenues" item-title="name" item-value="name"
                  label="Select Avenue" return-object required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="selectedStreet" :items="streets" item-title="name" item-value="name"
                  label="Select Street" return-object required></v-select>
              </v-col>
            </v-row>
            <v-text-field v-model="customer.delivery_instructions" label="Delivery instructions" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="addingCustomer = false" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="addCustomer" color="primary">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
