/**
 * Crampons Direct - Main Application Logic
 * Author: Web Dev
 */

// --- Data Configuration ---
const PRODUCTS = [
    {
        id: 'nike-phantom-gx2',
        name: 'Nike Phantom GX2',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Precision meets agility. Designed for the playmaker.'
    },
    {
        id: 'nike-phantom-gx3',
        name: 'Nike Phantom GX3',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'The next evolution of control.'
    },
    {
        id: 'nike-mercurial-gx3',
        name: 'Nike Mercurial GX3 Elite',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Explosive speed for the fastest players on the pitch.'
    },
    {
        id: 'nike-phantom-luna',
        name: 'Nike Phantom Luna Elite',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Anatomically designed for female athletes, perfect for all.'
    },
    {
        id: 'adidas-predator',
        name: 'Adidas Predator Elite',
        brand: 'adidas',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Legendary touch. Goal scoring machine.'
    },
    {
        id: 'adidas-copa',
        name: 'Adidas Copa Pure II',
        brand: 'adidas',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Pure leather touch for the purist.'
    },
    {
        id: 'nb-tekela',
        name: 'New Balance Tekela',
        brand: 'newbalance',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Amplify your senses. Unrivaled control.'
    },
    // Special Video Products
    {
        id: 'adidas-f50-showcase',
        name: 'Adidas F50',
        brand: 'adidas',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Return of the speed icon. Watch the showcase.',
        videos: ['7574545441858129174'] 
    },
    {
        id: 'nike-mercurial-showcase',
        name: 'Nike Mercurial',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'The definition of fast. Watch the showcase.',
        videos: ['7574545441858129174', '7574185891049131286']
    },
    {
        id: 'nike-phantom-showcase',
        name: 'Nike Phantom',
        brand: 'nike',
        price: 80,
        img: 'https://i.imgur.com/placeholder.jpg', // REPLACE WITH IMGUR LINK
        desc: 'Phantom precision on display.',
        videos: ['7574151020847140118']
    }
];

// --- App Controller ---
const app = {
    root: document.getElementById('app-root'),
    
    init: function() {
        this.navigate('home');
        this.setupListeners();
    },

    // Simple Router
    navigate: function(page) {
        window.scrollTo(0, 0);
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');

        if (page === 'home') {
            this.renderHome();
        } else if (page === 'products') {
            this.renderProductsPage('all');
        } else if (page === 'socks') {
            this.renderSocks();
        } else if (page === 'about') {
            this.renderAbout();
        }
    },

    // Toggle Mobile Menu
    toggleMenu: function() {
        document.querySelector('.nav-links').classList.toggle('active');
    },

    // Render Views
    renderHome: function() {
        this.root.innerHTML = `
            <section class="hero">
                <div class="hero-content">
                    <h1 class="text-blue">DOMINATE <br> <span class="text-red">THE PITCH</span></h1>
                    <p class="hero-sub">Elite Football Boots & Custom Anti-Slip Socks.</p>
                    <button class="btn btn-primary" onclick="app.navigate('products')">Shop Collection</button>
                </div>
            </section>
            <section class="container products-section">
                <h2>Featured Arrivals</h2>
                <div class="product-grid" id="home-grid"></div>
                <div style="text-align:center; margin-top:40px;">
                    <button class="btn btn-outline" onclick="app.navigate('products')">View All</button>
                </div>
            </section>
        `;
        // Render top 4 products
        this.renderGrid(PRODUCTS.slice(0, 4), 'home-grid');
    },

    renderProductsPage: function(filter = 'all') {
        this.root.innerHTML = `
            <section class="container products-section">
                <h2 class="text-blue">Elite Footwear</h2>
                <div class="filters">
                    <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="app.filterProducts('all')">All Brands</button>
                    <button class="filter-btn ${filter === 'nike' ? 'active' : ''}" onclick="app.filterProducts('nike')">Nike</button>
                    <button class="filter-btn ${filter === 'adidas' ? 'active' : ''}" onclick="app.filterProducts('adidas')">Adidas</button>
                    <button class="filter-btn ${filter === 'newbalance' ? 'active' : ''}" onclick="app.filterProducts('newbalance')">New Balance</button>
                </div>
                <div class="product-grid" id="main-grid"></div>
            </section>
        `;
        
        const filtered = filter === 'all' 
            ? PRODUCTS 
            : PRODUCTS.filter(p => p.brand === filter);
            
        this.renderGrid(filtered, 'main-grid');
    },

    renderSocks: function() {
        this.root.innerHTML = `
            <section class="container socks-section">
                <h2 class="text-blue">Custom Anti-Slip Socks</h2>
                <div class="socks-hero">
                    <div class="socks-visual">
                        <!-- Placeholder for Socks Image -->
                        <img src="https://via.placeholder.com/400x300/0a2558/ffffff?text=Custom+Socks" alt="Custom Socks">
                    </div>
                    <div class="socks-text">
                        <h3 class="text-red">Your Club. Your Colors.</h3>
                        <p style="margin-top:10px; color: #666;">
                            Professional grade anti-slip technology meets complete customization. 
                            Prevent blisters, improve grip, and represent your team.
                        </p>
                        <ul class="feature-list">
                            <li>Custom Club Logo</li>
                            <li>Custom Colorways</li>
                            <li>Medical grade grip pads</li>
                            <li>Breathable moisture-wicking fabric</li>
                        </ul>
                        <a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-primary">
                            DM to Order Custom Pair
                        </a>
                    </div>
                </div>
            </section>
        `;
    },

    renderAbout: function() {
        this.root.innerHTML = `
            <section class="container about-section">
                <h2>About Crampons Direct</h2>
                <div class="about-content">
                    <p>
                        We are dedicated to providing footballers with elite-level gear at accessible prices. 
                        Based in France, serving the global football community. 
                        We specialize in high-end boots and fully customizable grip socks designed for performance.
                    </p>
                    <br>
                    <p><strong>Strictly No Fakes. Only Performance.</strong></p>
                </div>
            </section>
        `;
    },

    // Helpers
    renderGrid: function(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            // If placeholder, use a generic one
            const displayImg = p.img.includes('placeholder') ? 
                `https://via.placeholder.com/300x250/f3f4f6/0a2558?text=${encodeURIComponent(p.name)}` : p.img;

            let actionButton = '';
            if (p.videos) {
                actionButton = `<button class="btn btn-primary btn-card" onclick="app.openProduct('${p.id}')">Watch Showcase & Buy</button>`;
            } else {
                // Direct order link for regular products
                actionButton = `<a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-primary btn-card">Order Now</a>`;
            }

            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${displayImg}" alt="${p.name}" class="card-img">
                </div>
                <div class="card-info">
                    <span class="card-brand">${p.brand}</span>
                    <h3 class="card-title">${p.name}</h3>
                    <p class="card-price">€${p.price}</p>
                    ${actionButton}
                </div>
            `;
            container.appendChild(card);
        });
    },

    filterProducts: function(brand) {
        this.renderProductsPage(brand);
    },

    // Modal / Details Logic
    openProduct: function(id) {
        const product = PRODUCTS.find(p => p.id === id);
        if (!product) return;

        const modal = document.getElementById('product-modal');
        const body = document.getElementById('modal-body');

        let mediaContent = '';
        
        // Generate TikTok Embeds
        if (product.videos && product.videos.length > 0) {
            const embeds = product.videos.map(vidId => `
                <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@cramponsdirect/video/${vidId}" data-video-id="${vidId}" style="max-width: 605px;min-width: 325px;" > 
                    <section> <a target="_blank" href="https://www.tiktok.com/@cramponsdirect/video/${vidId}?refer=embed">@cramponsdirect</a> </section> 
                </blockquote>
            `).join('');
            mediaContent = `<div class="detail-media">${embeds}</div>`;
        } else {
            mediaContent = `<div class="detail-media"><img src="${product.img}" style="max-width:400px; border-radius:8px;"></div>`;
        }

        body.innerHTML = `
            <div class="detail-layout">
                ${mediaContent}
                <div class="detail-info">
                    <span class="text-blue" style="font-weight:bold; text-transform:uppercase;">${product.brand}</span>
                    <h2 style="text-align:left; margin: 10px 0;">${product.name}</h2>
                    <p style="font-size: 1.5rem; font-weight:700; margin-bottom:20px;">€${product.price}</p>
                    <p style="margin-bottom:30px; color:#555;">${product.desc}</p>
                    <a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-primary" style="width:100%; text-align:center;">Order on Instagram</a>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling background

        // Reload TikTok script to render new embeds
        this.reloadTikTokScript();
    },

    closeModal: function() {
        document.getElementById('product-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('modal-body').innerHTML = ''; // Clear to stop video audio
    },

    reloadTikTokScript: function() {
        // Remove old script if exists
        const oldScript = document.getElementById('tiktok-embed-script');
        if (oldScript) oldScript.remove();

        // Add new script to trigger render
        const script = document.createElement('script');
        script.id = 'tiktok-embed-script';
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    },

    setupListeners: function() {
        // Close modal on outside click
        window.onclick = function(event) {
            const modal = document.getElementById('product-modal');
            if (event.target == modal) {
                app.closeModal();
            }
        };
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
