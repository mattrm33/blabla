// --- Data: Specific Models Requested ---
const PRODUCTS = [
    {
        id: 1,
        brand: 'nike',
        name: 'Phantom GX2',
        price: 80,
        img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600', // Red/Generic Nike Placeholder
        tag: 'Control'
    },
    {
        id: 2,
        brand: 'nike',
        name: 'Phantom GX3',
        price: 80,
        img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600', // Nike Placeholder
        tag: 'New'
    },
    {
        id: 3,
        brand: 'adidas',
        name: 'Predator Elite',
        price: 80,
        img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600', // Adidas Placeholder
        tag: 'Power'
    },
    {
        id: 4,
        brand: 'adidas',
        name: 'Copa Pure II',
        price: 80,
        img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=600', // Adidas Style
        tag: 'Touch'
    },
    {
        id: 5,
        brand: 'newbalance',
        name: 'Tekela',
        price: 80,
        img: 'https://images.unsplash.com/photo-1560769629-975e13f0c470?auto=format&fit=crop&q=80&w=600', // Generic Boot
        tag: 'Agility'
    }
];

// --- DOM Elements ---
const grid = document.getElementById('productsGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const yearSpan = document.getElementById('year');
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    yearSpan.textContent = new Date().getFullYear();
    renderProducts('all');
    setupObservers();
});

// --- Mobile Menu ---
menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans = menuBtn.querySelectorAll('span');
    if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.transform = 'none';
    }
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = menuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.transform = 'none';
    });
});

// --- Product Rendering & Filtering ---
function renderProducts(filter) {
    grid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.brand === filter);

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${index * 100}ms`; // Staggered animation
        
        card.innerHTML = `
            <div class="img-wrapper">
                <img src="${product.img}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-info">
                <span class="card-brand">${product.brand}</span>
                <h3 class="card-title">${product.name}</h3>
                <div class="card-footer">
                    <span class="price">${product.price}€</span>
                    <a href="#contact" class="add-btn" aria-label="Commander">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-trigger observer for new elements
    setTimeout(setupObservers, 50);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.brand);
    });
});

// --- Scroll Animations (Intersection Observer) ---
function setupObservers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Contact Form Handling ---
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Message Envoyé';
    btn.style.background = '#111'; // Keep it elegant
    
    setTimeout(() => {
        e.target.reset();
        btn.textContent = originalText;
    }, 3000);
});
