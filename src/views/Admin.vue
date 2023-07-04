<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices.js";


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  number: "",
  user_role:"clerk"
});

onMounted(async () => {

  getClerks();
});
const showing = ref("home");

async function openHome() {
  showing.value = "home";
}

async function openPackages() {
  showing.value = "packages";
}

async function openCustomers() {
  showing.value = "customers";
}

async function openClerks() {
  showing.value = "clerks";
}

async function openCouriers() {
  showing.value = "couriers";
}

const addingClerk = ref(false);

async function addClerk(){
  await UserServices.addUser(user.value)
  .then((response) => {
    if (response.status === 200) {
      snackbar.value.value = true;
      snackbar.value.color = "success";
      snackbar.value.text = "Clerk created";
      addingClerk.value = false;
    } else {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Clerk creation failed";
    }
  })
  .catch((error) => {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Clerk creation failed";
  });
}

const clerks = ref([]);

async function getClerks(){
  await UserServices.getClerks()
  .then((response) => {
   clerks.value = response.data;
  })
  .catch((error) => {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Error fetching clerks";
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
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="openHome()">Home</v-btn>
        <v-btn color="secondary" @click="openPackages()">Packages</v-btn>
        <v-btn color="secondary" @click="openCustomers()">Customers</v-btn>
        <v-btn color="secondary" @click="openClerks()">Clerks</v-btn>
        <v-btn color="secondary" @click="openCouriers()">Couriers</v-btn>
      </v-app-bar>


      <v-row v-if="showing === 'home'" cols="12" justify="center">
        <v-col cols="12" md="8">
          <h1>Courier delivery service</h1>
          <p>
            Courier is a courier service that allows you to send and receive
            packages from anywhere in the world.
          </p>
        </v-col>
      </v-row>

      <template v-if="showing === 'packages'" cols="12" justify="center">

        <v-row class="my-5">
          <v-col cols="8">
            <h1>Packages</h1>
          </v-col>
          <v-col class="d-flex justify-end" cols="4">
            <v-btn color="accent" @click="openAdd()">Add</v-btn>
          </v-col>
        </v-row>
        <v-table class="rounded-lg elevation-5">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Pick up customer</th>
              <th class="text-left">Delivery customer</th>
              <th class="text-left">Corier</th>
            </tr>
          </thead>
          <tbody v-if="trip">
            <tr v-for="temp in trip.Itineraries" :key="temp.data">
              <td>Day {{ trip.Itineraries.indexOf(temp) + 1 }}</td>
              <td>{{ formatDate(temp.date) }}</td>
              <td>
                <v-list v-if="temp.Places.length > 0">
                  <v-list-item v-for="place in temp.Places" :key="place.name">
                    <v-chip class="mr-1" label color="cyan" prepend-icon="mdi-barley">
                      {{ place.name }}
                    </v-chip>
                  </v-list-item>
                </v-list>

                <v-chip class="ml-4 mb-2" v-if="user !== null && user.user_type === 'admin'" @click="selectPlace(temp)"
                  label color="green" prepend-icon="mdi-plus">
                  Add
                </v-chip>

              </td>
              <td>
                <v-chip v-if="temp.Hotel === null" label @click="selectHotel(temp)" color="cyan" prepend-icon="mdi-bed">
                  Select hotel
                </v-chip>

                <v-chip v-else label @click="selectHotel(temp)" color="cyan" prepend-icon="mdi-bed">
                  {{ temp.Hotel.name }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>

      </template>


      <template v-if="showing === 'clerks'" cols="12" justify="center">

        <v-row class="my-5">
          <v-col cols="8">
            <h1>Clerks</h1>
          </v-col>
          <v-col class="d-flex justify-end" cols="4">
            <v-btn color="accent" @click="addingClerk = true">Add</v-btn>
          </v-col>
        </v-row>
        <v-table class="rounded-lg elevation-5">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Name</th>
              <th class="text-left">Mail</th>
              <th class="text-left">Number</th>
            </tr>
          </thead>
          <tbody v-if="clerks">
            <tr v-for="temp in clerks" :key="temp.id">
              <td>{{ temp.id }}</td>
              <td>{{ temp.firstName }} {{ temp.lastName }}</td>
              <td>{{ temp.email }}</td>
              <td>{{ temp.number }}</td>
            </tr>
          </tbody>
        </v-table>


        <v-dialog v-model="addingClerk" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Clerk </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

            <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

            <v-text-field v-model="user.email" label="Email" required></v-text-field>
            <v-text-field v-model="user.number" label="Number" required></v-text-field>

            <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="addingClerk = false" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="addClerk" color="primary">Create clerk</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
