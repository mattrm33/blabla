// DONNÉES PRODUITS (Simulation)
const products = [
    {
        name: "Mercurial Vapor Elite",
        desc: "Vitesse explosive pour attaquants.",
        image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Predator Accuracy",
        desc: "Contrôle ultime du ballon.",
        image: "https://images.unsplash.com/photo-1511551203524-9a24350a5771?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Future Ultimate",
        desc: "Agilité et créativité sans limite.",
        image: "https://images.unsplash.com/photo-1579338908476-3a3a1d71a706?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "X Speedportal",
        desc: "Légèreté pour les ailiers rapides.",
        image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// CHARGEMENT DES PRODUITS DANS LE DOM
const productGrid = document.getElementById('product-grid');

products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    
    card.innerHTML = `
        <div class="img-container">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p style="font-size: 0.8rem; color: #888; margin-bottom: 10px;">${product.desc}</p>
            <p class="product-price">Prix : à définir</p>
            <button class="btn-add">Ajouter au panier</button>
        </div>
    `;
    
    productGrid.appendChild(card);
});

// ANIMATION AU SCROLL (Intersection Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.fade-in-scroll');
// Ajouter la classe css pour cacher initialement
document.querySelectorAll('.about-text, .about-image, .product-card').forEach((el) => {
    el.classList.add('hidden');
    observer.observe(el);
});

// EFFET COMPTEUR PANIER
const btns = document.querySelectorAll('.btn-add');
const cartCount = document.querySelector('.cart-count');
let count = 0;

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        count++;
        cartCount.textContent = count;
        
        // Animation simple du bouton
        btn.textContent = "Ajouté !";
        btn.style.backgroundColor = "#CCFF00";
        btn.style.color = "black";
        
        setTimeout(() => {
            btn.textContent = "AJOUTER AU PANIER";
            btn.style.backgroundColor = "transparent";
            btn.style.color = "initial";
        }, 2000);
    });
});
