<script setup>
import services from '../assets/services.json'
</script>

<template>
  <div class="page-container">
    <div class="about-us-box">
      <h1>Om Oss</h1>
      <p>
        Bil & Däckservice är din pålitliga partner för allt som rör din bil. Med
        mångårig erfarenhet i branschen erbjuder vi personlig service och
        högkvalitativt arbete. Vårt team av certifierade mekaniker är här för
        att se till att ditt fordon är säkert och i toppskick.
      </p>
      <p>
        Vi strävar efter att alltid ge våra kunder bästa möjliga service till
        konkurrenskraftiga priser. Välkommen in till oss!
      </p>

      <h2>Prislista</h2>
      <ul class="price-list">
        <li v-for="service in services" :key="service.name">
          <strong>{{ service.name }}:</strong> {{ service.price }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about-us-box {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.about-us-box h1,
.about-us-box h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.price-list {
  list-style: none;
  padding: 0;
}
.price-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}
.price-list li:last-child {
  border-bottom: none;
}
</style>
