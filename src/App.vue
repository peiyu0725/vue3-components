<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import FullCalendar from "./components/FullCalendar.vue";
import DateTimePicker from './components/DateTimePicker.vue'

const drawer = ref(true);
const rail = ref(true);
const items = reactive([
  { title: "Calendar", value: "calendar", icon: "mdi-calendar-month", url: '/' },
  { title: "DateTime Picker", value: "picker", icon: "mdi-clock-outline", url: '/dateTimePicker' },
  { title: "Element Editor", value: "editor", icon: "mdi-drawing-box", url: '/editor' }
]);
const active = ref("calendar");
const onChangeActive = (val) => {
  active.value = val
}
</script>
<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item prepend-avatar="https://cdn.pixabay.com/photo/2018/04/28/15/26/dog-3357495_960_720.jpg"
        title="Vue3 Components" nav>
        <template v-slot:append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>
      <v-list density="compact" nav>
        <v-list-item v-for="(item, index) in items" :key="index" :to="item.url" :prepend-icon="item.icon"
          :title="item.title" :value="item.value" @click="onChangeActive(item.value)"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view :drawerRail="rail"></router-view>
    </v-main>
  </v-layout>
</template>
<style lang="scss" scoped>
.v-layout {
  height: 100%;
}
</style>