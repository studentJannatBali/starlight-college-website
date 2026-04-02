// Wait for page load
document.addEventListener("DOMContentLoaded", () => {

    // ================= CONTACT FORM =================
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.querySelector("#name")?.value.trim();
            const email = document.querySelector("#email")?.value.trim();
            const message = document.querySelector("#message")?.value.trim();

            if (!name || !email || !message) {
                return alert("⚠️ Please fill all fields");
            }

            if (!email.includes("@")) {
                return alert("❌ Invalid email");
            }

            const data = {
                id: Date.now(),
                name,
                email,
                message,
                date: new Date().toLocaleString(),
            };

            const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
            messages.push(data);
            localStorage.setItem("contactMessages", JSON.stringify(messages));

            alert("✅ Message saved!");
            contactForm.reset();
            displayMessageCount();
        });
    }

    function displayMessageCount() {
        const messages = JSON.parse(localStorage.getItem("contactMessages")) || [];
        const el = document.getElementById("messageCount");
        if (el) el.textContent = `📬 ${messages.length} messages`;
    }

    // ================= ADMISSION FORM =================
    const admissionForm = document.getElementById("admissionForm");

    if (admissionForm) {
        admissionForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("studentName")?.value.trim();
            const email = document.getElementById("studentEmail")?.value.trim();
            const course = document.getElementById("course")?.value;
            const phone = document.getElementById("phone")?.value.trim();
            const msg = document.getElementById("message")?.value.trim();

            if (!name || !email) {
                return alert("⚠️ Name & Email required");
            }

            if (!email.includes("@")) {
                return alert("❌ Invalid email");
            }

            const app = {
                id: Date.now(),
                name,
                email,
                course,
                phone,
                message: msg,
                date: new Date().toLocaleString(),
            };

            const apps = JSON.parse(localStorage.getItem("admissions")) || [];
            apps.push(app);
            localStorage.setItem("admissions", JSON.stringify(apps));

            alert("✅ Application submitted!");
            admissionForm.reset();
            updateApplicationCount();
        });
    }

    function updateApplicationCount() {
        const apps = JSON.parse(localStorage.getItem("admissions")) || [];
        const el = document.getElementById("appCount");
        if (el) el.textContent = apps.length;
    }

    // ================= EVENTS =================
    loadEvents();

    async function loadEvents() {
        try {
            const res = await fetch("events.json");
            const events = await res.json();

            const container = document.getElementById("eventsContainer");
            if (!container) return;

            container.innerHTML = "";

            events.forEach((event) => {
                const card = document.createElement("div");
                card.className = "eventCard";

                card.innerHTML = `
                    <h3>${event.title}</h3>
                    <p>📅 ${event.date}</p>
                    <p>${event.description}</p>
                    <button class="eventBtn">Register</button>
                `;

                container.appendChild(card);
            });

        } catch (err) {
            console.error("❌ Error loading events:", err);
        }
    }

    // ================= EVENT REGISTRATION =================
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("eventBtn")) {
            const title = e.target.parentElement.querySelector("h3").innerText;

            const regs = JSON.parse(localStorage.getItem("registrations")) || [];

            regs.push({
                event: title,
                date: new Date().toLocaleString(),
            });

            localStorage.setItem("registrations", JSON.stringify(regs));
            showToast(`✅ Registered for ${title}`);
        }
    });

    // ================= ADMIN PANEL =================
    const admin = document.createElement("div");

    admin.style = `
        position:fixed;
        bottom:80px;
        right:20px;
        width:260px;
        background:white;
        border:2px solid #ccc;
        padding:10px;
        display:none;
        z-index:999;
    `;

    admin.innerHTML = `
        <h5>📊 Data Manager</h5>
        <p id="stats"></p>
        <button id="view">View</button>
        <button id="clear">Clear</button>
        <button id="export">Export</button>
        <button id="close">Close</button>
    `;

    document.body.appendChild(admin);

    document.querySelector("footer")?.addEventListener("dblclick", () => {
        admin.style.display = admin.style.display === "none" ? "block" : "none";
        updateStats();
    });

    function updateStats() {
        const m = JSON.parse(localStorage.getItem("contactMessages")) || [];
        const a = JSON.parse(localStorage.getItem("admissions")) || [];
        const r = JSON.parse(localStorage.getItem("registrations")) || [];

        document.getElementById("stats").innerHTML = `
            Messages: ${m.length}<br>
            Applications: ${a.length}<br>
            Registrations: ${r.length}
        `;
    }

    document.getElementById("view").onclick = () => {
        console.table(localStorage);
        alert("Check console (F12)");
    };

    document.getElementById("clear").onclick = () => {
        localStorage.clear();
        alert("Data cleared");
        updateStats();
    };

    document.getElementById("export").onclick = () => {
        const data = {
            messages: JSON.parse(localStorage.getItem("contactMessages")) || [],
            admissions: JSON.parse(localStorage.getItem("admissions")) || [],
            registrations: JSON.parse(localStorage.getItem("registrations")) || []
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "college-data.json";
        link.click();
    };

    document.getElementById("close").onclick = () => {
        admin.style.display = "none";
    };

    // INIT
    displayMessageCount();
    updateApplicationCount();
});

// ================= SEARCH =================
function searchEvents() {
    const input = document.getElementById("search")?.value.toLowerCase();
    const cards = document.querySelectorAll(".eventCard");

    cards.forEach((card) => {
        card.style.display = card.innerText.toLowerCase().includes(input)
            ? "block"
            : "none";
    });
}

// ================= TOAST =================
function showToast(msg) {
    const toast = document.createElement("div");

    toast.innerText = msg;
    toast.style = `
        position:fixed;
        bottom:20px;
        right:20px;
        background:black;
        color:white;
        padding:10px;
        border-radius:5px;
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}