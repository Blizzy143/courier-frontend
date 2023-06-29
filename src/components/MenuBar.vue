<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();

const user = ref(null);
const title = ref("Courier delivery service");
const logoURL = ref("");

onMounted(() => {
  logoURL.value = ocLogo;
});

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
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="false" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <!-- <v-btn  v-if=" user !== null && user.user_type === 'user'" :to="{ name: 'user-trips' }" class="mx-2">
        My trips
      </v-btn> -->
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
                }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
