<script setup>
import { ref, reactive, onMounted } from "vue";
import { DatePicker } from "v-calendar";
const date = ref(new Date());
const time = ref(new Date());
const dateTime = ref(new Date());
const range = reactive({
  start: "",
  end: "",
});
</script>
<template>
  <div class="picker-wrapper">
    <div class="range-title">Date Picker</div>
    <DatePicker v-model="date" mode="date" :popover="{ visibility: 'focus' }">
      <template v-slot="{ inputValue, inputEvents }">
        <v-text-field v-on="inputEvents" :value="inputValue" class="picker-input"
          prepend-inner-icon="mdi-calendar-blank" hide-details readonly></v-text-field>
      </template>
    </DatePicker>
    <div class="range-title">Time Picker</div>
    <DatePicker v-model="time" mode="time" :popover="{ visibility: 'focus' }">
      <template v-slot="{ inputValue, inputEvents }">
        <v-text-field v-on="inputEvents" :value="inputValue" class="picker-input" prepend-inner-icon="mdi-clock-outline"
          hide-details readonly></v-text-field>
      </template>
    </DatePicker>
    <div class="range-title">DateTime Picker</div>
    <DatePicker v-model="dateTime" mode="dateTime" :popover="{ visibility: 'focus' }">
      <template v-slot="{ inputValue, inputEvents }">
        <v-text-field v-on="inputEvents" :value="inputValue" class="picker-input"
          prepend-inner-icon="mdi-calendar-clock" hide-details readonly></v-text-field>
      </template>
    </DatePicker>
    <div class="range-title">Date Range Picker</div>
    <DatePicker v-model="range" :popover="{ visibility: 'focus' }" is-range>
      <template v-slot="{ inputValue, inputEvents }">
        <div class="range-inputs">
          <v-text-field v-on="inputEvents.start" :value="inputValue.start" class="picker-input"
            prepend-inner-icon="mdi-calendar-range" hide-details readonly></v-text-field>
          <div class="range-dash">-</div>
          <v-text-field v-on="inputEvents.end" :value="inputValue.end" class="picker-input"
            prepend-inner-icon="mdi-calendar-range" hide-details readonly></v-text-field>
        </div>
      </template>
    </DatePicker>
  </div>
</template>
<style lang="scss">
.range-title {
  margin: 20px 0 5px 0;
}

.range-inputs {
  display: flex;
  align-items: center;

  .range-dash {
    margin: 0 10px;
  }
}

.picker-input {
  max-width: 240px;

  .v-field__outline,
  .v-field__overlay {
    display: none;
  }

  .v-field {
    border: 1px solid #979797;
    border-radius: 10px;
  }

  .v-field__prepend-inner {
    padding: 8px 0;
  }

  input {
    min-height: 40px;
    padding: 0 10px;
  }
}

.vc-time-picker {
  .vc-time-date {
    display: none;
  }
}

.vc-highlight {
  background-color: #008edb !important;
}

.vc-highlight-base-start,
.vc-highlight-base-middle,
.vc-highlight-base-end {
  background-color: #e1f5fe !important;
}

.vc-select select {
  background-color: #e1f5fe !important;
  border-color: #e1f5fe !important;
}

.vc-am-pm {
  background-color: #e1f5fe !important;
}

button.active {
  background-color: #008edb !important;
}
</style>