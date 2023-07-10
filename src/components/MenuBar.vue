<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import AdminServices from "../services/AdminServices";

const router = useRouter();

const user = ref(null);
const logoURL = ref("");

const company = ref(null);

const savedCompany= ref (null);


onMounted(() => {
  logoURL.value = ocLogo;
  getCompany();
  savedCompany.value  = JSON.parse(localStorage.getItem("company"));
});

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

function logout() {
}
</script>

<template>
  <div>
    <v-app-bar color="primary" app dark>
      <!-- <router-link :to="{ name: 'destinations' }">
        <v-img
          class="mx-5"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link> -->
      <v-toolbar-title v-if="savedCompany" class="title">
        {{ savedCompany.name }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="false" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
    </v-app-bar>
  </div>
</template>
