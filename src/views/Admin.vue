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


onMounted(async () => {

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
          <v-col  class="d-flex justify-end" cols="4">
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

                    <v-chip class="ml-4 mb-2" v-if="user !== null && user.user_type === 'admin'"
                      @click="selectPlace(temp)" label color="green" prepend-icon="mdi-plus">
                      Add
                    </v-chip>

                  </td>
                  <td>
                    <v-chip v-if="temp.Hotel === null" label @click="selectHotel(temp)" color="cyan"
                      prepend-icon="mdi-bed">
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
