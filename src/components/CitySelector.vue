<template>
  <div class="city-selector">
    <h3>Select a location:</h3>
    <div class="location-selector">
      <label>
        Country
        <select v-model="selectedCountry">
          <option value="" disabled>Select a country</option>
          <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label>
        State
        <select v-model="selectedState" :disabled="!selectedCountry">
          <option value="" disabled>Select a state</option>
          <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
        </select>
      </label>
      <label>
        City
        <select v-model="selectedCity" :disabled="!selectedState">
          <option value="" disabled>Select a city</option>
          <option v-for="ct in cities" :key="ct.slug" :value="ct.slug">{{ ct.city }}</option>
        </select>
      </label>
    </div>

    <h2 v-if="selectedEntry" class="selected-info">
      {{ selectedEntry.city }} - {{ selectedEntry.state }} - {{ selectedEntry.country }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { CITIES, getCities, getCountries, getStates } from '../data/cities';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selectedCountry = ref<string>('');
const selectedState = ref<string>('');
const selectedCity = ref<string>('');
let suppressWatch = false;

const countries = computed(() => getCountries());
const states = computed(() => (selectedCountry.value ? getStates(selectedCountry.value) : []));
const cities = computed(() =>
  selectedCountry.value && selectedState.value
    ? getCities(selectedCountry.value, selectedState.value)
    : []
);

const selectedEntry = computed(() =>
  CITIES.find((entry) => entry.slug === props.modelValue)
);

watch(selectedCountry, () => {
  if (suppressWatch) return;
  selectedState.value = '';
  selectedCity.value = '';
  emit('update:modelValue', '');
});

watch(selectedState, () => {
  if (suppressWatch) return;
  selectedCity.value = '';
  emit('update:modelValue', '');
});

watch(selectedCity, () => {
  if (suppressWatch || !selectedCity.value) return;
  emit('update:modelValue', selectedCity.value);
});

watch(
  () => props.modelValue,
  (slug) => {
    const entry = CITIES.find((city) => city.slug === slug);
    suppressWatch = true;
    if (entry) {
      selectedCountry.value = entry.country;
      selectedState.value = entry.state;
      selectedCity.value = entry.slug;
    }
    suppressWatch = false;
  },
  { immediate: true },
);
</script>

<style scoped>
.city-selector {
  background-image: url('/polished.png');
  background-size: 100% auto;
  border-radius: 20px;
  padding: 1vh;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

.city-selector h3 {
  margin: 0 0 0.5rem 0;
  color: var(--ink);
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.location-selector {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.location-selector label {
  display: flex;
  flex-direction: column;
  color: var(--steel);
  font-weight: 600;
}

.location-selector select {
  color: var(--ink);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.25rem;
  margin-top: 0.25rem;
  font-family: var(--font-body);
}

.location-selector select:focus {
  outline: 2px solid var(--sky);
  outline-offset: 1px;
}

.selected-info {
  margin-top: 0.5rem;
  color: var(--ink);
  font-size: 1.5rem;
  letter-spacing: 0.03em;
}
</style>
