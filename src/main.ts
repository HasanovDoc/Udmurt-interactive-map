import { createApp } from 'vue'
import App from './App.vue'
import { createYmaps } from 'vue-yandex-maps';
import {api} from '../api-key'

// createApp(App).mount('#app')

const app = createApp(App);

app.use(createYmaps({
    apikey: api[0].api_key,
    // importModules: ['@yandex/ymaps3-controls@0.0.1'],
}));

app.mount('#app');