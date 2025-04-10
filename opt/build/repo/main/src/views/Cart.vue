<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// Použijeme getter pro získání položek z košíku
const cart = computed(() => store.getters['cart/cartItems'])

const totalPrice = computed(() => {
  return cart.value.reduce((total, item) => {
    // Pokud je cena "Zdarma", přičteme 0
    if (item.price === 'Zdarma') {
      return total
    }
    
    // Extrahujeme číslo z ceny (např. "290 Kč" -> 290)
    const price = parseInt(item.price.replace(/[^\d]/g, ''))
    return total + (price * item.quantity)
  }, 0)
})

const increaseQuantity = (item) => {
  if (item.quantity < 10) {
    store.commit('cart/updateQuantity', { id: item.id, quantity: item.quantity + 1 })
  }
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    store.commit('cart/updateQuantity', { id: item.id, quantity: item.quantity - 1 })
  }
}

const removeFromCart = (item) => {
  store.commit('cart/removeFromCart', item.id)
}

const checkout = () => {
  // Zde můžete přidat logiku pro pokračování k platbě
  alert('Funkce platby bude implementována později.')
}
</script>

<template>
  <div class="cart">
    <h1>Košík</h1>
    
    <div v-if="cart.length === 0" class="empty-cart">
      <p>Váš košík je prázdný</p>
      <router-link to="/tickets" class="continue-shopping">Pokračovat v nákupu</router-link>
    </div>
    
    <div v-else class="cart-items">
      <div v-for="item in cart" :key="item.id" class="cart-item">
        <img :src="item.image" :alt="item.name" class="item-image">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p class="item-date">{{ item.date }}</p>
          <p class="item-location">{{ item.location }}</p>
          <p class="item-quantity-info">Počet kusů: {{ item.quantity }}</p>
        </div>
        <div class="item-price">
          <p>{{ item.price }}</p>
        </div>
        <div class="item-quantity">
          <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">-</button>
          <span>{{ item.quantity }}</span>
          <button @click="increaseQuantity(item)" :disabled="item.quantity >= 10">+</button>
        </div>
        <div class="item-total">
          <p>{{ item.price === 'Zdarma' ? 'Zdarma' : `${parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity} Kč` }}</p>
        </div>
        <button class="remove-item" @click="removeFromCart(item)">×</button>
      </div>
      
      <div class="cart-summary">
        <div class="summary-row">
          <span>Celková cena:</span>
          <span class="total-price">{{ totalPrice }} Kč</span>
        </div>
        <button class="checkout-btn" @click="checkout">Pokračovat k platbě</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
}

.continue-shopping {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-details h3 {
  margin: 0;
  color: #2c3e50;
}

.item-date, .item-location {
  margin: 0;
  color: #666;
}

.item-quantity-info {
  margin: 0;
  color: #42b983;
  font-weight: bold;
}

.item-price {
  font-weight: bold;
  color: #2c3e50;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.item-quantity button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.item-quantity span {
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: bold;
  color: #42b983;
}

.remove-item {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #ff4444;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  margin-top: 2rem;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.total-price {
  color: #42b983;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
}

.checkout-btn:hover {
  background-color: #3aa876;
}
</style> 