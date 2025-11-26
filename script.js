// --- Données Produits ---
const productsData = [
    {
        id: 1,
        brand: 'nike',
        name: 'Mercurial Superfly 9',
        img: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f153a5c2-6782-4547-88f5-467272895690/chaussure-de-foot-a-crampons-basse-pour-terrain-sec-phantom-gx-elite-Fh4q0w.png'
    },
    {
        id: 2,
        brand: 'adidas',
        name: 'Predator Accuracy+',
        img: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/20888913b77242d59163af600100d04e_9366/Chaussure_Predator_Accuracy_Terrain_souple_Noir_GW4569_22_model.jpg'
    },
    {
        id: 3,
        brand: 'puma',
        name: 'Future Ultimate',
        img: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107355/01/sv01/fnd/EEA/fmt/png/Chaussures-de-football-FUTURE-ULTIMATE-FG/AG'
    },
    {
        id: 4,
        brand: 'nike',
        name: 'Phantom GX Elite',
        img: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/31d6006c-8244-4632-9a3c-a98816c11d2e/chaussure-de-foot-a-crampons-pour-terrain-sec-tiempo-legend-10-elite-0PGQj9.png'
    },
    {
        id: 5,
        brand: 'adidas',
        name: 'X Crazyfast.1',
        img: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/61f8696b610344f69188af5f00e98583_9366/Chaussure_X_Crazyfast.1_Terrain_souple_Blanc_HQ4516_22_model.jpg'
    },
    {
        id: 6,
        brand: 'puma',
        name: 'Ultra Ultimate',
        img: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107744/01/sv01/fnd/EEA/fmt/png/Chaussures-de-football-ULTRA-ULTIMATE-FG/AG'
    }
];

// Fallback image si erreur
const FALLBACK_IMG = "https://placehold.co/400x400/f4f4f4/111?text=No+Image";

// --- DOM Elements ---
const mainGrid = document.getElementById('mainGrid');
const sliderContainer = document.getElementById('productSlider');
const filterBtns = document.querySelectorAll('.filter-btn');

// --- Functions ---

// 1. Création d'une carte produit HTML
function createCard(product) {
    return `
        <div class="product-card reveal">
            <div class="card-image">
                <img src="${product.img}" alt="${product.name}" onerror="this.src='${FALLBACK_IMG}'">
            </div>
            <div class="card-info">
                <span class="card-brand">${product.brand}</span>
                <h3>${product.name}</h3>
                <span class="card-price">Prix : à définir</span>
            </div>
        </div>
    `;
}

// 2. Rendu de la grille principale
function renderGrid(filter = 'all') {
    mainGrid.innerHTML = '';
    const filtered = filter === 'all' 
        ? productsData 
        : productsData.filter(p => p.brand === filter);
        
    filtered.forEach(p => {
        mainGrid.innerHTML += createCard(p);
    });
    
    // Réinitialiser les animations pour les nouveaux éléments
    setTimeout(observeElements, 100);
}

// 3. Rendu du Slider (On prend juste 4 produits aléatoires pour l'exemple)
function renderSlider() {
    const featured = productsData.slice(0, 5);
    featured.forEach(p => {
        const slide = document.createElement('div');
        slide.innerHTML = createCard(p);
        // On enlève la classe reveal pour le slider pour éviter des bugs d'affichage
        slide.firstElementChild.classList.remove('reveal'); 
        sliderContainer.appendChild(slide.firstElementChild);
    });
}

// --- Event Listeners ---

// Filtres
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        mainGrid.style.opacity = '0'; // Petit effet de fondu
        setTimeout(() => {
            renderGrid(btn.dataset.filter);
            mainGrid.style.opacity = '1';
        }, 300);
    });
});

// Slider Controls
document.getElementById('slideLeft').addEventListener('click', () => {
    sliderContainer.scrollBy({ left: -300, behavior: 'smooth' });
});
document.getElementById('slideRight').addEventListener('click', () => {
    sliderContainer.scrollBy({ left: 300, behavior: 'smooth' });
});

// Mobile Menu
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu-overlay');
const menuLinks = document.querySelectorAll('.mobile-menu-overlay a');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    // Animation burger simple
    const lines = menuBtn.querySelectorAll('.line');
    if(mobileMenu.classList.contains('active')){
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const lines = menuBtn.querySelectorAll('.line');
        lines[0].style.transform = 'none';
        lines[1].style.transform = 'none';
    });
});

// --- Intersection Observer (Animations au scroll) ---
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
    renderSlider();
    observeElements();
});
