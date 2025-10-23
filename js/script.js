// ===== Mobile drawer =====
const sidebar = document.querySelector('.sidebar');
// grab the sidebar element so later we can show/hide it
function showSidebar() {
    // Show the sidebar (mobile menu)
    sidebar.classList.add('show');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function hideSidebar() {
    // Hide the sidebar (mobile menu)
    sidebar.classList.remove('show');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ===== Smooth scroll with fixed-nav offset =====
const NAV_HEIGHT = 76;
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ===== Simple tab logic =====
const tabLinks = document.getElementsByClassName('tab-links');
const tabContents = document.getElementsByClassName('tab-contents');

function openTab(event, tabId) {
    Array.from(tabLinks).forEach((el) => el.classList.remove('active-link'));
    Array.from(tabContents).forEach((el) => el.classList.remove('active-tab'));
    event.currentTarget.classList.add('active-link');
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active-tab');
}

// Expose to inline HTML handler
window.openTab = openTab;
window.showSidebar = showSidebar;
window.hideSidebar = hideSidebar;

// === Personalized Greeting ===
const greetingText = document.getElementById('greetingText');
const nameInput = document.getElementById('nameInput');
const nameForm = document.getElementById('nameForm');
const clearName = document.getElementById('clearName');

// Function to show the greeting based on the time of the day
function updateGreeting() {
    const hour = new Date().getHours();
    const partOfDay = hour < 12 ? "Good Morning": hour < 18 ?"Good Afternoon": "Good Evening";
    const savedName = localStorage.getItem("visitorName") || "";
    greetingText.textContent = savedName
        ? `${partOfDay}, ${savedName}!`
        : `${partOfDay}!`;
    greetingText.classList.remove("fade-in");
    void greetingText.offsetWidth; // forces reflow (restarts animation)
    greetingText.classList.add("fade-in");
}

// When user saves their name
nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem("visitorName", name);
        updateGreeting();
    }
});

// When user clears their name
clearName.addEventListener("click", () => {
    localStorage.removeItem("visitorName");
    nameInput.value = "";
    updateGreeting();
});

// Run greeting on page load
updateGreeting();

// Sort By Date
document.getElementById("sortBtn").addEventListener("click", function () {
    const grid = document.getElementById("projectsGrid");
    const projects = Array.from(grid.children);

    // Sort by descending date (newest first)
    projects.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));

    // Re-append in new order
    projects.forEach((project) => grid.appendChild(project));
});

// Contact Form Handling
const contactForm = document.getElementById("contactForm");
const statusMsg = contactForm.querySelector(".form-status");

contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    statusMsg.textContent = "";

    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();

    // Simple validation
    if (!name || !email || !message) {
        statusMsg.textContent = "Please fill out all fields.";
        statusMsg.style.color = "#ff6b6b";
        return;
    }

    // Email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        statusMsg.textContent = "Please enter a valid email address.";
        statusMsg.style.color = "#ff6b6b";
        return;
    }

    // Simulate data handling (store locally)
    try {
        const submissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]");
        submissions.push({ name, email, message, time: new Date().toISOString() });
        localStorage.setItem("contactSubmissions", JSON.stringify(submissions));

        statusMsg.textContent = "Thank you! Your message has been sent.";
        statusMsg.style.color = "#6bff91";
        contactForm.reset();
    } catch (error) {
        statusMsg.textContent = "Something went wrong. Please try again later.";
        statusMsg.style.color = "#ff6b6b";
    }
});
