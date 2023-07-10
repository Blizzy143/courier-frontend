<script setup>
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
  <v-app>

    <v-container>
      <MenuBar :key="$route.fullPath" />
      <v-main class="h-100">
        <router-view />
      </v-main>
    </v-container>
    
    <v-footer app absolute fixed padless>
      <div class="px-4 py-2 bg-primary text-center w-100">
        {{ new Date().getFullYear() }} — <strong>Courier delivery</strong>
      </div>
    </v-footer>
  </v-app>
</template>
