import { ref } from "vue"

// Nyckelnamnet för lagring i webbläsaren
const STORAGE_KEY = "bilfirma_bookings"

// Reaktiv lista som används i vyerna
const bookings = ref([])

/**
 * Initierar bokningar:
 * 1. Läser från localStorage om det finns
 * 2. Annars laddas från public/bookings.json
 */
async function initBookings() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    bookings.value = JSON.parse(saved)
    return
  }

  try {
    const res = await fetch("/bookings.json")
    if (!res.ok) throw new Error("Kunde inte ladda bookings.json")

    bookings.value = await res.json()

    // Spara initial data lokalt för vidare arbete
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value))
  } catch (error) {
    console.error(error)
    bookings.value = []
  }
}

// Kör direkt när filen laddas
initBookings()

/**
 * Sparar aktuell bokningsdata (simulerat backend-sparande)
 */
function simulateSave() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value))
  console.log("Bokningsdatan har sparats")
}

/**
 * Hämtar bokningar (används i vyerna)
 */
export function getBookings() {
  return bookings
}

/**
 * Skapa ny bokning
 */
export function addBooking(newBookingData) {
  const newBooking = {
    id: Date.now(),
    status: "bokad",
    ...newBookingData
  }

  bookings.value.push(newBooking)
  simulateSave()
}

/**
 * Uppdatera befintlig bokning
 */
export function updateBooking(id, updatedFields) {
  const index = bookings.value.findIndex((b) => b.id === id)

  if (index !== -1) {
    bookings.value[index] = {
      ...bookings.value[index],
      ...updatedFields
    }
    simulateSave()
    return true
  }
  return false
}

/**
 * Markera bokning som pågående
 */
export function startBooking(id) {
  updateBooking(id, { status: "pågående" })
}

/**
 * Ta bort bokning
 */
export function deleteBooking(id) {
  bookings.value = bookings.value.filter((b) => b.id !== id)
  simulateSave()
}

/**
 * Markera bokning som avslutad
 */
export function completeBooking(id, performedAction) {
  updateBooking(id, {
    status: "avslutad",
    performedAction,
    dateCompleted: new Date().toISOString()
  })
}
