<script setup>
import { ref, computed } from 'vue'
import { getBookings, deleteBooking, completeBooking } from '../services/bookingService.js'

const allBookings = getBookings()

const searchQuery = ref('')
const statusFilter = ref('alla')

// ✅ NYTT: datumfilter (tomt = alla datum)
const dateFilter = ref('')

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
        <input
          type="text"
          v-model="searchQuery"
          placeholder="🔍 Sök kund, reg.nr eller service..."
        />
      </div>

      <!-- ✅ NYTT: datumfilter -->
      <div class="date-filter">
        <input type="date" v-model="dateFilter" class="date-input" />
      </div>

      <div class="filter-controls">
        <button @click="statusFilter = 'alla'" :class="{ active: statusFilter === 'alla' }">Alla</button>
        <button @click="statusFilter = 'bokad'" :class="{ active: statusFilter === 'bokad' }">Bokade</button>
        <button @click="statusFilter = 'avslutad'" :class="{ active: statusFilter === 'avslutad' }">Avslutade</button>
      </div>
    </div>

    <div class="booking-list-wrapper">
      <p v-if="filteredBookings.length === 0">
        Hittade inga bokningar som matchar sök- och filterkriterierna.
      </p>

      <ul v-else class="booking-list">
        <li v-for="booking in filteredBookings" :key="booking.id" :class="booking.status">
          <div class="booking-info">
            <strong>{{ booking.kundNamn }} ({{ booking.regNr }})</strong><br />
            Tjänst: {{ booking.service }} |
            Datum: {{ booking.datum }}
            <span v-if="booking.tid">kl {{ booking.tid }}</span>
            |
            Status: <span class="status">{{ (booking.status || '').toUpperCase() }}</span>
          </div>

          <div class="actions">
            <button
              v-if="booking.status !== 'avslutad'"
              @click="completeBooking(booking.id, booking.service || 'Service utförd')"
              class="complete-btn"
            >
              Markera som Avslutad
            </button>

            <button class="edit-btn" disabled title="Kommer senare">Redigera</button>

            <button @click="deleteBooking(booking.id)" class="delete-btn">
              Ta bort 🗑️
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.controls-container { margin-bottom: 20px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap; }
.search-input input { padding: 8px; border: 1px solid #ccc; width: 300px; border-radius: 6px; }

.date-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.filter-controls button {
  padding: 8px 15px; border: 1px solid #ccc; background-color: #f0f0f0; cursor: pointer; border-radius: 6px;
}
.filter-controls button.active { background-color: #3498db; color: white; border-color: #3498db; }

.booking-list { list-style: none; padding: 0; margin: 0; }
.booking-list li {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px; border-bottom: 1px solid #eee;
}
.booking-list li.avslutad { background-color: #e6e6e6; }
.booking-list li.bokad { background-color: #f9f9e2; }

.status { font-weight: bold; }

.actions button { margin-left: 10px; padding: 6px 10px; cursor: pointer; border-radius: 6px; }
.delete-btn { background-color: #e74c3c; color: white; border: none; }
.complete-btn { background-color: #2ecc71; color: white; border: none; }
.edit-btn { background-color: #f39c12; color: white; border: none; opacity: 0.6; cursor: not-allowed; }
</style>
