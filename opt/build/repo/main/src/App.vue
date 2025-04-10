<template>
  <div class="app">
    <nav class="navbar">
      <router-link to="/" class="nav-brand">
        <Logo />
      </router-link>
      <div class="hamburger" @click="toggleMobileMenu">
        <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
      </div>
      <div class="nav-links" :class="{ 'mobile-menu-open': isMobileMenuOpen }">
        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }" @click="closeMobileMenu">Domů</router-link>
        <router-link to="/tickets" class="nav-link" :class="{ active: $route.path === '/tickets' }" @click="closeMobileMenu">Vstupenky</router-link>
        <router-link to="/about" class="nav-link" :class="{ active: $route.path === '/about' }" @click="closeMobileMenu">O nás</router-link>
        <router-link to="/contact" class="nav-link" :class="{ active: $route.path === '/contact' }" @click="closeMobileMenu">Kontakt</router-link>
        <div class="cart-icon" @click="openCart">
          <span class="material-icons">shopping_cart</span>
          <span class="cart-count" v-if="cartItemCount">{{ cartItemCount }}</span>
        </div>
        <div class="profile-icon" v-if="isLoggedIn" @click="showProfileMenu = !showProfileMenu; closeMobileMenu()">
          <span class="material-icons">person</span>
          <div class="profile-menu" v-if="showProfileMenu">
            <div class="profile-menu-item" @click="goToProfile">
              <span class="material-icons">person</span>
              <span>{{ userName }}</span>
            </div>
            <div class="profile-menu-item" @click="logout">
              <span class="material-icons">logout</span>
              <span>Odhlásit se</span>
            </div>
          </div>
        </div>
        <router-link v-else to="/auth" class="nav-link" :class="{ active: $route.path === '/auth' }" @click="closeMobileMenu">Přihlásit se</router-link>
      </div>
    </nav>

    <!-- Shopping Cart Sidebar -->
    <div class="cart-sidebar" :class="{ 'cart-open': showCart }">
      <div class="cart-header">
        <h2>Košík</h2>
        <button class="close-cart" @click="showCart = false">&times;</button>
      </div>
      <div class="cart-items" v-if="cartItems.length">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" class="cart-item-image">
          <div class="cart-item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-price">{{ item.price }}</p>
            <p class="item-quantity">Počet lístků: {{ item.quantity }}</p>
          </div>
          <button class="remove-item" @click="removeFromCart(item.id)">&times;</button>
        </div>
      </div>
      <div v-else class="empty-cart">
        <p>Váš košík je prázdný</p>
      </div>
      <div class="cart-footer" v-if="cartItems.length">
        <div class="cart-total">
          <span>Celkem:</span>
          <span>{{ cartTotal }} Kč</span>
        </div>
        <button class="checkout-btn" @click="goToCheckout">Do košíku</button>
      </div>
    </div>

    <main class="main-content">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <p>&copy; 2024 Kam v Brně. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Logo from './components/Logo.vue'

const router = useRouter()
const store = useStore()
const showCart = ref(false)
const showProfileMenu = ref(false)
const isMobileMenuOpen = ref(false)

// Computed properties pro stav přihlášení
const isLoggedIn = computed(() => store.state.auth.isLoggedIn)
const userName = computed(() => store.state.auth.userName)

// Computed properties pro košík
const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])
const cartItemCount = computed(() => store.getters['cart/cartItemCount'])

// Inicializace při načtení
onMounted(() => {
  store.dispatch('auth/initializeAuth')
  store.dispatch('cart/initializeCart')
  console.log('User logged in:', isLoggedIn.value)
})

const removeFromCart = (itemId) => {
  store.dispatch('cart/removeFromCart', itemId)
}

const goToCheckout = () => {
  showCart.value = false
  router.push('/checkout')
}

const logout = () => {
  store.dispatch('auth/logout')
  showProfileMenu.value = false
  router.push('/')
}

const goToProfile = () => {
  showProfileMenu.value = false
  router.push('/profile')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Funkce pro zavření košíku
const closeCart = () => {
  if (showCart.value) {
    showCart.value = false
  }
}

// Upravená funkce pro otevření košíku
const openCart = () => {
  showCart.value = true
  closeMobileMenu()
}

// Přidání event listeneru pro kliknutí mimo košík
onMounted(() => {
  document.addEventListener('click', (event) => {
    const cart = document.querySelector('.cart-sidebar')
    const cartIcon = document.querySelector('.cart-icon')
    if (showCart.value && cart && !cart.contains(event.target) && !cartIcon.contains(event.target)) {
      closeCart()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('click', closeCart)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

@keyframes slideshow {
  0% {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brno_%28CZ%29%2C_Spilberk_Castle_%28view_from_Petrov%29.jpg/1280px-Brno_%28CZ%29%2C_Spilberk_Castle_%28view_from_Petrov%29.jpg');
  }
  25% {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Brno_%28CZ%29%2C_Cathedral_of_Saints_Peter_and_Paul.jpg/1280px-Brno_%28CZ%29%2C_Cathedral_of_Saints_Peter_and_Paul.jpg');
  }
  50% {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Brno_%28CZ%29%2C_Freedom_Square.jpg/1280px-Brno_%28CZ%29%2C_Freedom_Square.jpg');
  }
  75% {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Brno_%28CZ%29%2C_Old_Town_Hall.jpg/1280px-Brno_%28CZ%29%2C_Old_Town_Hall.jpg');
  }
  100% {
    background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Brno_%28CZ%29%2C_Spilberk_Castle_%28view_from_Petrov%29.jpg/1280px-Brno_%28CZ%29%2C_Spilberk_Castle_%28view_from_Petrov%29.jpg');
  }
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Montserrat', sans-serif;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  min-height: 100vh;
  animation: slideshow 20s infinite;
  animation-timing-function: ease-in-out;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.7) 100%), 
              url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg') center/cover fixed;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Remove the black overlay */
.app::before {
  display: none;
}

.navbar {
  background-color: rgba(220, 53, 69, 0.95);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.nav-brand {
  text-decoration: none;
}

.hamburger {
  display: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger .material-icons {
  font-size: 2rem;
  color: white;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.cart-icon {
  position: relative;
  cursor: pointer;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #28a745;
  color: #ffffff;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1001;
}

.cart-open {
  right: 0;
}

.cart-header {
  padding: 1rem;
  background-color: #dc3545;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-cart {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

.cart-items {
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.cart-item-details {
  flex: 1;
}

.cart-item-details h3 {
  margin: 0;
  font-size: 1rem;
}

.cart-item-details p {
  margin: 0.5rem 0;
}

.item-price {
  color: #dc3545;
  font-weight: bold;
}

.item-quantity {
  color: #666;
  font-size: 0.9rem;
}

.remove-item {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 1.2rem;
}

.cart-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #dc3545;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #c82333;
}

.empty-cart {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
  margin-top: 80px;
}

.footer {
  background-color: rgba(220, 53, 69, 0.95);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
}

body {
  line-height: 1.6;
  color: #333;
}

/* Add styles for cards to ensure they're visible against the background */
.ticket-card, .destination-card, .category-card, .checkout-form, .order-summary {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.profile-icon {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.profile-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.profile-icon .material-icons {
  font-size: 24px;
  color: white;
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  color: #2c3e50;
  transition: background-color 0.3s ease;
}

.profile-menu-item:hover {
  background-color: #f8f9fa;
}

.profile-menu-item .material-icons {
  color: #dc3545;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: rgba(220, 53, 69, 0.95);
    flex-direction: column;
    padding: 2rem;
    transition: left 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .nav-links.mobile-menu-open {
    left: 0;
  }

  .nav-link {
    width: 100%;
    text-align: center;
    padding: 1rem;
    font-size: 1.2rem;
  }

  .cart-icon, .profile-icon {
    margin: 1rem 0;
  }

  .profile-menu {
    position: static;
    width: 100%;
    margin-top: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .profile-menu-item {
    color: white;
  }

  .profile-menu-item .material-icons {
    color: white;
  }
}
</style> 