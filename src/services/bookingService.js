import { ref } from 'vue';
import initialBookings from '../assets/bookings.json'; 

// Nyckelnamnet för lagring i webbläsaren
const STORAGE_KEY = 'bilfirma_bookings'

// Kollar om det finns data i webbläsarens localStorage. Om inte, använd vår JSON-fil.
const savedBookings = localStorage.getItem(STORAGE_KEY);
const bookings = ref(savedBookings ? JSON.parse(savedBookings) : initialBookings);

/**
 * Funktion för att spara den aktuella listan med bokningar till localStorage.
 * Detta simulerar en databas och gör att ändringar finns kvar om man laddar om sidan.
 */
function simulateSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value));
    console.log("Bokningsdatan har uppdaterats och sparats i webbläsaren!");
}

// --- Funktioner för att hantera bokningar (CRUD: Create, Read, Update, Delete) ---

/**
 * Hämtar den reaktiva listan med alla bokningar.
 */
export function getBookings() {
    return bookings;
}

/**
 * Lägger till en ny bokning i listan.
 */
export function addBooking(newBookingData) {
    // Skapar ett unikt ID baserat på aktuell tid
    const newId = Date.now();
    
    // Skapar det nya bokningsobjektet med standardstatus 'bokad'
    const newBooking = { 
        id: newId, 
        status: 'bokad', 
        ...newBookingData 
    };

    // Lägger till den nya bokningen i listan och sparar
    bookings.value.push(newBooking);
    simulateSave();
}

/**
 * Uppdaterar en befintlig bokning med ny data.
 */
export function updateBooking(id, updatedFields) {
    // Hittar bokningens position i listan via dess id
    const index = bookings.value.findIndex(b => b.id === id);

    // Om bokningen hittas, uppdatera den
    if (index !== -1) {
        bookings.value[index] = { ...bookings.value[index], ...updatedFields };
        simulateSave();
        return true;
    }
    return false;
}

/**
 * Ändrar status på en bokning till 'pågående'.
 */
export function startBooking(id) {
    updateBooking(id, { 
        status: 'pågående' 
    });
}

/**
 * Tar bort en bokning från listan baserat på id.
 */
export function deleteBooking(id) {
    bookings.value = bookings.value.filter(b => b.id !== id);
    simulateSave();
}

/**
 * Markerar en bokning som 'avslutad' och sparar info om vad som gjorts.
 */
export function completeBooking(id, performedAction) {
    updateBooking(id, { 
        status: 'avslutad', 
        performedAction: performedAction,
        dateCompleted: new Date().toISOString() // Sparar datum och tid när den avslutades
    });
}