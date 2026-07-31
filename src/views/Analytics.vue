<template>
    <div class="p-4 baseGrid">
      <div class="mb-4 flex gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="border p-2 rounded w-full"
        />
        <select v-model="sortKey" class="border p-2 rounded">
          <option value="city">City</option>
          <option value="tempC">Temperature</option>
          <option value="date">Date</option>
          <option value="windspeedKmph">Wind Speed</option>
          <option value="humidity">Humidity</option>
          <option value="chanceofrain">Chance of Rain</option>
          <option value="uvIndex">UV Index</option>
        </select>
        <button @click="toggleSortOrder" class="p-2 border rounded bg-gray-200">
          {{ sortOrder === 'asc' ? '⬆️' : '⬇️' }}
        </button>
            </div>
      <div class="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto ">
        <div v-for="item in filteredAndSortedItems" :key="item.city + item.date + item.hour" class="p-4 border rounded shadow gridItem">
          <h3 class="text-lg font-bold">{{ item.city }}</h3>
          <p>[ Temperature: {{ item.tempC }}ºC ] 
            [ Humidity {{ item.humidity }}% ]
            [ Wind {{item.windspeedKmph }} Km/h {{ item.winddir16Point }} ]
            [ UV index {{ item.uvIndex }} ]
          </p>
          <p>
            Rain: [ chance: {{ item.chanceofrain }}% ]
            [ Preciptation: {{ item.precipMM }}mm ]
            [ Cloud Coverage: {{ item.cloudcover }} ]

          </p>
          <p>Date: {{ item.date }} {{ item.hour }}:00</p>
        </div>
      </div>
    </div>      
  </template>
  
  <script lang="ts">
import { ref, computed, defineComponent, onMounted } from "vue";
import { getAnalytics, type AnalyticsItem } from "../services/openmeteo";
  
  export default defineComponent({
    setup() {
    const items = ref<AnalyticsItem[]>([]);

    onMounted(() => {
      fetchAndAddItem();
    });

    const fetchAndAddItem = async () => {
      try {
        items.value = [];
        const data = await getAnalytics(7);
        items.value = data;
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
      

      const search = ref<string>("");
      const sortKey = ref<keyof AnalyticsItem>("city");
      const sortOrder = ref<"asc" | "desc">("asc");
  
      const filteredAndSortedItems = computed(() => {
        return items.value
          .filter(item =>
            Object.values(item).some(val =>
              String(val).toLowerCase().includes(search.value.toLowerCase())
            )
          )
          .sort((a, b) => {
            const result = a[sortKey.value] > b[sortKey.value] ? 1 : -1;
            return sortOrder.value === "asc" ? result : -result;
          });
      });
  
      const toggleSortOrder = () => {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      };
  
      return { search, sortKey, sortOrder, filteredAndSortedItems, toggleSortOrder, fetchAndAddItem};
    }
  });
  </script>
  
  <style>
.baseGrid{
  background-image: url('/rust.jpg');
  background-size: 100% auto;
  margin:2px;
  border-radius: 20px;
  padding:1vh;
}
.gridItem{
  background-image: url('/polished.png');
  background-size: 100% auto;
  padding: 1%;
  margin:2px;
  border-radius: 20px;
}
.grid{
  overflow-y: auto; 
  max-height: 40em;
}

.gridItem p{
  color:navy;
}

::-webkit-scrollbar {
  width: 20px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px silver; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: navy; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: silver; 
}

button,
select,
input{
  color:navy;
  border-radius: 10px;
}
</style>