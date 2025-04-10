<template>
  <div class="bank-transfer">
    <h1>Bankovní převod</h1>
    
    <div class="transfer-container">
      <div class="transfer-details">
        <h2>Údaje pro platbu</h2>
        
        <div class="transfer-info">
          <div class="info-item">
            <span class="label">Číslo účtu:</span>
            <span class="value">{{ accountNumber }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">Banka:</span>
            <span class="value">{{ bankName }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">Částka:</span>
            <span class="value amount">{{ amount }} Kč</span>
          </div>
          
          <div class="info-item">
            <span class="label">Variabilní symbol:</span>
            <span class="value">{{ variableSymbol }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">Konstantní symbol:</span>
            <span class="value">{{ constantSymbol }}</span>
          </div>
          
          <div class="info-item">
            <span class="label">ID objednávky:</span>
            <span class="value">{{ orderId }}</span>
          </div>
        </div>
        
        <div class="transfer-instructions">
          <h3>Instrukce pro platbu</h3>
          <ol>
            <li>Přihlaste se do svého internetového bankovnictví</li>
            <li>Vyberte možnost "Nový příkaz" nebo "Platba"</li>
            <li>Zadejte číslo účtu příjemce: <strong>{{ accountNumber }}</strong></li>
            <li>Zadejte částku: <strong>{{ amount }} Kč</strong></li>
            <li>Zadejte variabilní symbol: <strong>{{ variableSymbol }}</strong></li>
            <li>Zadejte konstantní symbol: <strong>{{ constantSymbol }}</strong></li>
            <li>Potvrďte platbu</li>
          </ol>
          <p class="note">Po úspěšném připsání platby na náš účet Vám zašleme potvrzení na email.</p>
        </div>
        
        <div class="transfer-actions">
          <button @click="copyToClipboard" class="copy-btn">Kopírovat údaje</button>
          <button @click="goToHome" class="home-btn">Zpět na hlavní stránku</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

// Údaje pro platbu
const accountNumber = ref('')
const bankName = ref('')
const amount = ref(0)
const variableSymbol = ref('')
const constantSymbol = ref('')
const orderId = ref('')

// Načtení údajů z query parametrů
onMounted(() => {
  accountNumber.value = route.query.accountNumber || '123456789/0800'
  bankName.value = route.query.bankName || 'Česká spořitelna'
  amount.value = route.query.amount || 0
  variableSymbol.value = route.query.variableSymbol || '1234567890'
  constantSymbol.value = route.query.constantSymbol || '0558'
  orderId.value = route.query.orderId || `ORD-${Date.now()}`
  
  // Vyčištění košíku
  store.dispatch('cart/clearCart')
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

// Přesměrování na hlavní stránku
const goToHome = () => {
  router.push('/')
}
</script>

<style scoped>
.bank-transfer {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.transfer-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.transfer-details h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.transfer-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
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

.transfer-instructions {
  margin-bottom: 2rem;
}

.transfer-instructions h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.transfer-instructions ol {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.transfer-instructions li {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.transfer-instructions strong {
  color: #dc3545;
}

.note {
  font-style: italic;
  color: #6c757d;
  margin-top: 1rem;
}

.transfer-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.copy-btn, .home-btn {
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.copy-btn {
  background-color: #28a745;
  color: white;
}

.copy-btn:hover {
  background-color: #218838;
}

.home-btn {
  background-color: #6c757d;
  color: white;
}

.home-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .transfer-actions {
    grid-template-columns: 1fr;
  }
}
</style> 