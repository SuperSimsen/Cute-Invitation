const noBtn = document.getElementById("noBtn");
const yesBtn = document.querySelector(".yes-btn");

// --------------------
// Startposition
// --------------------

let x = window.innerWidth * 0.65;
let y = window.innerHeight * 0.50;

let vx = 0;
let vy = 0;

const margin = 20;
const safeRadius = 250;
const emergencyRadius = 100;
const maxSpeed = 35;

let stress = 0;

// --------------------
// Pointer tracking
// --------------------

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;

let lastPointerX = pointerX;
let lastPointerY = pointerY;

document.addEventListener("pointermove", (e) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
});

document.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        pointerX = e.touches[0].clientX;
        pointerY = e.touches[0].clientY;
    }
}, { passive: true });

// --------------------
// Knappen skal aldrig kunne trykkes
// --------------------

function emergencyJump() {

    const rect = noBtn.getBoundingClientRect();

    x = margin + Math.random() *
        (window.innerWidth - rect.width - margin * 2);

    y = margin + Math.random() *
        (window.innerHeight - rect.height - margin * 2);

    vx = 0;
    vy = 0;

    stress += 10;
}

noBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    emergencyJump();
});

noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    emergencyJump();
});

// --------------------
// Animation loop
// --------------------

function animate() {

    const rect = noBtn.getBoundingClientRect();

    const centerX = x + rect.width / 2;
    const centerY = y + rect.height / 2;

    let dx = centerX - pointerX;
    let dy = centerY - pointerY;

    const dist = Math.hypot(dx, dy);

    const pointerVX = pointerX - lastPointerX;
    const pointerVY = pointerY - lastPointerY;

    lastPointerX = pointerX;
    lastPointerY = pointerY;

    // --------------------
    // Emergency escape
    // --------------------

    if (dist < emergencyRadius) {
        emergencyJump();
    }

    // --------------------
    // Normal flugt
    // --------------------

    if (dist < safeRadius && dist > 0) {

        dx /= dist;
        dy /= dist;

        const force =
            Math.pow((safeRadius - dist) / safeRadius, 2);

        vx += dx * force * maxSpeed;
        vy += dy * force * maxSpeed;

        // Flygt også fra pointerens retning
        vx -= pointerVX * 0.5;
        vy -= pointerVY * 0.5;

        stress += force * 2;
    }

    // --------------------
    // Anti-corner system
    // --------------------

    if (x < 150) {
        vx += 3;
    }

    if (window.innerWidth - (x + rect.width) < 150) {
        vx -= 3;
    }

    if (y < 150) {
        vy += 3;
    }

    if (window.innerHeight - (y + rect.height) < 150) {
        vy -= 3;
    }

    // --------------------
    // Friction
    // --------------------

    vx *= 0.90;
    vy *= 0.90;

    // --------------------
    // Speed cap
    // --------------------

    const speed = Math.hypot(vx, vy);

    if (speed > maxSpeed) {

        vx = (vx / speed) * maxSpeed;
        vy = (vy / speed) * maxSpeed;
    }

    // --------------------
    // Position update
    // --------------------

    x += vx;
    y += vy;

    // Hold på skærmen
    x = Math.max(
        margin,
        Math.min(
            window.innerWidth - rect.width - margin,
            x
        )
    );

    y = Math.max(
        margin,
        Math.min(
            window.innerHeight - rect.height - margin,
            y
        )
    );

    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;

    // --------------------
    // JA-knap vokser
    // --------------------

    stress *= 0.985;

    const scale =
        1 + Math.min(stress * 0.03, 8);

    yesBtn.style.transform = `scale(${scale})`;

    requestAnimationFrame(animate);
}

// --------------------
// Initialisering
// --------------------

noBtn.style.position = "fixed";
noBtn.style.left = `${x}px`;
noBtn.style.top = `${y}px`;

animate();

// Sørg for korrekt placering ved resize
window.addEventListener("resize", () => {

    const rect = noBtn.getBoundingClientRect();

    x = Math.min(
        x,
        window.innerWidth - rect.width - margin
    );

    y = Math.min(
        y,
        window.innerHeight - rect.height - margin
    );
});