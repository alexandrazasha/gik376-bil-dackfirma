<script setup>
import { ref, computed } from 'vue'
import { getBookings, deleteBooking, completeBooking, updateBooking, startBooking} from '../services/bookingService.js'

const allBookings = getBookings()

const searchQuery = ref('')
const statusFilter = ref('alla')
const expandedId = ref(null) //tillhör 'läs mer' för att få info om bokningen

<<<<<<< HEAD
// funktion som växlar mellan att visa och dölja
const toggleReadMore = (id) => {
  if (expandedId.value === id) {
    expandedId.value = null // Stäng om man klickar igen
  } else {
    expandedId.value = id // Öppna den klickade raden
  }
}

// katalogen med texter för läs mer
const serviceDescriptions = {
  'Däckbyte': 'Vi byter dina hjul till säsongens däck, kontrollerar däcktryck och ser över mönsterdjupet för din säkerhet.',
  'Hjulinställning': 'Vi justerar hjulens vinklar så att de är vinkelräta mot marken och parallella med varandra.',
  'Reparation': 'Felsökning och lagning av specifika fel på fordonet. Vi använder endast godkända reservdelar.',
  'Service': 'Genomgång av bilens kondition, byte av olja och filter samt kontroll av bromsar och belysning.',
  'Övrigt': 'Specialarbeten enligt överenskommelse med kund.'
}

const getServiceInfo = (serviceName) => {
  return serviceDescriptions[serviceName] || 'Information om denna tjänst fås vid inlämning av fordonet.'
}

// Logik för redigering
const editingId = ref(null)
const editForm = ref({ kundNamn: '', regNr: '', service: '' })

const startEdit = (booking) => {
  editingId.value = booking.id
  // Vi skapar en kopia för att inte ändra originalet innan man trycker på Spara
  editForm.value = { ...booking }
}

const cancelEdit = () => {
  editingId.value = null
}

const saveEdit = () => {
  updateBooking(editingId.value, editForm.value)
  editingId.value = null
}

// Sök- och filterlogik
=======
// ✅ NYTT: datumfilter (tomt = alla datum)
const dateFilter = ref('')

>>>>>>> Alexandras
const searchedBookings = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return allBookings.value

  return allBookings.value.filter(booking => {
    return (
      (booking.kundNamn || '').toLowerCase().includes(query) ||
      (booking.regNr || '').toLowerCase().includes(query) ||
      (booking.service || '').toLowerCase().includes(query)
    )
  })
})

// ✅ UPPDATERAD: filterar nu på status + datum
const filteredBookings = computed(() => {
  let list = searchedBookings.value

  // status
  if (statusFilter.value !== 'alla') {
    list = list.filter(b => b.status === statusFilter.value)
  }

  // datum
  if (dateFilter.value) {
    list = list.filter(b => b.datum === dateFilter.value)
  }

  return list
})


</script>

<template>
  <section>
    <h1>Mina Bokningar</h1>

    <div class="controls-container">
      <div class="search-input">
<<<<<<< HEAD
        <input type="text" v-model="searchQuery" placeholder="Sök kund, reg.nr eller service..." />
=======
        <input
          type="text"
          v-model="searchQuery"
          placeholder="🔍 Sök kund, reg.nr eller service..."
        />
      </div>

      <!-- ✅ NYTT: datumfilter -->
      <div class="date-filter">
        <input type="date" v-model="dateFilter" class="date-input" />
>>>>>>> Alexandras
      </div>

      <div class="filter-controls">
        <button @click="statusFilter = 'alla'" :class="{ active: statusFilter === 'alla' }">Alla</button>
        <button @click="statusFilter = 'bokad'" :class="{ active: statusFilter === 'bokad' }">Bokade</button>
        <button @click="statusFilter = 'pågående'" :class="{ active: statusFilter === 'pågående' }">Pågående</button>
        <button @click="statusFilter = 'avslutad'" :class="{ active: statusFilter === 'avslutad' }">Avslutade</button>
      </div>
    </div>

    <div class="booking-list-wrapper">
      <p v-if="filteredBookings.length === 0">
        Hittade inga bokningar som matchar sök- och filterkriterierna.
      </p>

      <ul v-else class="booking-list">
        <li v-for="booking in filteredBookings" :key="booking.id" :class="booking.status">
<<<<<<< HEAD
          
          <div v-if="editingId === booking.id" class="edit-mode-container">
            <div class="edit-inputs">
              <input v-model="editForm.kundNamn" placeholder="Kundnamn" />
              <input v-model="editForm.regNr" placeholder="Reg. nr" />
              <input v-model="editForm.service" placeholder="Service" />
            </div>
            <div class="actions">
              <button @click="saveEdit" class="save-btn">Spara</button>
              <button @click="cancelEdit" class="cancel-btn">Avbryt</button>
            </div>
=======
          <div class="booking-info">
            <strong>{{ booking.kundNamn }} ({{ booking.regNr }})</strong><br />
            Tjänst: {{ booking.service }} |
            Datum: {{ booking.datum }}
            <span v-if="booking.tid">kl {{ booking.tid }}</span>
            |
            Status: <span class="status">{{ (booking.status || '').toUpperCase() }}</span>
>>>>>>> Alexandras
          </div>

          <template v-else>
            <div class="booking-main-row">
              <div class="booking-info">
                <strong>{{ booking.kundNamn }} ({{ booking.regNr }})</strong><br />
                Tjänst: {{ booking.service }} |
                Status: <span class="status">{{ (booking.status || '').toUpperCase() }}</span>

<<<<<<< HEAD
                <button @click="toggleReadMore(booking.id)" class="read-more-link"> 
                  {{ expandedId === booking.id ? 'Visa mindre' : 'Läs mer om tjänsten' }}
                </button>
              </div>
=======
            <button class="edit-btn" disabled title="Kommer senare">Redigera</button>
>>>>>>> Alexandras

              <div class="actions">
                <button v-if="booking.status === 'bokad'" @click="startBooking(booking.id)" class="start-btn">
                  Påbörja
                </button>
                <button v-if="booking.status !== 'avslutad'" @click="completeBooking(booking.id, booking.service)" class="complete-btn">
                  Klar
                </button>
                <button @click="startEdit(booking)" class="edit-btn">Ändra</button>
                <button @click="deleteBooking(booking.id)" class="delete-btn">Ta bort</button>
              </div>
            </div>

            <div v-if="expandedId === booking.id" class="extra-info-box">
              <h4>Information om {{ booking.service }}</h4>
              <p>{{ getServiceInfo(booking.service) }}</p>
              <hr />
              <p><strong>Bokad tid:</strong> {{ booking.datum || 'Ej angivet' }} kl. {{ booking.tid || 'Ej angivet' }}</p>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.controls-container { margin-bottom: 20px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
.search-input input { padding: 8px; border: 1px solid #ccc; width: 300px; border-radius: 6px; }

<<<<<<< HEAD
=======
.date-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

>>>>>>> Alexandras
.filter-controls button {
  padding: 8px 15px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer; border-radius: 6px;
}
.filter-controls button.active { background-color: #3498db; color: white; border-color: #3498db; }

.booking-list { list-style: none; padding: 0; margin: 0; }
.booking-list li {
  display: flex; flex-direction: column; align-items: stretch;
  padding: 15px; border-bottom: 1px solid #eee; transition: background 0.3s;
}
<<<<<<< HEAD

/* Statusfärger */
.booking-list li.avslutad { background-color: #f2f2f2; opacity: 0.8; }
.booking-list li.bokad { background-color: #fffde7; }
.booking-list li.pågående { background-color: #e3f2fd; border-left: 5px solid #3498db; }

.booking-main-row {
  display: flex; justify-content: space-between; align-items: center; width: 100%;
}

.status { font-weight: bold; color: #2c3e50; }

/* Läs mer länk */
.read-more-link {
  background: none; border: none; color: #3498db; text-decoration: underline;
  cursor: pointer; padding: 0; display: block; margin-top: 5px; font-size: 0.9em;
}

/* Den utfällda boxen */
.extra-info-box {
  margin-top: 15px; padding: 15px; background-color: white;
  border-left: 4px solid #3498db; border-radius: 4px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}
.extra-info-box h4 { margin: 0 0 10px 0; color: #2c3e50; }
.extra-info-box hr { border: 0; border-top: 1px solid #eee; margin: 10px 0; }

/* Knappar */
.actions { display: flex; gap: 8px; }
.actions button { padding: 6px 12px; cursor: pointer; border-radius: 6px; border: none; font-weight: bold; }

.start-btn { background-color: #3498db; color: white; }
.complete-btn { background-color: #2ecc71; color: white; }
.delete-btn { background-color: #e74c3c; color: white; }
.edit-btn { background-color: #f39c12; color: white; opacity: 1 !important; cursor: pointer !important; }

.save-btn { background-color: #2ecc71; color: white; border: none; padding: 8px; border-radius: 4px; }
.cancel-btn { background-color: #95a5a6; color: white; border: none; padding: 8px; border-radius: 4px; }

.edit-mode-container { display: flex; justify-content: space-between; width: 100%; }
.edit-inputs { display: flex; gap: 10px; flex-grow: 1; }
.edit-inputs input { padding: 6px; border: 1px solid #ddd; border-radius: 4px; flex: 1; }
</style>
=======
.booking-list li.avslutad { background-color: #e6e6e6; }
.booking-list li.bokad { background-color: #f9f9e2; }

.status { font-weight: bold; }

.actions button { margin-left: 10px; padding: 6px 10px; cursor: pointer; border-radius: 6px; }
.delete-btn { background-color: #e74c3c; color: white; border: none; }
.complete-btn { background-color: #2ecc71; color: white; border: none; }
.edit-btn { background-color: #f39c12; color: white; border: none; opacity: 0.6; cursor: not-allowed; }
</style>
>>>>>>> Alexandras
