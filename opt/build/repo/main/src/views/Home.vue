<template>
  <div class="home">
    <section class="hero">
      <h1>Objevte Brno</h1>
      <p class="subtitle">Nejlepší akce a zážitky v Brně na jednom místě</p>
      <router-link to="/tickets" class="cta-button">Prohlédnout akce</router-link>
    </section>
    
    <section class="featured-destinations">
      <h2>Nejbližší akce</h2>
      <div class="destinations-grid">
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg" alt="Brněnský masopust">
          <div class="destination-content">
            <h3>Brněnský masopust</h3>
            <p>Největší masopustní průvod v Brně</p>
            <span class="price">Zdarma</span>
            <span class="date">17. února 2024</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg" alt="Brněnská filharmonie">
          <div class="destination-content">
            <h3>Brněnská filharmonie</h3>
            <p>Koncert klasické hudby v Besedním domě</p>
            <span class="price">Od 290 Kč</span>
            <span class="date">20. února 2024</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg" alt="Výstava v Moravské galerii">
          <div class="destination-content">
            <h3>Výstava v Moravské galerii</h3>
            <p>Moderní umění 20. století</p>
            <span class="price">Od 150 Kč</span>
            <span class="date">Do 31. března 2024</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/3601094/pexels-photo-3601094.jpeg" alt="Tajemný hrad Špilberk">
          <div class="destination-content">
            <h3>Tajemný hrad Špilberk</h3>
            <p>Úniková hra v historických prostorách hradu</p>
            <span class="price">450 Kč</span>
            <span class="date">Každý den 10:00-20:00</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/3601094/pexels-photo-3601094.jpeg" alt="Záhada staré radnice">
          <div class="destination-content">
            <h3>Záhada staré radnice</h3>
            <p>Úniková hra v historické budově radnice</p>
            <span class="price">390 Kč</span>
            <span class="date">Každý den 9:00-21:00</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
        
        <div class="destination-card">
          <img src="https://images.pexels.com/photos/3601094/pexels-photo-3601094.jpeg" alt="Laboratoř šíleného vědce">
          <div class="destination-content">
            <h3>Laboratoř šíleného vědce</h3>
            <p>Sci-fi úniková hra na výstavišti</p>
            <span class="price">420 Kč</span>
            <span class="date">Každý den 11:00-22:00</span>
            <router-link to="/tickets" class="buy-ticket-btn">Koupit lístek</router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="categories">
      <h2>Kategorie akcí</h2>
      <div class="categories-grid">
        <router-link to="/tickets?category=culture" class="category-card">
          <span class="material-icons">theater_comedy</span>
          <h3>Kultura</h3>
        </router-link>
        <router-link to="/tickets?category=sport" class="category-card">
          <span class="material-icons">sports</span>
          <h3>Sport</h3>
        </router-link>
        <router-link to="/tickets?category=music" class="category-card">
          <span class="material-icons">music_note</span>
          <h3>Hudba</h3>
        </router-link>
        <router-link to="/tickets?category=food" class="category-card">
          <span class="material-icons">restaurant</span>
          <h3>Gastronomie</h3>
        </router-link>
        <router-link to="/tickets?category=education" class="category-card">
          <span class="material-icons">school</span>
          <h3>Vzdělávání</h3>
        </router-link>
        <router-link to="/tickets?category=family" class="category-card">
          <span class="material-icons">family_restroom</span>
          <h3>Pro rodiny</h3>
        </router-link>
        <router-link to="/tickets?category=escape" class="category-card">
          <span class="material-icons">lock</span>
          <h3>Únikové hry</h3>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
// Component logic will go here
</script>

<style scoped>
.home {
  padding: 2rem 0;
}

.hero {
  text-align: center;
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #dc3545 0%, #8b0000 100%);
  color: white;
  border-radius: 12px;
  margin: 2rem;
  box-shadow: 0 10px 30px rgba(220, 53, 69, 0.2);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
  pointer-events: none;
  z-index: 1;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.cta-button {
  display: inline-block;
  padding: 1.2rem 2.5rem;
  background-color: white;
  color: #dc3545;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background-color: #f8f9fa;
}

.featured-destinations, .categories {
  margin-bottom: 4rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
}

.destinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.destination-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.destination-card:hover {
  transform: translateY(-5px);
}

.destination-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.destination-content {
  padding: 1.5rem;
}

.destination-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.destination-content p {
  color: #666;
  margin-bottom: 1rem;
}

.price {
  color: #dc3545;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.category-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.category-card .material-icons {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #dc3545;
}

.category-card h3 {
  margin: 0;
  font-size: 1.2rem;
}
</style> 