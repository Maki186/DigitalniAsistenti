<template>
  <div class="logo" :class="{ 'logo-dark': dark }">
    <div class="logo-icon">
      <span class="material-icons">location_on</span>
    </div>
    <div class="logo-text">
      <span class="logo-text-main">Kam v Brně</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  dark: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo-icon .material-icons {
  font-size: 24px;
  color: #dc3545;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-text-main {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Varianta pro tmavé pozadí */
.logo-dark .logo-icon {
  background-color: #dc3545;
}

.logo-dark .logo-icon .material-icons {
  color: white;
}

.logo-dark .logo-text-main {
  color: #dc3545;
}

@media (max-width: 768px) {
  .logo-icon {
    width: 32px;
    height: 32px;
  }
  
  .logo-icon .material-icons {
    font-size: 20px;
  }
  
  .logo-text-main {
    font-size: 1.2rem;
  }
}
</style> 