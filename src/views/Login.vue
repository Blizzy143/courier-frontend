<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import logo from "/icon.svg";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  
});


function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">


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
