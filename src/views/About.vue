<template>
  <div class="about">
    <h1>O nás</h1>
    <div class="content">
      <div class="about-header">
        <Logo :dark="true" />
        <p>Vítejte na stránkách Kam v Brně, vašeho průvodce po nejlepších akcích a zážitcích v Brně.</p>
      </div>
      
      <h2>Naše mise</h2>
      <p>Naším cílem je poskytnout vám přehledný a užitečný nástroj pro objevování zajímavých akcí v Brně. Chceme, abyste nemuseli složitě hledat informace na různých místech - vše najdete na jednom místě.</p>
      
      <h2>Kontaktujte nás</h2>
      <div class="contact-info">
        <p>V případě jakýchkoliv dotazů se na nás neváhejte obrátit. Jsme tu pro vás a rádi vám pomůžeme!</p>
        <p><strong>Jméno:</strong> Kam v Brně</p>
        <p><strong>Telefon:</strong> +420 123 456 789</p>
        <p><strong>Email:</strong> info@kamvbrne.cz</p>
        <p><strong>Adresa:</strong> Náměstí Svobody 1, 602 00 Brno</p>
        
        <div class="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.475475475475!2d16.6083!3d49.1953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712944b1c3d9b6f%3A0x8f0c3c3c3c3c3c3c!2sN%C3%A1m%C4%9Bst%C3%AD%20Svobody%201%2C%20602%2000%20Brno!5e0!3m2!1scs!2scz!4v1620000000000!5m2!1scs!2scz" 
            width="100%" 
            height="300" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      
      <h2>Naše technologie</h2>
      <ul>
        <li>Vue.js 3 s Composition API</li>
        <li>Vite pro rychlý vývoj</li>
        <li>Vue Router pro navigaci</li>
        <li>Vuex pro správu stavu</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import Logo from '../components/Logo.vue'
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #dc3545;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
}

h2 {
  color: #dc3545;
  margin: 2rem 0 1rem;
  font-size: 1.8rem;
}

.content {
  line-height: 1.8;
}

.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.about-header p {
  margin-top: 1rem;
  text-align: center;
  max-width: 600px;
}

p {
  margin-bottom: 1.5rem;
  color: #444;
}

.contact-info {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.contact-info p {
  margin-bottom: 0.8rem;
}

.map-container {
  margin-top: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-container iframe {
  display: block;
  width: 100%;
  height: 300px;
  border: none;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

li::before {
  content: "•";
  color: #dc3545;
  position: absolute;
  left: 0;
}
</style> 