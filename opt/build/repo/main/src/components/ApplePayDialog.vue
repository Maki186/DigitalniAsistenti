<template>
  <div v-if="show" class="apple-pay-dialog-overlay">
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
        <button class="cancel-btn" @click="$emit('cancel')">Zrušit</button>
        <button class="pay-btn" @click="startPayment" :disabled="isScanning">
          {{ isScanning ? 'Zpracovávám...' : 'Zaplatit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['cancel', 'success'])

const isScanning = ref(false)

const startPayment = async () => {
  isScanning.value = true
  
  // Simulace Face ID skenování
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  isScanning.value = false
  emit('success')
}
</script>

<style scoped>
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

.payment-amount {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.currency {
  font-size: 1.2rem;
  margin-right: 0.3rem;
}

.card-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #666;
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