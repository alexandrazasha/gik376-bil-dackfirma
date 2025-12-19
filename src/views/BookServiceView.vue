<script setup>
import { reactive, ref } from 'vue';
import { addBooking } from '../services/bookingService.js'; // Importerar funktionen för att lägga till bokning

// Ett reaktivt objekt för att hålla all formulärdata
const form = reactive({
  kundNamn: "",
  regNr: "",
  datum: "",
  service: ""
});

// Reaktiva variabler för att visa meddelanden till användaren efter submit
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = () => {
  // Enkel validering för att se till att alla fält är ifyllda
  if (!form.kundNamn || !form.regNr || !form.datum || !form.service) {
    errorMessage.value = 'Alla fält måste fyllas i.';
    successMessage.value = '';
    return;
  }

  // Anropa service-funktionen för att lägga till bokningen
  addBooking({ ...form });

  // Visa framgångsmeddelande och rensa formuläret
  successMessage.value = `Bokning för ${form.kundNamn} har registrerats!`;
  errorMessage.value = '';
  
  // Återställer formuläret så att det blir tomt igen
  Object.keys(form).forEach(key => form[key] = "");

  // Valfritt: Dölj meddelandet efter några sekunder
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
</script>

<template>
  <section>
    <div class="header-container">
      <h1>Boka Service</h1>
      <p>Fyll i formuläret nedan för att boka en ny servicetid.</p>
    </div>

    <!-- Formulär som anropar handleSubmit när det skickas -->
    <form @submit.prevent="handleSubmit" class="booking-form">
      <div class="form-group">
        <label for="kundNamn">Kundens namn</label>
        <input id="kundNamn" type="text" v-model="form.kundNamn" placeholder="T.ex. Karolina Berg" required>
      </div>

      <div class="form-group">
        <label for="regNr">Registreringsnummer</label>
        <input id="regNr" type="text" v-model="form.regNr" placeholder="T.ex. ABC 123" required>
      </div>

      <div class="form-group">
        <label for="service">Typ av service</label>
        <select id="service" v-model="form.service" required>
          <option value="" disabled>Välj en service...</option>
          <option value="Däckbyte">Däckbyte</option>
          <option value="Hjulinställning">Hjulinställning</option>
          <option value="Reparation">Reparation</option>
          <option value="Övrigt">Övrigt</option>
        </select>
      </div>

      <div class="form-group">
        <label for="datum">Önskat datum</label>
        <input id="datum" type="date" v-model="form.datum" required>
      </div>

      <!-- Meddelanden som visas villkorligt (med v-if) -->
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
