<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
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

onMounted(() => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getTicket();
  getCustomers();
  getCouriers();
});


const currentTicket = ref(null);

async function getTicket() {
  const response = await TicketServices.getTicket(route.params.id);
  if (response.status === 200) {
    currentTicket.value = response.data;
    pickupcustomer.value = currentTicket.value.pickup_customer;
    deliverycustomer.value = currentTicket.value.delivery_customer;
    courier.value = currentTicket.value.assigned_to;

  }
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
    couriers.value = response.data;
  }
}



const pickupcustomer = ref(null);
const deliverycustomer = ref(null);
const courier = ref(null);


async function addTicket(){

  currentTicket.value.pickupCustomerId = pickupcustomer.value.id;
  currentTicket.value.deliveryCustomerId = deliverycustomer.value.id;
  currentTicket.value.creatorId = savedUser.value.id;
  currentTicket.value.assignedToId = courier.value.id;

 await TicketServices.updateTicket(currentTicket.value)
 .then((response) => {
   if (response.status === 200) {
     snackbar.value = {
       value: true,
       color: "success",
       text: "Ticket updated successfully",
     };

     // sleep for 2 seconds
      setTimeout(() => {
        router.back();
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
    
</script>

<template>
  <v-container>
    <div id="body" v-if="currentTicket">
      <v-app-bar color="primary" app dark>
        <span class="mx-5">Update ticket</span>
      </v-app-bar>

      <v-card class="mx-5 my-5 py-5">
        <v-card-title class="headline mb-2"> Ticket details
        </v-card-title>
        <v-card-text>
          <v-select  variant="outlined" v-model="pickupcustomer" :items="customers" item-title="name" item-value="name"
            label="Pick up customer" return-object required>
          </v-select>

          <v-select variant="outlined" v-model="deliverycustomer" :items="customers" item-title="name" item-value="name"
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
          <v-text-field readonly variant="outlined" v-model="currentTicket.pickup_time" label="Pickup Time"  required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="currentTicket.bill_pickup" label="Pickup Bill" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="currentTicket.est_delivery_time" label="Estimated delivery Time" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="currentTicket.bill_delivery" label="Delivery Bill" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="currentTicket.est_blocks" label="Estimated blocks" type="number" required></v-text-field>
          <v-text-field readonly variant="outlined" v-model="currentTicket.quoted_price" label="Quoted price" type="number" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="addTicket" variant="flat" class="mr-2" color="primary">Update ticket</v-btn>
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
