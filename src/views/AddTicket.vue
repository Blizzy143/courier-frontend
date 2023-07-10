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

onMounted(() => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getCustomers();
  getCouriers();
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
  if (pickupcustomer.value === null || deliverycustomer.value === null || courier.value === null) {
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
    <div id="body">
      <v-app-bar color="primary" app dark>
        <span class="mx-5">Add ticket</span>
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
          <v-text-field readonly variant="outlined" v-model="ticket.pickup_time" label="Pickup Time"  required></v-text-field>
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
