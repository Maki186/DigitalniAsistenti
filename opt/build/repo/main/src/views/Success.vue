<template>
  <div class="success">
    <div class="success-card">
      <h1>Objednávka byla úspěšně dokončena!</h1>
      
      <!-- Zpráva pro bankovní převod -->
      <p v-if="isBankTransfer">
        Děkujeme za vaši objednávku. Potvrzení jsme vám zaslali na váš email. 
        Prosím proveďte platbu na účet: <strong>{{ accountNumber }}</strong>
      </p>
      
      <!-- Zpráva pro platbu kartou -->
      <p v-if="isCardPayment">
        Děkujeme za vaši objednávku. Platba kartou byla úspěšně zpracována. 
        Potvrzení jsme vám zaslali na váš email.
      </p>
      
      <!-- Zpráva pro Apple Pay -->
      <p v-if="isApplePay">
        Děkujeme za vaši objednávku. Platba Apple Pay byla úspěšně zpracována. 
        Potvrzení jsme vám zaslali na váš email.
      </p>
      
      <!-- Informace o platbě kartou -->
      <div v-if="isCardPayment" class="card-payment-info">
        <h2>Informace o platbě</h2>
        <div class="payment-details">
          <div class="payment-item">
            <span class="label">Způsob platby:</span>
            <span class="value">Platba kartou (končící {{ cardLast4 }})</span>
          </div>
          <div class="payment-item">
            <span class="label">Částka:</span>
            <span class="value amount">{{ amount }} Kč</span>
          </div>
          <div class="payment-item">
            <span class="label">ID objednávky:</span>
            <span class="value">{{ orderId }}</span>
          </div>
        </div>
      </div>
      
      <!-- Informace o platbě Apple Pay -->
      <div v-if="isApplePay" class="apple-pay-info">
        <h2>Informace o platbě</h2>
        <div class="payment-details">
          <div class="payment-item">
            <span class="label">Způsob platby:</span>
            <span class="value">Apple Pay</span>
          </div>
          <div class="payment-item">
            <span class="label">Částka:</span>
            <span class="value amount">{{ amount }} Kč</span>
          </div>
          <div class="payment-item">
            <span class="label">ID objednávky:</span>
            <span class="value">{{ orderId }}</span>
          </div>
        </div>
      </div>
      
      <!-- Informace o bankovním převodu -->
      <div v-if="isBankTransfer" class="bank-transfer-info">
        <h2>Údaje pro platbu</h2>
        <div class="transfer-details">
          <div class="transfer-item">
            <span class="label">Číslo účtu:</span>
            <span class="value">{{ accountNumber }}</span>
          </div>
          <div class="transfer-item">
            <span class="label">Banka:</span>
            <span class="value">{{ bankName }}</span>
          </div>
          <div class="transfer-item">
            <span class="label">Částka:</span>
            <span class="value amount">{{ amount }} Kč</span>
          </div>
          <div class="transfer-item">
            <span class="label">Variabilní symbol:</span>
            <span class="value">{{ variableSymbol }}</span>
          </div>
          <div class="transfer-item">
            <span class="label">Konstantní symbol:</span>
            <span class="value">{{ constantSymbol }}</span>
          </div>
          <div class="transfer-item">
            <span class="label">ID objednávky:</span>
            <span class="value">{{ orderId }}</span>
          </div>
        </div>
        <p class="transfer-note">Prosím proveďte platbu na výše uvedený účet. Po úspěšném připsání platby na náš účet Vám zašleme potvrzení na email.</p>
        <button @click="copyToClipboard" class="copy-btn">Kopírovat údaje</button>
      </div>
      
      <div class="success-actions">
        <router-link to="/tickets" class="btn btn-secondary">Zpět na akce</router-link>
        <router-link to="/profile" class="btn btn-primary">Zobrazit moje vstupenky</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const store = useStore()

// Údaje pro bankovní převod
const isBankTransfer = ref(false)
const isCardPayment = ref(false)
const isApplePay = ref(false)
const accountNumber = ref('')
const bankName = ref('')
const amount = ref(0)
const variableSymbol = ref('')
const constantSymbol = ref('')
const orderId = ref('')
const cardLast4 = ref('')
const paymentMethod = ref('')

// Načtení údajů z query parametrů
onMounted(() => {
  console.log('Success page mounted')
  
  // Načtení dat uživatele z localStorage
  const loginState = localStorage.getItem('loginState')
  if (!loginState) {
    console.error('Uživatel není přihlášen')
    return
  }
  
  const userData = JSON.parse(loginState)
  const userEmail = userData.email
  
  // Načtení položek košíku z localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
  console.log('Načtené položky košíku:', cartItems)
  
  if (cartItems.length === 0) {
    console.log('Košík je prázdný')
    return
  }
  
  try {
    // Načtení existujících lístků pro daného uživatele
    const userTicketsKey = `purchasedTickets_${userEmail}`
    const savedTickets = localStorage.getItem(userTicketsKey)
    console.log('Načtené lístky z localStorage:', savedTickets)
    
    let existingTickets = []
    if (savedTickets) {
      try {
        existingTickets = JSON.parse(savedTickets)
        console.log('Parsované lístky z localStorage:', existingTickets)
      } catch (error) {
        console.error('Chyba při parsování lístků:', error)
        existingTickets = []
      }
    }
    
    // Vytvoření nových lístků s kompletními informacemi
    const newTickets = cartItems.map(item => ({
      ...item,
      purchaseDate: new Date().toISOString(),
      orderId: `ORD-${Date.now()}`,
      paymentMethod: 'card',
      price: item.price.replace(' Kč', '') // Odstranění "Kč" z ceny
    }))
    
    console.log('Nové lístky k uložení:', newTickets)
    
    // Přidání nových lístků k existujícím
    const updatedTickets = [...existingTickets, ...newTickets]
    
    // Uložení aktualizovaného seznamu lístků pro daného uživatele
    localStorage.setItem(userTicketsKey, JSON.stringify(updatedTickets))
    console.log('Uložené lístky do localStorage:', updatedTickets)
    
    // Vyčištění košíku
    store.dispatch('clearCart')
    localStorage.removeItem('cartItems')
    console.log('Košík byl vyčištěn')
    
  } catch (error) {
    console.error('Chyba při ukládání lístků:', error)
  }
})

// Kopírování údajů do schránky
const copyToClipboard = () => {
  const text = `
Údaje pro platbu:
Číslo účtu: ${accountNumber.value}
Banka: ${bankName.value}
Částka: ${amount.value} Kč
Variabilní symbol: ${variableSymbol.value}
Konstantní symbol: ${constantSymbol.value}
ID objednávky: ${orderId.value}
  `
  
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Údaje byly zkopírovány do schránky')
    })
    .catch(err => {
      console.error('Nepodařilo se zkopírovat údaje: ', err)
    })
}
</script>

<style scoped>
.success {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.success-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 2rem;
}

h2 {
  color: #2c3e50;
  margin: 1.5rem 0 1rem;
  font-size: 1.5rem;
  text-align: left;
}

p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.bank-transfer-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
}

.transfer-details {
  margin-bottom: 1.5rem;
}

.transfer-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.transfer-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #6c757d;
}

.value {
  font-weight: bold;
  color: #2c3e50;
}

.amount {
  color: #dc3545;
  font-size: 1.2rem;
}

.transfer-note {
  font-style: italic;
  color: #6c757d;
  margin: 1rem 0;
  text-align: left;
}

.copy-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 1.5rem;
}

.copy-btn:hover {
  background-color: #218838;
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #dc3545;
  color: white;
}

.btn-primary:hover {
  background-color: #c82333;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .success-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}
</style> 