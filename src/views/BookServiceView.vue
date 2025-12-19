<script setup>
import { reactive, ref, computed, watch } from "vue"
import { addBooking, getBookings } from "../services/bookingService.js"

// Hämta alla bokningar (reaktiv lista)
const allBookings = getBookings()

const form = reactive({
  kundNamn: "",
  email: "",
  telefon: "",
  regNr: "",
  datum: "",
  tid: "",
  service: ""
})

const successMessage = ref("")
const errorMessage = ref("")

// Fasta tider (kan justeras)
const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
]

// ✅ Lediga tider = alla tider minus de som redan är bokade den dagen
const availableTimes = computed(() => {
  if (!form.datum) return []

  const takenTimes = allBookings.value
    .filter(b => b.datum === form.datum && b.status !== "avbokad")
    .map(b => b.tid)
    .filter(Boolean)

  return timeSlots.filter(t => !takenTimes.includes(t))
})

// ✅ När datum ändras: nollställ vald tid
watch(
  () => form.datum,
  () => {
    form.tid = ""
  }
)

function handleSubmit() {
  if (
    !form.kundNamn ||
    !form.email ||
    !form.telefon ||
    !form.regNr ||
    !form.datum ||
    !form.tid ||
    !form.service
  ) {
    errorMessage.value = "Alla fält måste fyllas i."
    successMessage.value = ""
    return
  }

  // Extra skydd: om någon hunnit boka samma tid precis innan submit
  if (!availableTimes.value.includes(form.tid)) {
    errorMessage.value = "Tiden du valt är inte längre ledig. Välj en annan tid."
    successMessage.value = ""
    return
  }

  addBooking({ ...form })

  successMessage.value = `Tack ${form.kundNamn}! Din bokning ${form.datum} kl ${form.tid} är registrerad.`
  errorMessage.value = ""

  Object.keys(form).forEach(key => (form[key] = ""))

  setTimeout(() => {
    successMessage.value = ""
  }, 5000)
}
</script>

<template>
  <section class="booking-page">
    <div class="header-container">
      <h1>Boka Service</h1>
      <p>Fyll i formuläret nedan för att boka en ny servicetid.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label for="kundNamn">Namn</label>
        <input
          id="kundNamn"
          type="text"
          v-model="form.kundNamn"
          placeholder="T.ex. Karolina Berg"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">E-post</label>
        <input
          id="email"
          type="email"
          v-model="form.email"
          placeholder="t.ex. namn@mail.se"
          required
        />
      </div>

      <div class="form-group">
        <label for="telefon">Telefonnummer</label>
        <input
          id="telefon"
          type="tel"
          v-model="form.telefon"
          placeholder="T.ex. 0701234567"
          required
        />
      </div>

      <div class="form-group">
        <label for="regNr">Registreringsnummer</label>
        <input
          id="regNr"
          type="text"
          v-model="form.regNr"
          placeholder="T.ex. ABC 123"
          required
        />
      </div>

      <div class="form-group">
        <label for="datum">Datum</label>
        <input id="datum" type="date" v-model="form.datum" required />
      </div>

      <div class="form-group">
        <label for="tid">Tid</label>

        <!-- ✅ Visar lediga tider när datum är valt -->
        <select id="tid" v-model="form.tid" :disabled="!form.datum" required>
          <option value="" disabled>
            {{ form.datum ? "Välj tid..." : "Välj datum först..." }}
          </option>

          <option v-for="t in availableTimes" :key="t" :value="t">
            {{ t }}
          </option>
        </select>

        <p v-if="form.datum && availableTimes.length === 0" class="no-times">
          Inga lediga tider för valt datum. Välj ett annat datum.
        </p>
      </div>

      <div class="form-group">
        <label for="service">Typ av tjänst</label>
        <select id="service" v-model="form.service" required>
          <option value="" disabled>Välj en service...</option>
          <option value="Däckbyte">Däckbyte</option>
          <option value="Hjulinställning">Hjulinställning</option>
          <option value="Reparation">Reparation</option>
          <option value="Service">Service</option>
          <option value="Övrigt">Övrigt</option>
        </select>
      </div>

      <div v-if="successMessage" class="message success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="message error">{{ errorMessage }}</div>

      <button type="submit" class="submit-btn">Skapa bokning</button>
    </form>
  </section>
</template>

<style scoped>
.header-container {
  text-align: center;
  margin-bottom: 2rem;
}

.booking-form {
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.no-times {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.message {
  text-align: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}

.success {
  background-color: #e9f5e9;
  color: #28a745;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>

