<template>
  <div class="forecasts">
    <h2> Day: {{forecastDay}}</h2>
    
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-thermometer-empty']" /> Temperature: 
            <span class="tooltip">Temperature (in ºC)</span>
            Min: {{ minTempC }}ºC  / Avg: {{ medTempC }}ºC / Max: {{ maxTempC }}ºC 
        </div>
        <br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-cloud']" /> UV Index: 
            <span class="tooltip">
              <p>Ultra Violet Index:</p>
              <p>0-2    - Low </p>
              <p>3-5    - Moderate</p>
              <p>6-7    - High</p>
              <p>8-10   - Very High</p>
              <p>11+    - Extreme</p>
            </span>
            {{ uvIndex }}
        </div>
        <br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-sun']" /> Sun Hours: 
            <span class="tooltip">Sun hours (in ºC)</span>
            {{sunHour}} 
        </div>
        <br/>
        <div class="icon-container">
            <font-awesome-icon :icon="['fas', 'fa-snowflake']" /> Snow Coverage: 
            <span class="tooltip">Snow coverage in cm</span>
            {{totalSnow}} 
        </div>
        <br/>
        <div>
          <!-- {{ returnValue }} -->
        </div>
    </div>


</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { getDailyForecast } from '../services/openmeteo';

export default defineComponent({
    props: {
    day: {
      type: String,
      required: true
    },
  },
  setup(props) {
    const subdirectory = ref<string>('');
    const loading = ref<boolean>(true);
    const minTempC = ref<number>(0);
    const maxTempC = ref<number>(0);
    const medTempC = ref<number>(0);
    const forecastDay = ref<string>('');
    const sunHour = ref<number>(0);
    const totalSnow = ref<number>(0);
    const uvIndex = ref<number>(0);

    const fetchData = async () => {
      try {
        subdirectory.value = window.location.pathname.slice(1);
        const forecast = await getDailyForecast(subdirectory.value);
        
        forecastDay.value = forecast[Number(props.day)].date;
        minTempC.value = forecast[Number(props.day)].mintempC;
        maxTempC.value = forecast[Number(props.day)].maxtempC;
        uvIndex.value = forecast[Number(props.day)].uvIndex;
        medTempC.value = forecast[Number(props.day)].avgtempC;
        sunHour.value = forecast[Number(props.day)].sunHour;
        totalSnow.value = forecast[Number(props.day)].totalSnow_cm;

      } catch {
        //error.value = (err as Error).message || 'Failed to fetch icon';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {totalSnow, sunHour, forecastDay,minTempC,maxTempC, medTempC, subdirectory, uvIndex };
  }

  
});
</script>

<style scoped>
.forecasts{
  background-image: url('/polished.png');
  background-size: 100% auto;
  padding: 1%;
  margin:2px;
  border-radius: 20px;
}
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
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

.tooltip p{
  background-color: black;
  color: #fff;
}

.icon-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>