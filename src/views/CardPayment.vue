<template>
  <div class="card-payment">
    <div class="payment-card">
      <h1>Zadání platebních údajů</h1>
      <p class="payment-info" v-if="!isApplePay && !isGooglePay">Pro dokončení objednávky prosím zadejte údaje vaší platební karty.</p>
      <p class="payment-info" v-else-if="isApplePay">Pro dokončení objednávky prosím použijte Apple Pay.</p>
      <p class="payment-info" v-else>Pro dokončení objednávky prosím použijte Google Pay.</p>
      
      <!-- Zobrazení karty pouze pro platbu kartou -->
      <div v-if="!isApplePay && !isGooglePay" class="card-preview">
        <div class="card-front">
          <div class="card-logo">
            <i class="fas fa-credit-card"></i>
          </div>
          <div class="card-number">{{ cardNumber || '•••• •••• •••• ••••' }}</div>
          <div class="card-details">
            <div class="card-holder">{{ cardHolder || 'JMÉNO DRŽITELE' }}</div>
            <div class="card-expiry">{{ cardExpiry || 'MM/RR' }}</div>
          </div>
        </div>
      </div>
      
      <!-- Apple Pay tlačítko -->
      <div v-if="isApplePay" class="apple-pay-button">
        <button @click="handleApplePayClick" class="apple-pay-btn">
          <i class="fab fa-apple"></i>
          <span>Zaplatit s Apple Pay</span>
        </button>
      </div>
      
      <!-- Google Pay tlačítko -->
      <div v-if="isGooglePay" class="google-pay-button">
        <button @click="processPayment" class="google-pay-btn">
          <i class="fab fa-google"></i>
          <span>Zaplatit s Google Pay</span>
        </button>
      </div>
      
      <!-- Formulář pro kartu -->
      <form v-if="!isApplePay && !isGooglePay" @submit.prevent="processPayment" class="payment-form">
        <div class="form-group">
          <label for="cardNumber">Číslo karty</label>
          <input 
            type="text" 
            id="cardNumber" 
            v-model="cardNumber" 
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            @input="formatCardNumber"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="cardHolder">Jméno držitele karty</label>
          <input 
            type="text" 
            id="cardHolder" 
            v-model="cardHolder" 
            placeholder="JAN NOVÁK"
            required
          />
        </div>
        
        <div class="form-row">
          <div class="form-group half">
            <label for="cardExpiry">Platnost</label>
            <input 
              type="text" 
              id="cardExpiry" 
              v-model="cardExpiry" 
              placeholder="MM/RR"
              maxlength="5"
              @input="formatExpiry"
              required
            />
          </div>
          
          <div class="form-group half">
            <label for="cardCvv">CVV</label>
            <input 
              type="text" 
              id="cardCvv" 
              v-model="cardCvv" 
              placeholder="123"
              maxlength="3"
              required
            />
          </div>
        </div>
        
        <div class="payment-summary">
          <div class="summary-item">
            <span>Částka k zaplacení:</span>
            <span class="amount">{{ amount }} Kč</span>
          </div>
          <div class="summary-item">
            <span>Variabilní symbol:</span>
            <span>{{ variableSymbol }}</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-secondary">Zpět</button>
          <button type="submit" class="btn btn-primary" :disabled="isProcessing">
            {{ isProcessing ? 'Zpracovávám platbu...' : 'Zaplatit' }}
          </button>
        </div>
        
        <div class="security-info">
          <i class="fas fa-lock"></i>
          <span>Vaše údaje jsou zabezpečeny SSL šifrováním</span>
        </div>
      </form>
      
      <!-- Souhrn platby pro Apple Pay a Google Pay -->
      <div v-if="isApplePay || isGooglePay" class="payment-summary">
        <div class="summary-item">
          <span>Částka k zaplacení:</span>
          <span class="amount">{{ amount }} Kč</span>
        </div>
        <div class="summary-item">
          <span>Variabilní symbol:</span>
          <span>{{ variableSymbol }}</span>
        </div>
      </div>
      
      <!-- Tlačítka pro Apple Pay a Google Pay -->
      <div v-if="isApplePay || isGooglePay" class="form-actions">
        <button type="button" @click="goBack" class="btn btn-secondary">Zpět</button>
      </div>
      
      <!-- Informace o zabezpečení pro Apple Pay -->
      <div v-if="isApplePay" class="security-info">
        <i class="fas fa-lock"></i>
        <span>Vaše údaje jsou zabezpečeny Apple Pay</span>
      </div>
      
      <!-- Informace o zabezpečení pro Google Pay -->
      <div v-if="isGooglePay" class="security-info">
        <i class="fas fa-lock"></i>
        <span>Vaše údaje jsou zabezpečeny Google Pay</span>
      </div>
    </div>
    
    <!-- Apple Pay Dialog -->
    <div v-if="showApplePayDialog" class="apple-pay-dialog-overlay">
      <div class="apple-pay-dialog">
        <div class="dialog-header">
          <i class="fab fa-apple"></i>
          <h2>Apple Pay</h2>
        </div>
        
        <div class="dialog-content">
          <div class="merchant-info">
            <img src="/favicon.svg" alt="Logo" class="merchant-logo">
            <span class="merchant-name">Kam v Brně</span>
          </div>
          
          <div class="payment-amount">
            <span class="currency">Kč</span>
            <span class="amount">{{ amount }}</span>
          </div>
          
          <div class="card-info">
            <i class="fas fa-credit-card"></i>
            <span>•••• 4242</span>
          </div>
          
          <div class="face-id-animation" :class="{ 'scanning': isScanning }">
            <div class="face-id-icon">
              <i class="fas fa-face-smile"></i>
            </div>
            <div class="scan-line"></div>
          </div>
          
          <div class="payment-status">
            {{ isScanning ? 'Ověřování...' : 'Připraveno k platbě' }}
          </div>
        </div>
        
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showApplePayDialog = false">Zrušit</button>
          <button class="pay-btn" @click="startApplePay" :disabled="isScanning">
            {{ isScanning ? 'Zpracovávám...' : 'Zaplatit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()

// Kontrola, zda je vybráno Apple Pay nebo Google Pay
const isApplePay = computed(() => route.query.paymentMethod === 'applepay')
const isGooglePay = computed(() => route.query.paymentMethod === 'googlepay')

// Platební údaje
const cardNumber = ref('')
const cardHolder = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const isProcessing = ref(false)
const showApplePayDialog = ref(false)
const isScanning = ref(false)

// Údaje z query parametrů
const amount = ref(0)
const variableSymbol = ref('')

// Načtení údajů z query parametrů
onMounted(() => {
  if (route.query.amount) {
    amount.value = route.query.amount
  }
  
  if (route.query.variableSymbol) {
    variableSymbol.value = route.query.variableSymbol
  }
})

// Formátování čísla karty
const formatCardNumber = () => {
  let value = cardNumber.value.replace(/\D/g, '')
  let formattedValue = ''
  
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' '
    }
    formattedValue += value[i]
  }
  
  cardNumber.value = formattedValue
}

// Formátování data platnosti
const formatExpiry = () => {
  let value = cardExpiry.value.replace(/\D/g, '')
  
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2)
  }
  
  cardExpiry.value = value
}

// Zpracování Apple Pay platby
const startApplePay = async () => {
  isScanning.value = true
  
  // Simulace Face ID skenování
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isScanning.value = false
  showApplePayDialog.value = false
  await processPayment()
}

// Zpracování platby
const processPayment = async () => {
  try {
    console.log('Začátek zpracování platby')
    isProcessing.value = true
    
    // Validace vstupů pro platbu kartou
    if (!isApplePay.value && !isGooglePay.value) {
      if (!cardNumber.value || !cardHolder.value || !cardExpiry.value || !cardCvv.value) {
        console.error('Chybí povinné údaje')
        isProcessing.value = false
        return
      }
    }
    
    // Načtení položek přímo z Vuex store
    const cartItems = store.state.cart.items
    console.log('Položky košíku z Vuex store:', cartItems)
    
    if (!cartItems || cartItems.length === 0) {
      console.error('Košík je prázdný')
      isProcessing.value = false
      return
    }
    
    // Uložení položek do localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    console.log('Ukládání položek košíku do localStorage:', cartItems)
    
    // Kontrola, zda se položky skutečně uložily
    const savedItems = localStorage.getItem('cartItems')
    console.log('Kontrola uložených položek:', savedItems)
    
    // Simulace zpracování platby
    console.log('Simulace zpracování platby...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generování náhodného čísla karty pro zobrazení
    const last4 = cardNumber.value ? cardNumber.value.slice(-4) : '1234'
    console.log('Poslední 4 čísla karty:', last4)
    
    // Přesměrování na success stránku
    console.log('Přesměrování na success stránku...')
    await router.push({
      path: '/success',
      query: {
        paymentMethod: isApplePay.value ? 'applepay' : (isGooglePay.value ? 'googlepay' : 'card'),
        amount: amount.value,
        orderId: `ORD-${Date.now()}`,
        cardLast4: last4
      }
    })
    
    isProcessing.value = false
  } catch (error) {
    console.error('Chyba při zpracování platby:', error)
    isProcessing.value = false
    alert('Došlo k chybě při zpracování platby. Zkuste to prosím znovu.')
  }
}

// Návrat zpět
const goBack = () => {
  console.log('Návrat zpět')
  router.back()
}

// Zpracování kliknutí na Apple Pay tlačítko
const handleApplePayClick = () => {
  console.log('Kliknuto na Apple Pay tlačítko')
  console.log('showApplePayDialog před:', showApplePayDialog.value)
  showApplePayDialog.value = true
  console.log('showApplePayDialog po:', showApplePayDialog.value)
}
</script>

<style scoped>
.card-payment {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.payment-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  text-align: center;
}

.payment-info {
  color: #6c757d;
  margin-bottom: 2rem;
  text-align: center;
}

.card-preview {
  margin-bottom: 2rem;
  perspective: 1000px;
}

.card-front {
  background: linear-gradient(135deg, #1a237e, #0d47a1);
  color: white;
  border-radius: 10px;
  padding: 1.5rem;
  height: 180px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-logo {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
}

.card-number {
  position: absolute;
  bottom: 5rem;
  left: 1.5rem;
  font-size: 1.2rem;
  letter-spacing: 2px;
  font-family: monospace;
}

.card-details {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.payment-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.payment-summary {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  margin: 1.5rem 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.amount {
  font-weight: bold;
  color: #dc3545;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #dc3545;
  color: white;
  flex: 1;
}

.btn-primary:hover {
  background-color: #c82333;
}

.btn-primary:disabled {
  background-color: #e9a2a3;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

.security-info {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 0.9rem;
  gap: 0.5rem;
}

.security-info i {
  color: #28a745;
}

/* Apple Pay specifické styly */
.apple-pay-button {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
}

.apple-pay-btn {
  background-color: #000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apple-pay-btn:hover {
  background-color: #333;
}

.apple-pay-btn i {
  font-size: 1.5rem;
}

/* Google Pay specifické styly */
.google-pay-button {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
}

.google-pay-btn {
  background-color: #000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.google-pay-btn:hover {
  background-color: #333;
}

.google-pay-btn i {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

/* Apple Pay Dialog styles */
.apple-pay-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.apple-pay-dialog {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  background-color: #000;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dialog-header i {
  font-size: 1.5rem;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.dialog-content {
  padding: 2rem;
  text-align: center;
}

.merchant-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.merchant-logo {
  width: 24px;
  height: 24px;
}

.merchant-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.face-id-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border: 2px solid #000;
  border-radius: 50%;
  overflow: hidden;
}

.face-id-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #000;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #000;
  opacity: 0;
}

.scanning .scan-line {
  animation: scan 2s linear infinite;
  opacity: 1;
}

@keyframes scan {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

.payment-status {
  color: #666;
  margin-bottom: 1.5rem;
}

.dialog-footer {
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  border-top: 1px solid #eee;
}

.cancel-btn, .pay-btn {
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.pay-btn {
  background-color: #000;
  color: white;
}

.pay-btn:hover {
  background-color: #333;
}

.pay-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}
</style> 