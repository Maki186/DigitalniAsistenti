import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Tickets from '../views/Tickets.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Auth from '../views/Auth.vue'
import Checkout from '../views/Checkout.vue'
import Profile from '../views/Profile.vue'
import Success from '../views/Success.vue'
import BankTransferPage from '../views/BankTransferPage.vue'
import CardPayment from '../views/CardPayment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Tickets
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/contact',
      name: 'contact',
      component: Contact
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/success',
      name: 'Success',
      component: Success
    },
    {
      path: '/bank-transfer',
      name: 'bank-transfer',
      component: BankTransferPage
    },
    {
      path: '/card-payment',
      name: 'card-payment',
      component: CardPayment
    }
  ]
})

export default router 