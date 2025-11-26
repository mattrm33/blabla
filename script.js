// --- Configuration ---
const PRODUCTS = [
    {
        id: 'nike-gx2',
        brand: 'nike',
        name: 'Phantom GX2 Elite',
        price: 260,
        // Using placeholder API for demo purposes. Replace with your real image URLs.
        img: 'https://placehold.co/600x600/f5f5f5/111?text=Nike+Phantom',
        desc: 'Gripknit pour un toucher exceptionnel.'
    },
    {
        id: 'nike-merc',
        brand: 'nike',
        name: 'Mercurial Vapor 15',
        price: 250,
        img: 'https://placehold.co/600x600/f5f5f5/111?text=Nike+Mercurial',
        desc: 'Vitesse explosive.'
    },
    {
        id: 'adi-pred',
        brand: 'adidas',
        name: 'Predator Elite',
        price: 240,
        img: 'https://placehold.co/600x600/f5f5f5/111?text=Adidas+Predator',
        desc: 'Retour de la languette repliée.'
    },
    {
        id: 'adi-x',
        brand: 'adidas',
        name: 'X Crazyfast',
        price: 230,
        img: 'https://placehold.co/600x600/f5f5f5/111?text=Adidas+X',
        desc: 'Légèreté ultime.'
    },
    {
        id: 'nb-tek',
        brand: 'newbalance',
        name: 'Tekela V4',
        price: 220,
        img: 'https://placehold.co/600x600/f5f5f5/111?text=NB+Tekela',
        desc: 'Confort sans lacets.'
    },
];

// --- DOM Elements ---
const grid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
const yearSpan = document.getElementById('year');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    yearSpan.textContent = new Date().getFullYear();
    renderProducts('all');
    setupObservers();
});

// --- Product Rendering ---
function renderProducts(brandFilter) {
    grid.innerHTML = ''; // Clear grid
    
    const filtered = brandFilter === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.brand === brandFilter);

    // Add small animation delay for staggered look
    filtered.forEach((p, index) => {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${index * 50}ms`;
        
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-details">
                <span class="brand-tag">${p.brand}</span>
                <h3>${p.name}</h3>
                <div class="price-row">
                    <span class="price">${p.price}€</span>
                    <button class="buy-btn" onclick="orderViaInstagram('${p.name}', ${p.price})">
                        Commander
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-trigger observer for new elements
    setTimeout(setupObservers, 100);
}

// --- Event Listeners ---

// Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Simple fade out effect before rendering new
        grid.style.opacity = '0';
        setTimeout(() => {
            renderProducts(btn.dataset.brand);
            grid.style.opacity = '1';
        }, 200);
    });
});

// Mobile Menu
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    // Animate hamburger lines
    const spans = menuBtn.querySelectorAll('span');
    if(navLinks.classList.contains('mobile-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.transform = 'none';
    }
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

// --- Logic: Order via Instagram ---
window.orderViaInstagram = function(name, price) {
    const msg = `Bonjour Crampons Direct 👋\nJe suis intéressé par : ${name} (${price}€).\nEst-ce disponible en taille [MA TAILLE] ?`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(msg).then(() => {
        alert('Message copié ! Vous allez être redirigé vers Instagram. Collez simplement le message.');
        window.open('https://www.instagram.com/cramponsdirect/', '_blank');
    }).catch(() => {
        // Fallback if clipboard fails
        window.open('https://www.instagram.com/cramponsdirect/', '_blank');
    });
};

// --- Animations (Intersection Observer) ---
function setupObservers() {
    const observerOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Contact Form Handler (Visual feedback only)
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Message Envoyé !';
    btn.style.background = '#4CAF50'; // Green success
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});
