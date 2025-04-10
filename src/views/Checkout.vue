<template>
  <div class="checkout">
    <h1>Objednávka</h1>
    
    <div class="checkout-container">
      <!-- Krok 1: Souhrn objednávky -->
      <div v-if="currentStep === 1" class="order-summary">
        <h2>Souhrn objednávky</h2>
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <img :src="item.image" :alt="item.name" class="item-image">
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <div class="item-info">
                <p class="item-date"><i class="fas fa-calendar"></i> {{ item.date }}</p>
                <p class="item-location"><i class="fas fa-map-marker-alt"></i> {{ item.location }}</p>
              </div>
              <div class="item-controls">
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
                  <span class="item-quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
                </div>
                <p class="item-price">{{ item.price === 'Zdarma' ? 'Zdarma' : `${parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity} Kč` }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="order-total">
          <span>Celkem k úhradě:</span>
          <span class="total-price">{{ cartTotal }} Kč</span>
        </div>
        <button @click="nextStep" class="next-btn">Další</button>
      </div>

      <!-- Krok 2: Osobní údaje a platba -->
      <div v-if="currentStep === 2" class="checkout-form">
        <h2>Osobní údaje a platba</h2>
        
        <div class="form-group">
          <label for="name">Celé jméno</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required
            placeholder="Vaše celé jméno"
          >
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            placeholder="Váš email"
          >
        </div>
        
        <div class="form-group">
          <label for="address">Adresa</label>
          <textarea 
            id="address" 
            v-model="form.address" 
            required
            placeholder="Vaše adresa včetně PSČ"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Způsob platby</label>
          <div class="payment-methods">
            <div class="payment-method" :class="{ active: form.paymentMethod === 'bank-transfer' }" @click="form.paymentMethod = 'bank-transfer'">
              <i class="fas fa-university"></i>
              <span>Bankovní převod</span>
            </div>
            <div class="payment-method" :class="{ active: form.paymentMethod === 'card' }" @click="form.paymentMethod = 'card'">
              <i class="fas fa-credit-card"></i>
              <span>Platba Kartou</span>
            </div>
            <div class="payment-method" :class="{ active: form.paymentMethod === 'applepay' }" @click="form.paymentMethod = 'applepay'">
              <i class="fab fa-apple"></i>
              <span>Apple Pay</span>
            </div>
            <div class="payment-method" :class="{ active: form.paymentMethod === 'googlepay' }" @click="form.paymentMethod = 'googlepay'">
              <i class="fab fa-google"></i>
              <span>Google Pay</span>
            </div>
          </div>
        </div>
        
        <div class="form-buttons">
          <button @click="previousStep" class="back-btn">Zpět</button>
          <button @click="handleSubmit" class="submit-btn">Dokončit objednávku</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

// Stav kroku objednávky
const currentStep = ref(1)

// Metody pro navigaci mezi kroky
const nextStep = () => {
  currentStep.value = 2
}

const previousStep = () => {
  currentStep.value = 1
}

// Získáme položky košíku z Vuex store
const cartItems = computed(() => store.getters['cart/cartItems'])
const cartTotal = computed(() => store.getters['cart/cartTotal'])

// Metody pro úpravu množství
const increaseQuantity = (item) => {
  store.dispatch('cart/updateQuantity', {
    id: item.id,
    quantity: item.quantity + 1
  })
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    store.dispatch('cart/updateQuantity', {
      id: item.id,
      quantity: item.quantity - 1
    })
  } else {
    store.dispatch('cart/removeFromCart', item.id)
  }
}

// Formulář pro osobní údaje a platbu
const form = ref({
  name: '',
  email: '',
  address: '',
  paymentMethod: 'bank-transfer'
})

// Zpracování formuláře
const handleSubmit = async () => {
  try {
    // Validace formuláře
    if (!form.value.name || !form.value.email || !form.value.address) {
      alert('Prosím vyplňte všechny povinné údaje')
      return
    }

    // Generování variabilního symbolu
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const variableSymbol = `${day}${month}${year}${random}`

    console.log('Zpracování objednávky:', {
      paymentMethod: form.value.paymentMethod,
      amount: cartTotal.value,
      variableSymbol
    })

    // Přesměrování podle typu platby
    switch (form.value.paymentMethod) {
      case 'bank-transfer':
        router.push({
          path: '/success',
          query: {
            paymentMethod: 'bank-transfer',
            amount: cartTotal.value,
            orderId: `ORD-${Date.now()}`,
            accountNumber: '123456789/0800',
            bankName: 'Česká spořitelna',
            variableSymbol
          }
        })
        break
      case 'card':
        router.push({
          path: '/card-payment',
          query: {
            paymentMethod: 'card',
            amount: cartTotal.value,
            variableSymbol
          }
        })
        break
      case 'applepay':
      case 'googlepay':
        router.push({
          path: '/card-payment',
          query: {
            paymentMethod: form.value.paymentMethod,
            amount: cartTotal.value,
            variableSymbol
          }
        })
        break
      default:
        router.push({
          path: '/success',
          query: {
            paymentMethod: form.value.paymentMethod || 'unknown',
            amount: cartTotal.value,
            orderId: `ORD-${Date.now()}`
          }
        })
    }
  } catch (error) {
    console.error('Chyba při zpracování objednávky:', error)
  }
}
</script>

<style scoped>
.checkout {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.checkout-container {
  display: flex;
  justify-content: center;
}

.order-summary, .checkout-form {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  max-width: 800px;
}

.order-summary h2, .checkout-form h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.cart-items {
  margin-bottom: 1.5rem;
}

.cart-item {
  display: flex;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.item-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1.5rem;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-details h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.item-info {
  margin-bottom: 1rem;
}

.item-date, .item-location {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.quantity-btn:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.item-quantity {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  color: #28a745;
  font-size: 1.1rem;
}

.item-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #dc3545;
  margin: 0;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  padding: 1.5rem;
  margin-top: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.total-price {
  color: #dc3545;
  font-size: 1.5rem;
}

.next-btn, .back-btn, .submit-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1.5rem;
}

.next-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.next-btn:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
}

.back-btn {
  background-color: #6c757d;
  color: white;
}

.back-btn:hover {
  background-color: #5a6268;
}

.submit-btn {
  background-color: #dc3545;
  color: white;
}

.submit-btn:hover {
  background-color: #c82333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

.payment-method {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.payment-method i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.payment-method span {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
  text-align: center;
}

.payment-method:hover {
  border-color: #dc3545;
  background-color: #fff;
}

.payment-method.active {
  border-color: #dc3545;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.payment-method.active i {
  color: #dc3545;
}

@media (max-width: 768px) {
  .payment-methods {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-row, .form-buttons {
    grid-template-columns: 1fr;
  }
}
</style> 