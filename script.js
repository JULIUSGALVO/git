// Kapag nag-load yung page, papalitan niya ang kulay ng <h1> at maglalagay ng alert
document.addEventListener("DOMContentLoaded", function () {
    const heading1 = document.querySelector("h1");
    const heading2 = document.querySelector("h2");

    // Baguhin ang kulay ng h1
    heading1.style.color = "blue";

    // Dagdag ng text sa h2
    heading2.textContent += " 😎";

    // Mag alert para makita natin gumagana
    alert("Hello! Gumagana ang JavaScript mo 🚀");
});
