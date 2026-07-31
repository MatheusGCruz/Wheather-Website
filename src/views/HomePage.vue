<template>
    <div class="current">
      <h1>Current Weather:</h1>
        <div class="weather-details">
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-thermometer-empty']" /> Temperature: {{truncate2(temperature)}}ºC - Sensation {{ truncate2(feeling) }}ºC
            <span class="tooltip">Temperature (in ºC)</span>
        </div>
        <br/><br/>

        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-cloud']" /> Cloud Coverage: {{truncate2(cloudCover)}}%
            <span class="tooltip">Cloud Coverage</span>
        </div>
        <br/><br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-tint']" /> Precipitation: {{truncate2(preciptation)}}mm
            <span class="tooltip">Preciptation (in mm)</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-sun']" /> UV Index: {{truncate2(uvIndex)}}
            <span class="tooltip">Ultra Violet Index</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-cloud']" /> Condition: {{condition}}
            <span class="tooltip">Current meteorological condition</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-tint']" /> Humidity: {{truncate2(humidity)}}%
            <span class="tooltip">Relative humidity</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-wind']" /> Wind: {{truncate2(windSpeed)}} km/h {{windDirection}}
            <span class="tooltip">Wind speed and direction</span>
        </div>
        <br/><br/>
        <div  class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-eye']" /> Visibility: {{ visibilityKm }} km
            <span class="tooltip">Visibility in km</span>
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
    </div>
  </template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { getCurrentWeather } from '../services/openmeteo';
import { truncate2 } from '../utils/format';

library.add(fas);

export default defineComponent({
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const city = ref<string | null>(null);
    const country = ref<string | null>(null);
    const temperature = ref<number | null>(null);
    const preciptation = ref<number | null>(null);
    const cloudCover = ref<number | null>(null);
    const humidity = ref<number | null>(null);
    const uvIndex = ref<number | null>(null);
    const visibility = ref<number | null>(null);
    const windSpeed = ref<number | null>(null);
    const windDirection = ref<string | null>(null);
    const condition = ref<string | null>(null);
    const loading = ref<boolean>(true);
    const error = ref<string | null>(null);
    const obsDate = ref<string | null>(null);
    const localDate = ref<string | null>(null);
    const feeling = ref<number | null>(null);
    const visibilityKm = computed(() =>
      visibility.value != null ? truncate2(visibility.value / 1000) : null
    );

    const fetchData = async () => {
      if (!props.slug) {
        loading.value = false;
        return;
      }
      try {
        loading.value = true;
        error.value = null;
        const current = await getCurrentWeather(props.slug);

        temperature.value = current.temperature;
        preciptation.value = current.precipitation;
        uvIndex.value = current.uvIndex;
        obsDate.value = current.obsDate;
        localDate.value = current.obsDate;
        city.value = current.city;
        country.value = current.country;
        visibility.value = current.visibility;
        windSpeed.value = current.windSpeed;
        windDirection.value = current.windDirection;
        condition.value = current.condition;
        humidity.value = current.humidity;
        cloudCover.value = current.cloudCover;
        feeling.value = current.feeling;
      } catch (err) {
        error.value = (err as Error).message || 'Failed to fetch weather';
      } finally {
        loading.value = false;
      }
    };

    watch(() => props.slug, fetchData, { immediate: true });

    return { country, localDate, obsDate, city, temperature, preciptation, cloudCover, humidity, uvIndex, visibilityKm, windSpeed, windDirection, condition, loading, error, feeling, truncate2 };
  }
});
</script>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  top: -10px;
  color: var(--silver);
  background-image: url('/steel.jfif');
  background-size: 100% auto;
  -webkit-text-stroke: 0.2rem var(--ink);
  border-bottom: 2px solid var(--ember);
  padding-bottom: 0.2rem;
}
.current{
  width: 50%;
  height: 70%;
  background-image: url('/rust.jpg');
  background-size: 100% auto;
  border-radius: 20px;
  padding: 2%;
  box-sizing: border-box;
  overflow: auto;
}

.weather-details {
  background-image: url('/polished.png');
  background-size: 100% auto;
  padding: 2%;
  border-radius: 20px;
}

.current h1,
.current h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .current h1,
  .current h3 {
    text-align: left;
  }
}

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.tooltip {
  visibility: hidden;
  background-color: var(--ink);
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

.error {
  color: var(--ember);
}
</style>
