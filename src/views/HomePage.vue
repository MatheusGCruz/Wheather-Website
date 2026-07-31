<template>
    <div class="greetings">
      <h1>Current Weather:</h1>
        <h2>City: {{city}} - {{ country }}</h2>
        <br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-thermometer-empty']" /> Temperature: {{temperature}}ºC - Sensation {{ feeling }}ºC
            <span class="tooltip">Temperature (in ºC)</span>
        </div>
        <br/><br/>

        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-cloud']" /> Cloud Coverage: {{cloudCover}}%
            <span class="tooltip">Cloud Coverage</span>
        </div>
        <br/><br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-tint']" /> Precipitation: {{preciptation}}mm
            <span class="tooltip">Preciptation (in mm)</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-sun']" /> UV Index: {{uvIndex}}
            <span class="tooltip">Ultra Violet Index</span>
        </div>
        <br/><br/>  
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-clock']" /> Observation Date: {{obsDate}}
            <span class="tooltip">Date and time of the measurement</span>
        </div>
        <br/><br/>   
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-clock']" /> Local time: {{ localDate }}
            <span class="tooltip">Date and time of the measurement (in the local time offset )</span>
        </div>
    </div>
    <div>
      <router-link to="/araguari">
        Go to Araguari 
      </router-link>
      <router-link to="/araxa">
        Go to Araxa 
      </router-link>
      <router-link to="/uberlandia">
        Go to Uberlandia 
      </router-link>
    </div>
    <br/>
    <br/>

    <!-- <div>teste {{ subError }}</div> -->
    <p v-if="loading">Loading weather...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
  </template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { getCurrentWeather } from '../services/openmeteo';

library.add(fas);

export default defineComponent({
  setup() {
    const subdirectory = ref<string>('');  // Reactive reference to store subdirectory

    const city = ref<string | null>(null);
    const country = ref<string | null>(null);
    const temperature = ref<number | null>(null);
    const preciptation = ref<number | null>(null);
    const cloudCover = ref<number | null>(null);
    const humidity = ref<number | null>(null);
    const uvIndex = ref<number | null>(null);
    const visibility = ref<number | null>(null);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
    const obsDate = ref<string | null>(null);
    const localDate = ref<string | null>(null);
    const feeling = ref<number | null>(null);

    const fetchData = async () => {
      try {
        subdirectory.value = window.location.pathname.slice(1);
        const current = await getCurrentWeather(subdirectory.value);

        temperature.value = current.temperature;
        preciptation.value = current.precipitation;
        uvIndex.value = current.uvIndex;
        obsDate.value = current.obsDate;
        localDate.value = current.obsDate;
        city.value = current.city;
        country.value = current.country;
        visibility.value = current.visibility;
        humidity.value = current.humidity;
        cloudCover.value = current.cloudCover;
        feeling.value = current.feeling;
      } catch (err) {
        error.value = (err as Error).message || 'Failed to fetch weather';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return { country, localDate, obsDate, subdirectory, city, temperature, preciptation, cloudCover, humidity, uvIndex, visibility, loading, error, feeling };
  }
});
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  color: navy;
}
h2{
  color:midnightblue;
}

h3 {
  font-size: 1.2rem;
}
.greetings{
  background-image: url('/polished.png');
  background-size: 100% auto;
  padding:5%
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: midnightblue;
}

.tooltip {
  visibility: hidden;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 10px;
  border-radius: 5px;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.icon-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>