<script setup lang="ts">
import { ref } from 'vue'
import CitySelector from './components/CitySelector.vue';
import HomePage from './views/HomePage.vue';
import ForecastSection from './views/ForecastSection.vue';

const selectedCity = ref<string>('araguari');
</script>

<template>
  <div class="page">
    <CitySelector v-model="selectedCity" class="title-panel" />
    <div class="content-row">
      <HomePage :slug="selectedCity" class="weather-panel" />
      <ForecastSection :slug="selectedCity" class="forecast-panel" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1vh;
  width: 95%;
  height: 95%;
  margin: 2.5% auto;
}

.title-panel {
  width: 80vw;
  height: 15vh;
}

.content-row {
  display: flex;
  justify-content: center;
  gap: 1vw;
  width: 100%;
  flex: 1;
  min-height: 0;
}

.weather-panel,
.forecast-panel {
  width: 40vw;
  height: 55vh;
  overflow: auto;
  box-sizing: border-box;
  border-radius: 2%;
}
</style>
