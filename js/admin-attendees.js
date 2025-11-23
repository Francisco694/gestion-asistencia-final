// =========================================================
// CARGA DE ASISTENTES REALES
// =========================================================

async function loadEventAttendees(eventId) {
    const tbody = document.getElementById('guestListBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr>
        <td colspan="3" class="py-4 text-center text-gray-400">
            <i class="fas fa-spinner fa-spin mr-2"></i> Cargando asistentes...
        </td>
    </tr>`;

    try {
        const attendeesSnap = await db
            .collection("events")
            .doc(eventId)
            .collection("attendees")
            .orderBy("timestamp", "desc")
            .get();

        // Si no hay asistentes:
        if (attendeesSnap.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" class="py-4 text-center text-gray-400 text-sm">
                        No hay asistentes registrados.
                    </td>
                </tr>`;
            return;
        }

        // Si hay asistentes, los mostramos:
        tbody.innerHTML = "";

        attendeesSnap.forEach(doc => {
            const attendee = doc.data();
            const name = attendee.name || "Anónimo";
            const email = attendee.email || "Sin email";
            const ticket = attendee.ticket || "N/A";

            tbody.innerHTML += `
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">${name}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">${email}</td>
                    <td class="px-4 py-3 text-right text-sm text-gray-600">${ticket}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando asistentes:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="py-4 text-center text-red-500 text-sm">
                    Error al cargar asistentes.
                </td>
            </tr>`;
    }
}
