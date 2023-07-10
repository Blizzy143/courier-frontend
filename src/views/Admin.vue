<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices.js";
import AdminServices from "../services/AdminServices";
import TicketServices from "../services/TicketServices";


const router = useRouter();

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
  user_role: "clerk"
});

const savedUser = ref(null);

onMounted(async () => {
  savedUser.value = JSON.parse(localStorage.getItem("user"));
  getClerks();
  getCompany();
  getCustomers();
  getCouriers();
  getTickets();
});

const tickets = ref([]);

async function getTickets() {
  await TicketServices.getTickets()
    .then((response) => {
      tickets.value = response.data;
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching tickets";
    });
}


const company = ref(null)

async function getCompany() {
  await AdminServices.getCompanyDetails()
    .then((response) => {
      // store to local storage
      localStorage.setItem("company", JSON.stringify(response.data[0]));
      company.value = response.data[0];
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching company";
    });
}


const showing = ref("home");

async function openHome() {
  showing.value = "home";
  getCompany();
}

async function openPackages() {
  showing.value = "packages";
  getTickets();
}

async function openCustomers() {
  showing.value = "customers";
  getCustomers();
}

async function openClerks() {
  showing.value = "clerks";
  getClerks();
}

async function openCouriers() {
  showing.value = "couriers";
  getCouriers();
}

const addingClerk = ref(false);

async function addClerk() {
  await UserServices.addUser(user.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Clerk created";
        addingClerk.value = false;
        getClerks();
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

async function getClerks() {
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

async function deleteClerk(temp) {
  temp.user_role = "deleted_clerk";
  temp.email= temp.email + "_deleted";
  await UserServices.updateUser(temp)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Clerk deleted";
        getClerks();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Clerk deletion failed";
      }
    })
}


const isupdateCompany = ref(false);

async function showCompanyUpdate() {
  isupdateCompany.value = true;
}

async function closeUpdate() {
  isupdateCompany.value = false;
}

async function updateCompany() {
  await AdminServices.updateCompanyDetails(company.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Company updated";
        isupdateCompany.value = false;
        getCompany();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Company update failed";
      }
    })
}

async function logout() {
  // clear local storage
  localStorage.clear();
  // redirect to login
  router.push({ name: "login" });
}


const addingCustomer = ref(false);

const customer = ref({
  name: "",
  number: "",
  location: "",
  delivery_instructions: ""
});

async function addCustomer() {
  await AdminServices.addCustomer(customer.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Customer created";
        addingCustomer.value = false;
        getCustomers();
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

const customers = ref([]);

async function getCustomers() {
  await AdminServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching customers";
    });
}

async function deleteCustomer(temp) {
  await AdminServices.deleteCustomer(temp.id)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Customer deleted";
        getCustomers();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Customer deletion failed";
      }
    })
}


const updatingCustomer = ref(false);
const selectedCustomer = ref(null);

async function showUpdateCustomer(temp) {
  selectedCustomer.value = temp;
  updatingCustomer.value = true;
}

async function updateCustomer() {
  await AdminServices.updateCustomer(selectedCustomer.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Customer updated";
        updatingCustomer.value = false;
        getCustomers();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Customer update failed";
      }
    })
}


const couriers = ref([]);
const addingCourier = ref(false);
const updatingCouriers = ref(false);
const selectedCourier = ref(null);

const courier = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  number: "",
  user_role: "courier"
});

async function getCouriers() {
  await UserServices.getCouriers()
    .then((response) => {
      couriers.value = response.data;
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Error fetching couriers";
    });
}


async function addCourier() {
  await UserServices.addUser(courier.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Courier created";
        addingCourier.value = false;
        getCouriers();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Courier creation failed";
      }
    })
    .catch((error) => {
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = "Courier creation failed";
    });
}


async function deleteCourier(temp) {
  temp.user_role = "deleted_courier";
  temp.email= temp.email + "_deleted";
  await UserServices.updateUser(temp)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Courier deleted";
        getCouriers();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Courier deletion failed";
      }
    })
}

async function showUpdateCourier(temp) {
  selectedCourier.value = temp;
  updatingCouriers.value = true;
}

async function updateCourier() {
  await UserServices.updateUser(selectedCourier.value)
    .then((response) => {
      if (response.status === 200) {
        snackbar.value.value = true;
        snackbar.value.color = "success";
        snackbar.value.text = "Courier updated";
        updatingCouriers.value = false;
        getCouriers();
      } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Courier update failed";
      }
    })
}


async function openAddTicket() {
  router.push({ name: "ticket" });
}

</script>

<template>
  <v-container>
    <div id="body">

      <v-app-bar color="primary" app dark>
        <span class="mx-5" v-if="savedUser">{{ savedUser.firstName }} {{ savedUser.lastName }}</span>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="openHome()">Home</v-btn>
        <v-btn color="secondary" @click="openPackages()">Packages</v-btn>
        <v-btn color="secondary" @click="openCustomers()">Customers</v-btn>
        <v-btn color="secondary" @click="openClerks()">Clerks</v-btn>
        <v-btn color="secondary" @click="openCouriers()">Couriers</v-btn>
        <v-btn color="secondary" @click="logout()">Logout</v-btn>
      </v-app-bar>

      <template v-if="company">

        <v-card v-if="showing === 'home'" class="rounded-lg elevation-5">
          <v-col cols="12" md="12">
            <v-row class="mx-1 my-1">

              <h1>{{ company.name }}</h1>
              <v-spacer></v-spacer>
              <v-chip @click="showCompanyUpdate" label color="cyan"> Update</v-chip>
            </v-row>
            <p>{{ company.description }}</p>
            <p>{{ company.number }}</p>
            <p>{{ company.email }}</p>
            <p>{{ company.location }}</p>
          </v-col>
        </v-card>
      </template>

      <template v-if="showing === 'packages'" cols="12" justify="center">

        <v-row class="my-5">
          <v-col cols="8">
            <h1>Packages</h1>
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
              <td>{{ temp.assigned_to.firstName }} {{ temp.assigned_to.lastName}}</td>
              <td>{{ temp.status }}</td>
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
              <td> <v-chip label @click="deleteClerk(temp)" color="red" prepend-icon="mdi-delete">Delete</v-chip></td>

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

      <template v-if="showing === 'customers'" cols="12" justify="center">

        <v-row class="my-5">
          <v-col cols="8">
            <h1>Customers</h1>
          </v-col>
          <v-col class="d-flex justify-end" cols="4">
            <v-btn color="accent" @click="addingCustomer = true">Add</v-btn>
          </v-col>
        </v-row>
        <v-table class="rounded-lg elevation-5">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Name</th>
              <th class="text-left">Number</th>
              <th class="text-left">Location</th>
              <th class="text-left">Delivery instructions</th>

            </tr>
          </thead>
          <tbody v-if="customers">
            <tr v-for="temp in customers" :key="temp.id">
              <td>{{ temp.id }}</td>
              <td>{{ temp.name }}</td>
              <td>{{ temp.number }}</td>
              <td>{{ temp.location }}</td>
              <td>{{ temp.delivery_instructions }}</td>
              <td> <v-chip label @click="showUpdateCustomer(temp)" color="cyan" prepend-icon="mdi-pencil">Update</v-chip>
              </td>
              <td> <v-chip label @click="deleteCustomer(temp)" color="red" prepend-icon="mdi-delete">Delete</v-chip></td>

            </tr>
          </tbody>
        </v-table>


        <v-dialog v-model="addingCustomer" width="800">
          <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Create Customer </v-card-title>
            <v-card-text>
              <v-text-field v-model="customer.name" label="Name" required></v-text-field>
              <v-text-field v-model="customer.number" label="Number" required></v-text-field>
              <v-text-field v-model="customer.location" label="Location" required></v-text-field>
              <v-text-field v-model="customer.delivery_instructions" label="Delivery instructions"
                required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" @click="addingCustomer = false" color="secondary">Close</v-btn>
              <v-btn variant="flat" @click="addCustomer" color="primary">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog v-model="updatingCustomer" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Customer </v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedCustomer.name" label="Name" required></v-text-field>
            <v-text-field v-model="selectedCustomer.number" label="Number" required></v-text-field>
            <v-text-field v-model="selectedCustomer.location" label="Location" required></v-text-field>
            <v-text-field v-model="selectedCustomer.delivery_instructions" label="Delivery instructions"
              required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="updatingCustomer = false" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="updateCustomer" color="primary">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      </template> 
      
      <template v-if="showing === 'couriers'" cols="12" justify="center">

        <v-row class="my-5">
          <v-col cols="8">
            <h1>Couriers</h1>
          </v-col>
          <v-col class="d-flex justify-end" cols="4">
            <v-btn color="accent" @click="addingCourier = true">Add</v-btn>
          </v-col>
        </v-row>
        <v-table class="rounded-lg elevation-5">
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th class="text-left">Name</th>
              <th class="text-left">Email</th>
              <th class="text-left">Number</th>

            </tr>
          </thead>
          <tbody v-if="couriers">
            <tr v-for="temp in couriers" :key="temp.id">
              <td>{{ temp.id }}</td>
              <td>{{ temp.firstName }} {{ temp.lastName }}</td>
              <td>{{ temp.email }}</td>
              <td>{{ temp.number }}</td>

              <td> <v-chip label @click="showUpdateCourier(temp)" color="cyan" prepend-icon="mdi-pencil">Update</v-chip>
              </td>
              <td> <v-chip label @click="deleteCourier(temp)" color="red" prepend-icon="mdi-delete">Delete</v-chip></td>

            </tr>
          </tbody>
        </v-table>


        <v-dialog v-model="addingCourier" width="800">
          <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mb-2">Create Courier </v-card-title>
            <v-card-text>
              <v-text-field v-model="courier.firstName" label="First Name" required></v-text-field>

              <v-text-field v-model="courier.lastName" label="Last Name" required></v-text-field>

              <v-text-field v-model="courier.email" label="Email" required></v-text-field>
              <v-text-field v-model="courier.number" label="Number" required></v-text-field>

              <v-text-field v-model="courier.password" label="Password" type="password" required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" @click="addingCourier = false" color="secondary">Close</v-btn>
              <v-btn variant="flat" @click="addCourier" color="primary">Create</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog v-model="updatingCouriers" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Update Courier </v-card-title>
          <v-card-text>
              <v-text-field v-model="selectedCourier.firstName" label="First Name" required></v-text-field>
              <v-text-field v-model="selectedCourier.lastName" label="Last Name" required></v-text-field>
              <v-text-field v-model="selectedCourier.email" label="Email" required></v-text-field>
              <v-text-field v-model="selectedCourier.number" label="Number" required></v-text-field>
            </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="updatingCouriers = false" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="updateCourier" color="primary">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      </template>

      <v-dialog v-model="isupdateCompany" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Update company </v-card-title>
          <v-card-text>
            <v-text-field v-model="company.name" label="Name" required></v-text-field>

            <v-text-field v-model="company.description" label="Description" required></v-text-field>

            <v-text-field v-model="company.location" label="Location" required></v-text-field>
            <v-text-field v-model="company.number" label="Number" required></v-text-field>
            <v-text-field v-model="company.email" label="Email" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="isupdateCompany = false" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="updateCompany" color="primary">Update</v-btn>
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
  </v-container></template>
