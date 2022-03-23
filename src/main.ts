import { createApp } from 'vue';
import App from './App.vue';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';
import { Quasar } from 'quasar';
import { quasarOptions } from '@/quasar-options';
import vClickOutside from 'click-outside-vue3';

const app = createApp(App);

app.use(Quasar, quasarOptions);
app.use(vClickOutside);

app.mount('#app');
