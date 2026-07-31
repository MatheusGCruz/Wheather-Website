import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'; // Import icons

import App from './App.vue'

library.add(faHome, faUser);

const app = createApp(App)

app.use(createPinia())

app.component('font-awesome-icon', FontAwesomeIcon); 
app.mount('#app')
