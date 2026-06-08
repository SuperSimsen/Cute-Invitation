/* =========================
   INDEX.HTML LOGIK
========================= */

const input_number1 = document.getElementById('input_number1');
const loading_screen = document.getElementById('loading_screen');
const loading_text = document.getElementById('loading_text');

if (input_number1 && loading_screen) {

  input_number1.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    // Vis loading UI
    loading_screen.classList.remove('skjult');

    if (loading_text) {
      loading_text.textContent = "Evaluerer ansøgning...";
    }

    // vigtigt: giv browser tid til at opdatere UI før navigation
    setTimeout(() => {
      sessionStorage.setItem("approved", "true");
      window.location.href = "planner.html";
    }, 700);
  });
}


/* =========================
   PLANNER.HTML LOGIK
========================= */

console.log("PLANNER LOADED");
console.log("approved =", sessionStorage.getItem("approved"));

const top_bar = document.getElementById("top_bar");

if (top_bar) {

  window.addEventListener("DOMContentLoaded", () => {

    const approved = sessionStorage.getItem("approved");

    if (approved === "true") {

      // fjern skjult først (ellers blokkerer display)
      top_bar.classList.remove("skjult");

      // trig animation sikkert
      requestAnimationFrame(() => {
        top_bar.classList.add("show");
      });

      // ryd state så det ikke gentager
      sessionStorage.removeItem("approved");
    }
  });
}