

import { ref } from 'vue';
import initialBookings from '../assets/bookings.json'; 

// Nyckelnamnet för lagring i webbläsaren
const STORAGE_KEY = 'bilfirma_bookings'

// Hämtar data och kollar om det finns sparat i webbläsaren, annars använd JSON-filen
const savedBookings = localStorage.getItem(STORAGE_KEY);
const bookings = ref(savedBookings ? JSON.parse(savedBookings) : initialBookings);

/**
 * funktion för att spara nuvarande information till localStorage
 */
function simulateSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value));
    console.log("Bokningsdatan har uppdaterats och sparats i webbläsaren!");
}

// --- De olika funktionerna (crud-delen) 


/**
 * Visar listan av bokningar.
 */
export function getBookings() {
    return bookings;
}

/**
 * Lägg till bokning (Create)
 */
export function addBooking(newBookingData) {
    const newId = Date.now();
    
    const newBooking = { 
        id: newId, 
        status: 'bokad', 
        ...newBookingData 
    };

    bookings.value.push(newBooking);
    simulateSave();
}

/**
 * Uppdatera bokning (Update)
 */
export function updateBooking(id, updatedFields) {
    const index = bookings.value.findIndex(b => b.id === id);

    if (index !== -1) {
        bookings.value[index] = { ...bookings.value[index], ...updatedFields };
        simulateSave();
        return true;
    }
    return false;
}

/**
 * Markera bokning som pågående
 */
export function startBooking(id) {
    updateBooking(id, { 
        status: 'pågående' 
    });
}

/**
 * Ta bort bokning (Delete)
 */
export function deleteBooking(id) {
    bookings.value = bookings.value.filter(b => b.id !== id);
    simulateSave();
}

/**
 * Markera bokning som avslutad 
 */
export function completeBooking(id, performedAction) {
    updateBooking(id, { 
        status: 'avslutad', 
        performedAction: performedAction,
        dateCompleted: new Date().toISOString()
    });
}

const getServiceInfo = (serviceName) => {
  // Vi letar i objektet ovan, annars returnerar vi en standardtext
  return serviceDescriptions[serviceName] || 'Information om denna tjänst fås vid inlämning av fordonet.'
}