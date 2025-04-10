<template>
  <div class="tickets">
    <h1>Akce v Brně</h1>
    
    <div class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Hledat akce..."
          class="search-input"
        >
        <select v-model="selectedCategory" class="category-filter">
          <option value="">Všechny kategorie</option>
          <option value="culture">Kultura</option>
          <option value="sport">Sport</option>
          <option value="music">Hudba</option>
          <option value="food">Gastronomie</option>
          <option value="education">Vzdělávání</option>
          <option value="family">Pro rodiny</option>
          <option value="escape">Únikové hry</option>
        </select>
      </div>
    </div>

    <div class="tickets-grid">
      <div v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
        <div class="custom-image-container">
          <img :src="ticket.customImage || ticket.image" :alt="ticket.name" class="ticket-image">
        </div>
        <div class="ticket-content">
          <h3>{{ ticket.name }}</h3>
          <p class="ticket-description">{{ ticket.description }}</p>
          <div class="ticket-details">
            <span class="ticket-price">{{ ticket.price }}</span>
            <span class="ticket-date">{{ ticket.date }}</span>
          </div>
          <div class="ticket-location">
            <span class="material-icons">location_on</span>
            {{ ticket.location }}
          </div>
          <div v-if="ticket.price === 'Zdarma'" class="free-ticket-info">
            <span class="material-icons">check_circle</span>
            Vstup zdarma
          </div>
          <div v-else class="add-to-cart" @click="addToCart(ticket)">
            <span class="material-icons">shopping_cart</span>
            Koupit lístek
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog pro zadání počtu lístků -->
    <div class="ticket-dialog" v-if="showTicketDialog">
      <div class="dialog-content">
        <h3>Koupit lístky na {{ selectedTicket?.name }}</h3>
        <div class="dialog-details">
          <p><strong>Datum:</strong> {{ selectedTicket?.date }}</p>
          <p><strong>Cena:</strong> {{ selectedTicket?.price }}</p>
          <p><strong>Místo:</strong> {{ selectedTicket?.location }}</p>
        </div>
        <div class="quantity-selector">
          <label for="ticket-quantity">Počet lístků:</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <input 
              type="number" 
              id="ticket-quantity" 
              v-model="quantity" 
              min="1" 
              max="10"
            >
            <button @click="increaseQuantity" :disabled="quantity >= 10">+</button>
          </div>
        </div>
        <div class="dialog-total">
          <p><strong>Celková cena:</strong> {{ calculateTotal }}</p>
        </div>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeDialog">Zrušit</button>
          <button class="confirm-btn" @click="confirmPurchase">Potvrdit nákup</button>
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
const searchQuery = ref('')
const selectedCategory = ref('')
const showTicketDialog = ref(false)
const selectedTicket = ref(null)
const quantity = ref(1)

const tickets = ref([
  {
    id: 1,
    name: 'Brněnský masopust',
    description: 'Největší masopustní průvod v Brně s tradičními maskami a zábavou',
    price: 'Zdarma',
    date: '17. února 2025',
    category: 'culture',
    location: 'Náměstí Svobody, Brno',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    customImage: localStorage.getItem('customImage_1') || null
  },
  {
    id: 2,
    name: 'Koncert Brněnské filharmonie',
    description: 'Klasická hudba v podání Brněnské filharmonie v Besedním domě',
    price: '290 Kč',
    date: '20. února 2025',
    category: 'music',
    location: 'Besední dům, Brno',
    image: 'https://images.pexels.com/photos/111287/pexels-photo-111287.jpeg',
    customImage: localStorage.getItem('customImage_2') || null
  },
  {
    id: 3,
    name: 'Výstava moderního umění',
    description: 'Retrospektiva moderního umění 20. století v Moravské galerii',
    price: '150 Kč',
    date: 'Do 31. března 2025',
    category: 'culture',
    location: 'Moravská galerie, Brno',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    customImage: localStorage.getItem('customImage_3') || null
  },
  {
    id: 4,
    name: 'Brněnský food festival',
    description: 'Největší gastronomický festival v Brně s ochutnávkami a workshopy',
    price: '200 Kč',
    date: '15.-17. března 2025',
    category: 'food',
    location: 'Výstaviště Brno',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    customImage: localStorage.getItem('customImage_4') || null
  },
  {
    id: 5,
    name: 'Maraton Brno',
    description: 'Tradiční brněnský maraton s trasou přes celé město',
    price: '800 Kč',
    date: '5. května 2025',
    category: 'sport',
    location: 'Start: Náměstí Svobody, Brno',
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
    customImage: localStorage.getItem('customImage_5') || null
  },
  {
    id: 6,
    name: 'Dětský den na Špilberku',
    description: 'Zábavný program pro celou rodinu na hradě Špilberk',
    price: '100 Kč',
    date: '1. června 2025',
    category: 'family',
    location: 'Hrad Špilberk, Brno',
    image: 'https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg',
    customImage: localStorage.getItem('customImage_6') || null
  },
  {
    id: 7,
    name: 'Brněnský Majáles',
    description: 'Největší studentský festival v Brně s koncerty, divadlem a zábavou',
    price: '699 Kč',
    date: '10. května 2025',
    category: 'music',
    location: 'Výstaviště Brno',
    image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
    customImage: localStorage.getItem('customImage_7') || null
  },
  {
    id: 8,
    name: 'Romeo a Julie',
    description: 'Klasické dílo Williama Shakespeara v moderním pojetí Národního divadla Brno',
    price: '450 Kč',
    date: '25. dubna 2025',
    category: 'culture',
    location: 'Mahenovo divadlo, Brno',
    image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg',
    customImage: localStorage.getItem('customImage_8') || null
  },
  {
    id: 9,
    name: 'Labutí jezero',
    description: 'Světoznámý balet P. I. Čajkovského v podání Baletu NdB',
    price: '590 Kč',
    date: '15. března 2025',
    category: 'culture',
    location: 'Janáčkovo divadlo, Brno',
    image: 'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg',
    customImage: localStorage.getItem('customImage_9') || null
  },
  {
    id: 10,
    name: 'Noc na Karlštejně',
    description: 'Oblíbený český muzikál s živým orchestrem',
    price: '390 Kč',
    date: '8. dubna 2025',
    category: 'culture',
    location: 'Městské divadlo Brno',
    image: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg',
    customImage: localStorage.getItem('customImage_10') || null
  },
  {
    id: 11,
    name: 'Tajemný hrad Špilberk',
    description: 'Úniková hra v historických prostorách hradu Špilberk. Vyřešte záhady středověkého hradu a unikněte před časem!',
    price: '450 Kč',
    date: 'Každý den 10:00-20:00',
    location: 'Hrad Špilberk, Brno',
    image: 'https://images.pexels.com/photos/4101555/pexels-photo-4101555.jpeg',
    category: 'escape',
    customImage: localStorage.getItem('customImage_11') || null
  },
  {
    id: 12,
    name: 'Záhada staré radnice',
    description: 'Historická úniková hra v budově Staré radnice. Odhalte tajemství brněnské radnice a najděte ukrytý poklad!',
    price: '390 Kč',
    date: 'Každý den 9:00-21:00',
    location: 'Stará radnice, Brno',
    image: 'https://images.app.goo.gl/X3NAKQ9UCEYx2ric9',
    category: 'escape',
    customImage: localStorage.getItem('customImage_12') || localStorage.getItem('customEscapeImage') || null
  },
  {
    id: 13,
    name: 'Laboratoř šíleného vědce',
    description: 'Sci-fi úniková hra v laboratoři šíleného vědce. Zastavte experiment, který by mohl zničit celé město!',
    price: '420 Kč',
    date: 'Každý den 11:00-22:00',
    location: 'Výstaviště Brno',
    image: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg',
    category: 'escape',
    customImage: localStorage.getItem('customImage_13') || null
  },
  {
    id: 14,
    name: 'Jump Park Brno',
    description: 'Největší trampolínový park v Brně s více než 100 trampolínami, foam pit, basketbalovými koši a dalšími atrakcemi pro celou rodinu.',
    price: '290 Kč',
    date: 'Každý den 10:00-22:00',
    location: 'Cejl 109, Brno',
    image: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg',
    category: 'family',
    customImage: localStorage.getItem('customImage_14') || null
  },
  {
    id: 15,
    name: 'ZOO Brno',
    description: 'Zoologická zahrada Brno s více než 300 druhy zvířat, dětským hřištěm, lanovkou a výběhy pro kontakt se zvířaty.',
    price: '150 Kč',
    date: 'Každý den 9:00-18:00',
    location: 'U Zoologické zahrady 46, Brno',
    image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg',
    category: 'family',
    customImage: localStorage.getItem('customImage_15') || null
  },
  {
    id: 16,
    name: 'VIDA! science centrum',
    description: 'Interaktivní science centrum s více než 170 exponáty, 3D kinem, science show a programy pro děti i dospělé.',
    price: '220 Kč',
    date: 'Každý den 10:00-18:00',
    location: 'Křížkovského 554/12, Brno',
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
    category: 'education',
    customImage: localStorage.getItem('customImage_16') || null
  },
  {
    id: 17,
    name: 'Zábavní centrum Bongo',
    description: 'Zábavní centrum s bowlingem, laser game, virtuální realitou, dětským koutkem a restaurací pro celou rodinu.',
    price: '180 Kč',
    date: 'Každý den 11:00-23:00',
    location: 'Heršpická 15, Brno',
    image: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
    category: 'family',
    customImage: localStorage.getItem('customImage_17') || null
  }
])

const filteredTickets = computed(() => {
  return tickets.value
    .filter(ticket => {
      const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesCategory = !selectedCategory.value || ticket.category === selectedCategory.value
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      // Funkce pro převod data na objekt Date
      const parseDate = (dateStr) => {
        // Pokud datum začíná "Do", vezmeme konečné datum
        if (dateStr.startsWith('Do')) {
          dateStr = dateStr.split(' ')[1]
        }
        
        // Pokud datum obsahuje rozsah (např. "15.-17. března 2025"), vezmeme první datum
        if (dateStr.includes('-')) {
          dateStr = dateStr.split('-')[0] + dateStr.split('-')[1].split(' ').slice(1).join(' ')
        }
        
        // Převedeme datum z formátu "DD. MM. YYYY" na objekt Date
        const parts = dateStr.split(' ')
        const day = parseInt(parts[0].replace('.', ''))
        
        // Mapování českých měsíců na čísla
        const monthMap = {
          'ledna': 0, 'února': 1, 'března': 2, 'dubna': 3, 'května': 4, 'června': 5,
          'července': 6, 'srpna': 7, 'září': 8, 'října': 9, 'listopadu': 10, 'prosince': 11
        }
        
        const month = monthMap[parts[1]]
        const year = parseInt(parts[2])
        
        return new Date(year, month, day)
      }

      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)
      return dateA - dateB
    })
})

const addToCart = (ticket) => {
  // Kontrola, zda je uživatel přihlášen
  if (!store.state.auth.isLoggedIn) {
    // Pokud není přihlášen, přesměrujeme ho na stránku s přihlášením
    router.push('/auth')
    return
  }
  
  // Nastavíme vybraný lístek
  selectedTicket.value = ticket
  
  // Nastavíme výchozí množství na 1
  quantity.value = 1
  
  // Zobrazíme dialog pro výběr počtu lístků
  showTicketDialog.value = true
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++
  }
}

const closeDialog = () => {
  showTicketDialog.value = false
  selectedTicket.value = null
  quantity.value = 1
}

const calculateTotal = computed(() => {
  if (!selectedTicket.value) return '0 Kč'
  
  // Pokud je cena "Zdarma", vrátíme 0 Kč
  if (selectedTicket.value.price === 'Zdarma') {
    return '0 Kč'
  }
  
  // Extrahujeme číslo z ceny (např. "290 Kč" -> 290)
  const price = parseInt(selectedTicket.value.price.replace(/[^\d]/g, ''))
  return `${price * quantity.value} Kč`
})

const confirmPurchase = () => {
  if (selectedTicket.value && quantity.value > 0) {
    // Vytvoříme nový objekt s informacemi o lístku a množství
    const ticketWithQuantity = {
      ...selectedTicket.value,
      quantity: quantity.value
    }
    
    console.log('Přidávám do košíku:', ticketWithQuantity)
    
    // Přidáme lístek do košíku pomocí dispatch
    store.dispatch('cart/addToCart', ticketWithQuantity)
    
    // Zavřeme dialog
    showTicketDialog.value = false
    
    // Resetujeme vybraný lístek a množství
    selectedTicket.value = null
    quantity.value = 1
  }
}

const openPurchaseDialog = (ticket) => {
  // Implementace otevření dialogu pro koupi lístku
  console.log('Otevírám dialog pro koupi lístku:', ticket)
}
</script>

<style scoped>
.tickets {
  padding: 2rem 0;
  min-height: 100vh;
}

:root {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.7) 100%), 
              url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg') center/cover fixed;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.filters {
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid white;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  color: #333;
}

.search-input:focus {
  outline: none;
  border-color: #dc3545;
}

.category-filter {
  padding: 0.8rem;
  border: 2px solid white;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.category-filter:focus {
  outline: none;
  border-color: #dc3545;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
  
  .category-filter {
    display: none;
  }
  
  .search-input {
    width: 100%;
  }
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.ticket-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border: 1px solid rgba(220, 53, 69, 0.1);
}

.ticket-card:hover {
  transform: translateY(-5px);
}

.ticket-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.ticket-content {
  padding: 1.5rem;
}

.ticket-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.ticket-description {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.ticket-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ticket-price {
  color: #dc3545;
  font-weight: bold;
  font-size: 1.2rem;
}

.ticket-date {
  color: #666;
  font-size: 0.9rem;
}

.ticket-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.ticket-location .material-icons {
  font-size: 1.2rem;
  color: #dc3545;
}

.add-to-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #c82333;
}

.add-to-cart .material-icons {
  font-size: 1.2rem;
  color: white;
}

.free-ticket-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.free-ticket-info:hover {
  background-color: #c82333;
}

.free-ticket-info .material-icons {
  font-size: 1.2rem;
  color: white;
}

.ticket-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
}

.dialog-details {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.dialog-details p {
  margin: 0.5rem 0;
}

.quantity-selector {
  margin-bottom: 1.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #dc3545;
  background-color: white;
  color: #dc3545;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.dialog-total {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  text-align: right;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .confirm-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  color: #333;
}

.confirm-btn {
  background-color: #dc3545;
  border: none;
  color: white;
}

.cancel-btn:hover {
  background-color: #e9ecef;
}

.confirm-btn:hover {
  background-color: #c82333;
}

.custom-image-container {
  position: relative;
  width: 100%;
  height: 200px;
}
</style> 