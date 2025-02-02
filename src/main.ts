import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'

const app = createApp(App)

app.use(router)
app.use(store, key)
app.use(HighchartsVue)

app.mount('#app')

exportingInit(Highcharts)