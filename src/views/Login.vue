<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";
import UserServices from "../services/UserServices";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const isLogin = ref(false);
const isCreateAccount = ref(false);


const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  number: "",
});

onMounted(async () => {

});


async function login() {
  // validate user mail and password

  if (user.value.email === "" || user.value.password == "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please enter email and password";
  } else {
    await UserServices.loginUser(user)
      .then((response) => {
        if (response.status === 200) {
          // save user details to local storage
          localStorage.setItem("user", JSON.stringify(response.data));
          snackbar.value.value = true;
          snackbar.value.color = "success";
          snackbar.value.text = "Login successful";
          if (response.data.user_role === "admin") {
            closeLogin();
            navigateToAdmin();
          }
        } else {
          snackbar.value.value = true;
          snackbar.value.color = "error";
          snackbar.value.text = "Login failed";
        }
      })
      .catch((error) => {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Login failed";
      });
  }
}
async function createAccount() {
  snackbar.value.value = true;
  snackbar.value.color = "success";
  snackbar.value.text = "Account created";
  closeCreateAccount();

}


async function openCreateAccount() {
  isCreateAccount.value = true;
}


async function closeCreateAccount() {
  isCreateAccount.value = false;
}


async function openLogin() {
  isLogin.value = true;
}

async function closeLogin() {
  isLogin.value = false;
}

async function navigateToAdmin() {
  router.push({ name: "admin" });
}


function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">

      <v-app-bar color="primary" app dark>
        <!-- -->
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="openLogin()">Login</v-btn>
        <v-btn v-if="false" color="secondary" @click="openCreateAccount()">Create Account</v-btn>
      </v-app-bar>


      <v-row>
        <v-col cols="12" md="6">
          <v-card-title class="headline mb-2">Welcome to Courier delivery system</v-card-title>
          <v-card-text>
            <p>
              Courier is a courier service that allows you to send and receive
              packages from anywhere in the world.
            </p>
            <p>
              Courier is a courier service that allows you to send and receive
              packages from anywhere in the world.
            </p>
            <p>
              Courier is a courier service that allows you to send and receive
              packages from anywhere in the world.
            </p>
          </v-card-text>
        </v-col>
        <v-col cols="12" md="6">
          <v-img :src="logo"></v-img>
        </v-col>
      </v-row>



      <v-dialog v-model="isLogin" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Login </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.email" label="Email" required></v-text-field>

            <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="closeLogin" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="login" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
            <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

            <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

            <v-text-field v-model="user.email" label="Email" required></v-text-field>
            <v-text-field v-model="user.number" label="Number" required></v-text-field>

            <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="closeCreateAccount" color="secondary">Close</v-btn>
            <v-btn variant="flat" @click="createAccount" color="primary">Create Account</v-btn>
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
