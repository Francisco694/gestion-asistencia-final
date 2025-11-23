// =====================================================
// db.js — VERSIÓN COMPLETA, DEPURADA Y CORREGIDA
// =====================================================

// ------------------------------------------
// 1. INICIALIZAR FIREBASE
// ------------------------------------------

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();

// Fix para conexiones lentas
try {
    db.settings({ experimentalForceLongPolling: true, merge: true });
} catch (e) {
    console.warn("No se pudo aplicar longPolling:", e);
}

// Persistencia offline
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
    console.warn("Persistencia offline desactivada:", err.code);
});

// Helper timeout
const withTimeout = (promise, ms = 8000) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Tiempo de espera (${ms}ms)`)), ms)
    );
    return Promise.race([promise, timeout]);
};

console.log("DB Conectada:", firebaseConfig.projectId);


// =====================================================
// 2. AUTENTICACIÓN
// =====================================================

// Crear usuario
async function registerUserDB(email, password, name, role = "organizer") {
    try {
        const cleanEmail = email.trim().toLowerCase();
        const userCredential = await withTimeout(
            auth.createUserWithEmailAndPassword(cleanEmail, password)
        );

        const user = userCredential.user;

        await db.collection("users")
            .doc(user.uid)
            .set({
                name,
                email: cleanEmail,
                role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

        return user;

    } catch (error) {
        console.error("Error registro:", error);
        throw error;
    }
}

// Login
async function loginUserDB(email, password) {
    try {
        const cleanEmail = email.trim().toLowerCase();
        const userCredential = await auth.signInWithEmailAndPassword(cleanEmail, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error login:", error);
        throw error;
    }
}

// Logout
function logoutUserDB() {
    return auth.signOut();
}

// Obtener rol
async function getUserRole(uid) {
    try {
        const doc = await db.collection("users").doc(uid).get();
        return doc.exists ? doc.data().role : "organizer";
    } catch (error) {
        console.warn("No se pudo obtener el rol:", error);
        return "organizer";
    }
}

// Buscar usuario por correo
async function getUserByEmailDB(email) {
    try {
        const cleanEmail = email.trim().toLowerCase();
        const snap = await db
            .collection("users")
            .where("email", "==", cleanEmail)
            .limit(1)
            .get();

        if (snap.empty) return null;

        const doc = snap.docs[0];
        return { id: doc.id, ...doc.data() };

    } catch (e) {
        console.error("Error buscando usuario:", e);
        return null;
    }
}

// Obtener todos los usuarios
async function getAllUsersDB() {
    const snap = await db.collection("users").get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Eliminar usuario
function deleteUserDB(userId) {
    return db.collection("users").doc(userId).delete();
}



// =====================================================
// 3. EVENTOS
// =====================================================

// Crear evento
async function createEventDB(eventData) {
    const user = auth.currentUser;

    let finalOrganizerId = eventData.organizerId || (user?.uid ?? null);
    let finalOrganizerEmail = eventData.organizerEmail || (user?.email ?? null);

    if (!finalOrganizerId || !finalOrganizerEmail) {
        throw new Error("No hay organizador asignado.");
    }

    try {
        const docRef = await db.collection("events").add({
            ...eventData,
            organizerId: finalOrganizerId,
            organizerEmail: finalOrganizerEmail,
            status: "pending",
            enrolledCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        return docRef.id;

    } catch (e) {
        console.error("Error creando evento:", e);
        throw e;
    }
}

// Obtener eventos
async function getEventsDB(filters = {}) {
    try {
        let query = db.collection("events");

        if (filters.status) query = query.where("status", "==", filters.status);
        if (filters.organizerId) query = query.where("organizerId", "==", filters.organizerId);

        const snap = await query.get();
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (e) {
        console.error("Error obteniendo eventos:", e);
        return [];
    }
}

// Actualizar estado
function updateEventStatusDB(eventId, newStatus) {
    return db.collection("events").doc(eventId).update({
        status: newStatus,
    });
}

// Obtener eventos por email
async function getEventsByEmail(email) {
    try {
        const snap = await db
            .collection("events")
            .where("organizerEmail", "==", email)
            .orderBy("createdAt", "desc")
            .get();

        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (e) {
        console.error("Error eventos por email:", e);
        return [];
    }
}



// =====================================================
// 4. INSCRIPCIONES (GUESTS)
// =====================================================

// Inscribir usuario a un evento
async function enrollInEventDB(eventId, userData) {
    const batch = db.batch();

    const eventRef = db.collection("events").doc(eventId);
    const guestRef = eventRef.collection("guests").doc(); // ← colección correcta

    batch.set(guestRef, {
        ...userData,
        ticket: "T-" + Math.floor(Math.random() * 999999),
        enrolledAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.update(eventRef, {
        enrolledCount: firebase.firestore.FieldValue.increment(1),
    });

    await batch.commit();
}

// Obtener invitados reales
async function getEventGuestsDB(eventId) {
    try {
        const snap = await db
            .collection("events")
            .doc(eventId)
            .collection("guests")  // ← lectura correcta
            .orderBy("enrolledAt", "desc")
            .get();

        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (e) {
        console.error("Error obteniendo invitados:", e);
        return [];
    }
}
