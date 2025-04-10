<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Přihlášení' : 'Registrace' }}</h2>
      
      <div class="auth-tabs">
        <button 
          :class="['tab-btn', { active: isLogin }]" 
          @click="isLogin = true"
        >
          Přihlášení
        </button>
        <button 
          :class="['tab-btn', { active: !isLogin }]" 
          @click="isLogin = false; generateSecurityQuestion()"
        >
          Registrace
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group" v-if="isLogin">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Zadejte email"
          >
        </div>
        
        <div class="form-group" v-if="isLogin">
          <label for="password">Heslo</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Zadejte heslo"
          >
        </div>

        <div class="form-group" v-else>
          <label for="name">Jméno</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required
            placeholder="Zadejte jméno"
          >
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            placeholder="Zadejte email"
          >
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="password">Heslo</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            placeholder="Zadejte heslo"
          >
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="confirmPassword">Potvrzení hesla</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            placeholder="Potvrďte heslo"
          >
        </div>

        <div class="form-group" v-if="!isLogin">
          <label for="securityQuestion">Kontrolní otázka proti robotům</label>
          <div class="security-question">
            <p>{{ securityQuestionText }}</p>
            <input 
              type="number" 
              id="securityQuestion" 
              v-model="securityQuestion" 
              required
              placeholder="Zadejte odpověď"
            >
          </div>
        </div>

        <div class="error-message" v-if="errorMessage">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLogin ? 'Přihlásit se' : 'Registrovat' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const name = ref('')
const confirmPassword = ref('')
const securityQuestion = ref('')
const securityQuestionText = ref('')
const correctAnswer = ref(0)
const errorMessage = ref('')
const isLoading = ref(false)

const generateSecurityQuestion = () => {
  const num1 = Math.floor(Math.random() * 10) + 1
  const num2 = Math.floor(Math.random() * 10) + 1
  correctAnswer.value = num1 + num2
  securityQuestionText.value = `Kolik je ${num1} + ${num2}?`
}

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!isLogin.value) {
    // Registrace
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Hesla se neshodují'
      return
    }
    
    if (parseInt(securityQuestion.value) !== correctAnswer.value) {
      errorMessage.value = 'Nesprávná odpověď na kontrolní otázku'
      return
    }
    
    // Volání akce pro registraci
    const success = await store.dispatch('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    
    if (success) {
      // Po úspěšné registraci automaticky přihlásíme uživatele
      await store.dispatch('auth/login', {
        email: email.value,
        password: password.value
      })
      router.push('/')
    } else {
      errorMessage.value = 'Registrace se nezdařila'
    }
  } else {
    // Přihlášení
    // Volání akce pro přihlášení
    const success = await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    })
    
    if (success) {
      router.push('/')
    } else {
      errorMessage.value = 'Nesprávný email nebo heslo'
    }
  }
}

onMounted(() => {
  generateSecurityQuestion()
})
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.auth-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s ease;
}

.tab-btn.active {
  color: #dc3545;
  border-bottom: 2px solid #dc3545;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.security-question {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.security-question p {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.submit-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #c82333;
}

.submit-btn:disabled {
  background-color: #dc354580;
  cursor: not-allowed;
}
</style> 