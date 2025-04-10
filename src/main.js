import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/main.css'

// Import Material Icons
import 'material-icons/iconfont/material-icons.css'

// Import Font Awesome
import '@fortawesome/fontawesome-free/js/all.js'

const app = createApp(App)

app.use(store)
app.use(router)

// Inicializace košíku při startu aplikace
store.dispatch('cart/initializeCart')

app.mount('#app') 