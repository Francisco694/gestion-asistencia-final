// =====================================================
// event-register.js – Registro real de asistentes
// =====================================================

document.addEventListener("DOMContentLoaded", async () => {

    // 1. Obtener eventId desde URL
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");

    if (!eventId) {
        alert("Error: no se recibió el ID del evento.");
        return;
    }

    console.log("Inscribiendo en evento:", eventId);

    // 2. Cargar info del evento
    try {
        const doc = await db.collection("events").doc(eventId).get();
        if (!doc.exists) {
            alert("El evento no existe.");
            return;
        }

        const ev = doc.data();
        document.getElementById("display-event-name").textContent = ev.name;
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar el evento.");
    }

    // 3. Manejar envío de formulario
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener datos
        const guestName = form.querySelector("input[placeholder='Ej: María']").value;
        const guestLast = form.querySelector("input[placeholder='Ej: González']").value;
        const guestEmail = form.querySelector("input[type='email']").value;
        const guestPhone = form.querySelector("input[type='tel']").value;

        const data = {
            name: guestName,
            lastName: guestLast,
            email: guestEmail.trim().toLowerCase(),
            phone: guestPhone,
        };

        try {
            await enrollInEventDB(eventId, data);

            alert("¡Inscripción exitosa! Te hemos enviado tu entrada.");
            window.location.href = "index.html";
        } catch (e) {
            console.error("ERROR:", e);
            alert("No se pudo completar la inscripción.");
        }
    });

});
