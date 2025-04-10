<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>Můj profil</h1>
    </div>
    
    <div class="profile-content">
      <div class="profile-info">
        <h2>Osobní údaje</h2>
        <div class="info-card">
          <div class="info-item">
            <span class="material-icons">person</span>
            <div class="info-details">
              <label>Jméno</label>
              <div class="editable-field">
                <p v-if="!isEditingName">{{ userName }}</p>
                <div v-else class="edit-input-container">
                  <input 
                    type="text" 
                    v-model="editedName" 
                    class="edit-input"
                    @blur="saveName"
                    @keyup.enter="saveName"
                    ref="nameInput"
                  >
                </div>
                <button 
                  class="edit-button" 
                  @click="startEditingName"
                  v-if="!isEditingName"
                >
                  <span class="material-icons">edit</span>
                </button>
              </div>
            </div>
          </div>
          <div class="info-item">
            <span class="material-icons">email</span>
            <div class="info-details">
              <label>Email</label>
              <p>{{ userEmail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="tickets-history">
        <h2>Historie vstupenek</h2>
        <div class="tickets-list" v-if="purchasedTickets.length">
          <div v-for="ticket in purchasedTickets" :key="ticket.id + ticket.purchaseDate" class="ticket-item" :data-key="ticket.id + ticket.purchaseDate">
            <div class="ticket-header" @click="toggleTicketDetails(ticket)">
              <div class="ticket-basic-info">
                <h3>{{ ticket.name }}</h3>
                <p class="ticket-date">{{ formatDate(ticket.purchaseDate) }}</p>
              </div>
              <span class="material-icons toggle-icon">{{ expandedTickets.includes(ticket.id + ticket.purchaseDate) ? 'expand_less' : 'expand_more' }}</span>
            </div>
            <div class="ticket-details" v-if="expandedTickets.includes(ticket.id + ticket.purchaseDate)">
              <div class="ticket-details-content">
                <div class="ticket-info">
                  <p class="ticket-event-date">Datum akce: {{ ticket.date }}</p>
                  <p class="ticket-location">
                    <span class="material-icons">location_on</span>
                    {{ ticket.location }}
                  </p>
                  <p class="ticket-price">Cena: {{ ticket.price }}</p>
                  <p class="ticket-quantity">Počet vstupenek: {{ ticket.quantity }}</p>
                  <p class="ticket-order-id">ID objednávky: {{ ticket.orderId }}</p>
                  <p class="ticket-payment-method">Způsob platby: {{ formatPaymentMethod(ticket.paymentMethod) }}</p>
                </div>
                
                <div class="ticket-qr-section">
                  <h4>QR kód pro vstup</h4>
                  <div class="qr-container">
                    <QRCodeVue :value="generateQRValue(ticket)" :size="200" level="H" />
                  </div>
                  <button class="download-button" @click="downloadTicket(ticket)">
                    <span class="material-icons">download</span>
                    Stáhnout vstupenku
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-tickets">
          <p>Zatím nemáte zakoupené žádné vstupenky.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import QRCodeVue from 'qrcode.vue'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logoImage from '../assets/logo.PNG'

const userName = ref('')
const userEmail = ref('')
const purchasedTickets = ref([])
const isEditingName = ref(false)
const editedName = ref('')
const nameInput = ref(null)
const router = useRouter()
const store = useStore()
const expandedTickets = ref([])

onMounted(() => {
  console.log('Profile page mounted')
  
  // Načtení dat uživatele z localStorage
  const loginState = localStorage.getItem('loginState')
  if (loginState) {
    const userData = JSON.parse(loginState)
    userName.value = userData.userName
    userEmail.value = userData.email
    
    // Načtení zakoupených lístků pro daného uživatele
    const userTicketsKey = `purchasedTickets_${userData.email}`
    let userTickets = []
    
    // 1. Zkusíme načíst lístky z nového formátu (specifického pro uživatele)
    const savedUserTickets = localStorage.getItem(userTicketsKey)
    if (savedUserTickets) {
      try {
        userTickets = JSON.parse(savedUserTickets)
        console.log('Načtené lístky z nového formátu:', userTickets)
      } catch (error) {
        console.error('Chyba při načítání lístků z nového formátu:', error)
      }
    }
    
    // 2. Zkusíme načíst lístky ze starého formátu (globální)
    const savedGlobalTickets = localStorage.getItem('purchasedTickets')
    if (savedGlobalTickets) {
      try {
        const globalTickets = JSON.parse(savedGlobalTickets)
        console.log('Načtené lístky ze starého formátu:', globalTickets)
        
        // Přidáme globální lístky k uživatelským
        userTickets = [...userTickets, ...globalTickets]
        
        // Uložíme kombinované lístky do nového formátu
        localStorage.setItem(userTicketsKey, JSON.stringify(userTickets))
        
        // Smažeme starý formát
        localStorage.removeItem('purchasedTickets')
        console.log('Lístky byly migrovány do nového formátu')
      } catch (error) {
        console.error('Chyba při načítání lístků ze starého formátu:', error)
      }
    }
    
    purchasedTickets.value = userTickets
    console.log('Finální seznam lístků:', purchasedTickets.value)
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPaymentMethod = (method) => {
  switch (method) {
    case 'bank-transfer':
      return 'Bankovní převod'
    case 'card':
      return 'Platba kartou'
    case 'applepay':
      return 'Apple Pay'
    default:
      return method
  }
}

const startEditingName = () => {
  editedName.value = userName.value
  isEditingName.value = true
  nextTick(() => {
    nameInput.value.focus()
  })
}

const saveName = () => {
  if (editedName.value.trim()) {
    userName.value = editedName.value.trim()
    
    // Aktualizace v localStorage
    const loginState = localStorage.getItem('loginState')
    if (loginState) {
      const userData = JSON.parse(loginState)
      userData.userName = userName.value
      localStorage.setItem('loginState', JSON.stringify(userData))
    }

    // Aktualizace v Vuex store
    store.dispatch('login', { userName: userName.value, email: userEmail.value })
  }
  
  isEditingName.value = false
}

const goToProfile = () => {
  router.push('/profile')
}

const toggleTicketDetails = (ticket) => {
  if (expandedTickets.value.includes(ticket.id + ticket.purchaseDate)) {
    expandedTickets.value = expandedTickets.value.filter(id => id !== ticket.id + ticket.purchaseDate)
  } else {
    expandedTickets.value.push(ticket.id + ticket.purchaseDate)
  }
}

const generateQRValue = (ticket) => {
  return JSON.stringify({
    ticketId: ticket.id,
    orderId: ticket.orderId,
    eventName: ticket.name,
    date: ticket.date,
    quantity: ticket.quantity
  })
}

// Funkce pro převod českých znaků na verzi bez diakritiky (pro PDF)
const convertCzechChars = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/ě/g, 'e').replace(/Ě/g, 'E')
    .replace(/š/g, 's').replace(/Š/g, 'S')
    .replace(/č/g, 'c').replace(/Č/g, 'C')
    .replace(/ř/g, 'r').replace(/Ř/g, 'R')
    .replace(/ž/g, 'z').replace(/Ž/g, 'Z')
    .replace(/ý/g, 'y').replace(/Ý/g, 'Y')
    .replace(/á/g, 'a').replace(/Á/g, 'A')
    .replace(/í/g, 'i').replace(/Í/g, 'I')
    .replace(/é/g, 'e').replace(/É/g, 'E')
    .replace(/ú/g, 'u').replace(/Ú/g, 'U')
    .replace(/ů/g, 'u').replace(/Ů/g, 'U')
    .replace(/ť/g, 't').replace(/Ť/g, 'T')
    .replace(/ď/g, 'd').replace(/Ď/g, 'D')
    .replace(/ň/g, 'n').replace(/Ň/g, 'N');
}

// Funkce pro formátování data specificky pro PDF
const formatDateForPDF = (dateString) => {
  if (!dateString) return '';
  try {
    // Pokus o standardní formát DD. MM. YYYY
    if (/^\d{1,2}\. \d{1,2}\. \d{4}$/.test(dateString)) {
      return dateString;
    }

    // Mapování normalizovaných měsíců
    const monthMapNormalized = {
      'ledna': '1', 'unora': '2', 'brezna': '3', 'dubna': '4', 
      'kvetna': '5', 'cervna': '6', 'cervence': '7', 'srpna': '8', 
      'zari': '9', 'rijna': '10', 'listopadu': '11', 'prosince': '12'
    };

    // NOVÝ: Pokus o formát rozsahu DD.-DD. month YYYY
    if (/^\d{1,2}\.-\d{1,2}\. [a-záčďéěíňóřšťúůýž]+ \d{4}$/i.test(dateString)) {
      const parts = dateString.split(' '); 
      const dayPart = parts[0];
      const day = dayPart.split('.-')[0]; 
      const monthNameRaw = parts[1]; 
      const year = parts[2]; 
      // Normalizujeme název měsíce pro vyhledávání
      const monthName = monthNameRaw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Hledáme v normalizované mapě
      if (monthMapNormalized[monthName]) {
        return `${day}. ${monthMapNormalized[monthName]}. ${year}`; 
      } else {
        console.warn('Neznámý název měsíce (v rozsahu) pro PDF:', monthNameRaw, 'v datu:', dateString);
        return dateString; 
      }
    }
    
    // Stávající pokus o formát DD. month YYYY
    if (/^\d{1,2}\. [a-záčďéěíňóřšťúůýž]+ \d{4}$/i.test(dateString)) {
      const parts = dateString.split(' ');
      const day = parts[0].replace('.', '');
      const year = parts[2];
      const monthNameRaw = parts[1];
      // Normalizujeme název měsíce pro vyhledávání
      const monthName = monthNameRaw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Hledáme v normalizované mapě
      if (monthMapNormalized[monthName]) {
        return `${day}. ${monthMapNormalized[monthName]}. ${year}`;
      } else {
        console.warn('Neznámý název měsíce pro PDF:', monthNameRaw, 'v datu:', dateString);
        return dateString; 
      }
    }
    
    // Obecné parsování
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}. ${month}. ${year}`;
    } else {
       console.warn('Nepodařilo se zformátovat datum pro PDF:', dateString);
      return dateString;
    }
  } catch (error) {
    console.error('Chyba při formátování data pro PDF:', error, dateString);
    return dateString;
  }
}

const downloadTicket = async (ticket) => {
  console.log('Spouštím downloadTicket pro:', JSON.parse(JSON.stringify(ticket)));
  try {
    // Use A4 Portrait format
    const doc = new jsPDF({
      orientation: 'portrait', 
      unit: 'mm', 
      format: 'a4' 
    });
    console.log('jsPDF instance vytvořena (A4 Portrait).');

    const quantity = ticket.quantity || 1;
    console.log(`Počet vstupenek: ${quantity}`);

    const dataKey = ticket.id + ticket.purchaseDate;
    console.log(`Hledám QR canvas s data-key: ${dataKey}`);
    const qrCanvas = document.querySelector(`.ticket-item[data-key="${dataKey}"] .qr-container canvas`);
    
    if (!qrCanvas) {
      console.error('QR code canvas not found! Selektor:', `.ticket-item[data-key="${dataKey}"] .qr-container canvas`);
      alert('Nepodařilo se najít QR kód pro tisk. Ujistěte se, že jsou detaily vstupenky rozbalené.');
      return;
    }
    console.log('QR canvas nalezen:', qrCanvas);

    const qrImage = qrCanvas.toDataURL('image/png'); 
    console.log('QR kód DataURL (PNG) vygenerován.');

    const ticketHeight = 80; // Estimated height for one ticket area in mm
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageMargin = 15; // Top/Bottom/Left/Right margin for content area
    let currentTicketStartY = pageMargin; // Initial Y position for the first ticket

    console.log('Zahajuji cyklus kreslení vstupenek...');
    for (let i = 0; i < quantity; i++) {
      const ticketIndex = i + 1;
      console.log(`Kreslím vstupenku ${ticketIndex} z ${quantity}`);

      // Check if the current ticket fits on the page, add new page if not
      if (currentTicketStartY + ticketHeight > pageHeight - pageMargin && i > 0) {
          console.log('Vstupenka se nevejde, přidávám novou stránku.');
          doc.addPage();
          currentTicketStartY = pageMargin; // Reset Y for the new page
      }

      // --- Drawing logic for one ticket --- 
      doc.setFont('Helvetica'); 
      const leftMargin = pageMargin;
      const rightMargin = pageWidth - pageMargin;
      let currentDrawingY = currentTicketStartY + 5; // Start drawing slightly below the ticket top
      const contentWidth = pageWidth - 2 * pageMargin;

      // --- Header Section (QR, Logo, Text) ---
      const headerStartY = currentDrawingY;
      const qrSize = 30;
      doc.addImage(qrImage, 'PNG', leftMargin, headerStartY, qrSize, qrSize); 
      const textStartX = leftMargin + qrSize + 10;
      const logoWidth = 25;
      const logoHeight = 10;
      const logoX = rightMargin - logoWidth;
      const logoY = headerStartY;
      doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
      let textCurrentY = headerStartY + 3; // Start text slightly lower than QR/Logo top
      const headerTextMaxWidth = rightMargin - textStartX - logoWidth - 5; // Max width for text between QR and Logo

      doc.setFontSize(8);
      doc.text(convertCzechChars('Pořadatel: Kam v Brně'), textStartX, textCurrentY);
      textCurrentY += 5;
      doc.setFontSize(14);
      doc.setFont('Helvetica', 'bold');
      const eventNameLines = doc.splitTextToSize(convertCzechChars(ticket.name), headerTextMaxWidth);
      doc.text(eventNameLines, textStartX, textCurrentY);
      textCurrentY += (eventNameLines.length * 5) + 2;
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      doc.text(convertCzechChars(`Datum: ${formatDateForPDF(ticket.date)}`), textStartX, textCurrentY);
      textCurrentY += 6;
      doc.text(convertCzechChars(`Misto: ${convertCzechChars(ticket.location)}`), textStartX, textCurrentY);

      // --- Details Section (Holder, Type, Price) ---
      const detailsStartY = Math.max(headerStartY + qrSize, textCurrentY, headerStartY + logoHeight) + 10; // Start below header elements + margin
      let detailsCurrentY = detailsStartY;
      const columnWidth = contentWidth / 3;
      const columnStartX1 = leftMargin;
      const columnStartX2 = leftMargin + columnWidth;
      const columnStartX3 = leftMargin + 2 * columnWidth; // Not used if price is right aligned
      
      // Holder
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(convertCzechChars('DRŽITEL VSTUPENKY'), columnStartX1, detailsCurrentY);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('Helvetica', 'bold');
      doc.text(convertCzechChars(userName.value || 'Neznamy drzitel'), columnStartX1, detailsCurrentY + 5);
      doc.setFont('Helvetica', 'normal');

      // Type
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(convertCzechChars('VSTUPENKA'), columnStartX2, detailsCurrentY);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const ticketTypeLines = doc.splitTextToSize(convertCzechChars(ticket.name), columnWidth - 5);
      doc.text(ticketTypeLines[0] + (ticketTypeLines.length > 1 ? '...' : ''), columnStartX2, detailsCurrentY + 5);

      // Price (Right aligned)
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(convertCzechChars('CENA'), rightMargin, detailsCurrentY, { align: 'right' });
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont('Helvetica', 'bold');
      doc.text(String(ticket.price || ''), rightMargin, detailsCurrentY + 5, { align: 'right' });
      doc.setFont('Helvetica', 'normal');

      // --- Footer Section (Line, Text) ---
      const footerStartY = currentTicketStartY + ticketHeight - 12; // Position near the bottom of the allocated ticket area
      doc.setDrawColor(200, 200, 200);
      doc.line(leftMargin, footerStartY - 2, rightMargin, footerStartY - 2);
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      const footerText = 'Zmena programu, terminu, ci mista konani vyhrazena. Zakoupenim vstupenky a vstupem na akci vyjadruje jeji drzitel souhlas se vseobecnymi podminkami poradatele.';
      const footerLines = doc.splitTextToSize(convertCzechChars(footerText), contentWidth);
      doc.text(footerLines, leftMargin, footerStartY);
      
      // Red stripe only for the height of the ticket area
      const stripeWidth = 2;
      doc.setFillColor(220, 53, 69);
      doc.rect(0, currentTicketStartY, stripeWidth, ticketHeight, 'F'); // Y = currentTicketStartY, height = ticketHeight

      // Wider border around the ticket area, closer to page edges
      const borderMargin = 5; // Small margin from page edge for the border
      doc.setDrawColor(150, 150, 150); // Light gray border
      doc.rect(borderMargin, currentTicketStartY, pageWidth - 2 * borderMargin, ticketHeight); // x, y, width, height

      // --- End of drawing logic for one ticket ---
      console.log(`Dokončeno kreslení vstupenky ${ticketIndex}`);

      // Update the starting Y for the next ticket
      currentTicketStartY += ticketHeight; 

    } // Konec for cyklu kreslení
    console.log('Dokončen cyklus kreslení vstupenek.');

    console.log('Pokouším se uložit PDF...');
    doc.save(`vstupenka-${ticket.orderId}.pdf`);
    console.log('PDF uloženo.');

  } catch (error) {
    console.error('!!! CHYBA při generování PDF:', error);
    alert('Došlo k chybě při generování PDF. Zkontrolujte konzoli prohlížeče (F12) pro detaily.');
  }
}

const loadPurchasedTickets = () => {
  try {
    const savedTickets = localStorage.getItem('purchasedTickets')
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets)
      // Odstranění "Kč" z cen
      parsedTickets.forEach(ticket => {
        if (ticket.price && typeof ticket.price === 'string') {
          ticket.price = ticket.price.replace(' Kč', '')
        }
      })
      purchasedTickets.value = parsedTickets
      console.log('Načtené lístky:', purchasedTickets.value)
    }
  } catch (error) {
    console.error('Chyba při načítání lístků:', error)
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
}

.profile-header h1 {
  color: #dc3545;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.profile-content {
  display: grid;
  gap: 2rem;
}

.profile-info, .tickets-history {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #dc3545;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .material-icons {
  color: #dc3545;
  font-size: 2rem;
}

.info-details {
  flex: 1;
}

.info-details label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.info-details p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.editable-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #dc3545;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
}

.edit-button .material-icons {
  font-size: 1.2rem;
}

.edit-input-container {
  flex: 1;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #dc3545;
  border-radius: 4px;
  font-size: 1.1rem;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-item {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.ticket-item:hover {
  transform: translateY(-5px);
}

.ticket-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  background: white;
}

.ticket-basic-info {
  flex: 1;
}

.ticket-basic-info h3 {
  color: #dc3545;
  margin: 0;
  font-size: 1.1rem;
}

.ticket-date {
  margin: 0.3rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.toggle-icon {
  color: #dc3545;
  font-size: 1.5rem;
}

.ticket-details {
  padding: 1rem;
  border-top: 1px solid #eee;
  background: #f8f9fa;
}

.ticket-details-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.ticket-info {
  flex: 1;
}

.ticket-event-date,
.ticket-location,
.ticket-price,
.ticket-quantity,
.ticket-order-id,
.ticket-payment-method {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.ticket-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ticket-location .material-icons {
  font-size: 1rem;
  color: #dc3545;
}

.ticket-price {
  font-weight: bold;
  color: #dc3545;
}

.no-tickets {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .ticket-header {
    flex-direction: row;
    align-items: center;
  }

  .ticket-basic-info {
    margin-bottom: 0;
  }
}

.ticket-qr-section {
  flex-shrink: 0;
  width: 250px;
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.ticket-qr-section h4 {
  color: #dc3545;
  margin-bottom: 1rem;
}

.qr-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.download-button:hover {
  background: #c82333;
}

.download-button .material-icons {
  font-size: 1.2rem;
}
</style>
