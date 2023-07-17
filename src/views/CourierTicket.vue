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
});



async function getTicket(id) {
  try {
    const response = await TicketServices.getTicket(id);
    ticket.value = response.data;
  } catch (error) {
    console.log(error);
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function updateStatus() {

  if (ticket.value.status == 'Picked up') {
    ticket.value.picked_up_time = new Date().toDateString() + " - "+new Date().toLocaleTimeString();
  } else if (ticket.value.status == 'Delivered') {
    ticket.value.delivery_time = new Date().toDateString() + " - "+new Date().toLocaleTimeString();
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
