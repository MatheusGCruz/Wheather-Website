<script setup lang="ts">
import DayForecast from '../views/DayForecast.vue';

defineProps<{
  slug: string;
}>();
</script>

<template>
    <div class="greetings">
      <h1>Forecasts:</h1>
        <DayForecast :city="slug" day="0" /><br/><br/>
        <DayForecast :city="slug" day="1" /><br/><br/>
        <DayForecast :city="slug" day="2" /><br/><br/>
    </div>
  </template>

<style scoped>
h1 {
  font-weight: 600;
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  position: relative;
  top: -10px;
  text-align: center;
  color: var(--silver);
  background-image: url('/steel.jfif');
  background-size: 100% auto;
  -webkit-text-stroke: 0.2rem var(--ink);
  border-bottom: 2px solid var(--ember);
  padding-bottom: 0.2rem;
}

.greetings{
  background-image: url('/rust.jpg');
  background-size: 100% auto;
  margin:2px;
  border-radius: 20px;
  padding:1vh;
}
.greetings h1 {
  text-align: center;
  color: var(--silver);
  background-image: url('/steel.jfif');
  background-size: 100% auto;
  -webkit-text-stroke: 0.2rem var(--ink);
  border-bottom: 2px solid var(--ember);
  padding-bottom: 0.2rem;
}

@media (min-width: 1024px) {
  .greetings h1 {
    text-align: left;
  }
}
</style>
