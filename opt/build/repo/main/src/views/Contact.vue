<template>
  <div class="contact">
    <h1>Kontaktujte nás</h1>
    <div class="contact-container">
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <label for="name">Jméno</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required
            placeholder="Vaše jméno"
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
          <label for="message">Zpráva</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            required
            placeholder="Vaše zpráva"
            rows="5"
          ></textarea>
        </div>
        
        <button type="submit" class="submit-btn">Odeslat zprávu</button>
      </form>
      
      <div class="contact-info">
        <h2>Kontaktujte nás</h2>
        <p>V případě jakýchkoliv dotazů se na nás neváhejte obrátit. Jsme tu pro vás a rádi vám pomůžeme!</p>
        
        <div class="info-item">
          <h3>Email</h3>
          <p>info@kamvbrne.cz</p>
        </div>
        
        <div class="info-item">
          <h3>Telefon</h3>
          <p>+420 123 456 789</p>
        </div>
        
        <div class="info-item">
          <h3>Adresa</h3>
          <p>Náměstí Svobody 1<br>602 00 Brno</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = () => {
  // Handle form submission here
  console.log('Form submitted:', form)
  // Reset form
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<style scoped>
.contact {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #dc3545;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #dc3545;
}

.submit-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  width: 100%;
}

.submit-btn:hover {
  background: #c82333;
}

.contact-info {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info h2 {
  color: #dc3545;
  margin-bottom: 1.5rem;
}

.info-item {
  margin: 2rem 0;
}

.info-item h3 {
  color: #dc3545;
  margin-bottom: 0.5rem;
}

.info-item p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style> 