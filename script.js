/**
 * Crampons Direct - Main Application Logic
 * Functionality: Router, Filtering, Dynamic Rendering, TikTok Embeds
 */

// --- 1. Product Database ---
const products = [
    {
        id: "nike-phantom-gx2",
        brand: "nike",
        name: "Nike Phantom GX2",
        price: 80,
        img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "Engineered for precision. The Phantom GX2 features Gripknit technology for better ball control in all weather conditions.",
        videos: []
    },
    {
        id: "nike-phantom-gx3",
        brand: "nike",
        name: "Nike Phantom GX3",
        price: 80,
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "The next evolution of the Phantom. Lighter, grippier, and deadlier in front of goal.",
        videos: []
    },
    {
        id: "nike-mercurial-gx3",
        brand: "nike",
        name: "Nike Mercurial GX3 Elite",
        price: 80,
        img: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "Pure speed. The Mercurial GX3 Elite is the lightest boot in the range, designed for explosive acceleration.",
        videos: ["7574545441858129174", "7574185891049131286"] // Mapped from prompt
    },
    {
        id: "nike-phantom-luna",
        brand: "nike",
        name: "Nike Phantom Luna Elite",
        price: 80,
        img: "https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "Designed with insight from female footballers, the Luna offers 360-degree rotational traction for injury prevention and agility.",
        videos: ["7574151020847140118"] // Mapped from prompt
    },
    {
        id: "adidas-predator",
        brand: "adidas",
        name: "Adidas Predator Elite",
        price: 80,
        img: "https://images.unsplash.com/photo-1586525198428-225f6f12c240?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "The goal scorer's boot. Strikeskin rubber fins provide ultimate swerve and power.",
        videos: []
    },
    {
        id: "adidas-copa",
        brand: "adidas",
        name: "Adidas Copa Pure II",
        price: 80,
        img: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "Class and comfort. Premium leather upper meets modern lightweight tooling.",
        videos: []
    },
    {
        id: "nb-tekela",
        brand: "newbalance",
        name: "New Balance Tekela",
        price: 80,
        img: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "See it different. The Tekela provides unrivaled stability and touch for the midfield maestro.",
        videos: []
    },
    {
        id: "adidas-f50",
        brand: "adidas",
        name: "Adidas F50",
        price: 80,
        img: "https://images.unsplash.com/photo-1529815488161-0f1f924e6b12?auto=format&fit=crop&q=80&w=800", // Placeholder
        desc: "Fast is back. The F50 returns with a Sprintframe outsole for elite-level speed.",
        videos: ["7574545441858129174"] // Mapped from prompt
    }
];

// --- 2. Application Core ---
const app = {
    root: document.getElementById('app-root'),
    
    init: function() {
        this.navigate('home');
        this.setupMobileMenu();
    },

    navigate: function(page, param = null) {
        window.scrollTo(0, 0);
        
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');

        switch(page) {
            case 'home':
                this.renderHome();
                break;
            case 'shop':
                this.renderShop(param || 'all');
                break;
            case 'product':
                this.renderProductDetail(param);
                break;
            case 'socks':
                this.renderSocks();
                break;
            case 'about':
                this.renderAbout();
                break;
            default:
                this.renderHome();
        }
    },

    // --- View Renderers ---

    renderHome: function() {
        this.root.innerHTML = `
            <section class="hero">
                <div class="container hero-content">
                    <h1 class="text-blue">DOMINATE <br> <span style="color:var(--color-red)">THE PITCH.</span></h1>
                    <p style="font-size: 1.25rem; color: #64748b; margin-bottom: 30px;">
                        Elite football boots and custom anti-slip socks. 
                        Professional gear for those who demand the best.
                    </p>
                    <button onclick="app.navigate('shop')" class="btn btn-primary">Shop Boots</button>
                    <button onclick="app.navigate('socks')" class="btn btn-outline" style="margin-left: 10px;">Custom Socks</button>
                </div>
            </section>
            
            <section class="section">
                <div class="container">
                    <h2>Featured Arrivals</h2>
                    <div class="product-grid" id="featured-grid"></div>
                    <div style="text-align:center; margin-top:40px;">
                        <button onclick="app.navigate('shop')" class="btn btn-outline">View Full Catalog</button>
                    </div>
                </div>
            </section>
        `;
        
        // Render top 4 items
        this.renderGrid(products.slice(0, 4), 'featured-grid');
    },

    renderShop: function(filter) {
        this.root.innerHTML = `
            <section class="section bg-light" style="min-height: 80vh;">
                <div class="container">
                    <div style="text-align:center; margin-bottom: 40px;">
                        <h2>Professional Footwear</h2>
                        <p>All boots priced at €80. Filter by your preferred brand.</p>
                    </div>

                    <div class="filters">
                        <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="app.filterShop('all')">All Brands</button>
                        <button class="filter-btn ${filter === 'nike' ? 'active' : ''}" onclick="app.filterShop('nike')">Nike</button>
                        <button class="filter-btn ${filter === 'adidas' ? 'active' : ''}" onclick="app.filterShop('adidas')">Adidas</button>
                        <button class="filter-btn ${filter === 'newbalance' ? 'active' : ''}" onclick="app.filterShop('newbalance')">New Balance</button>
                    </div>

                    <div class="product-grid" id="shop-grid"></div>
                </div>
            </section>
        `;

        const filtered = filter === 'all' ? products : products.filter(p => p.brand === filter);
        this.renderGrid(filtered, 'shop-grid');
    },

    renderGrid: function(items, containerId) {
        const container = document.getElementById(containerId);
        if(items.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No products found.</p>';
            return;
        }

        container.innerHTML = items.map(p => `
            <div class="product-card" onclick="app.navigate('product', '${p.id}')">
                <div class="card-img-wrapper">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                </div>
                <div class="card-info">
                    <span class="card-brand">${p.brand}</span>
                    <h3 class="card-title">${p.name}</h3>
                    <div class="card-price">€${p.price}</div>
                </div>
            </div>
        `).join('');
    },

    renderProductDetail: function(id) {
        const product = products.find(p => p.id === id);
        if(!product) return this.navigate('shop');

        // Check if product has video or image
        let mediaHTML = '';
        if(product.videos && product.videos.length > 0) {
            mediaHTML = product.videos.map(vidId => `
                <div style="margin-bottom:20px;">
                    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@cramponsdirect/video/${vidId}" data-video-id="${vidId}" style="max-width: 605px;min-width: 325px;" > 
                        <section> <a target="_blank" href="https://www.tiktok.com/@cramponsdirect/video/${vidId}">@cramponsdirect</a> </section> 
                    </blockquote>
                </div>
            `).join('');
        } else {
            mediaHTML = `<img src="${product.img}" alt="${product.name}" style="width:100%; height:auto; object-fit:cover;">`;
        }

        this.root.innerHTML = `
            <div class="section container detail-container">
                <span class="back-btn" onclick="app.navigate('shop')">← Back to Shop</span>
                
                <div class="detail-layout">
                    <div class="detail-media">
                        <div style="width:100%; padding:20px; text-align:center;">
                            ${mediaHTML}
                        </div>
                    </div>
                    
                    <div class="detail-info">
                        <span style="text-transform:uppercase; color:var(--color-red); font-weight:700;">${product.brand}</span>
                        <h1>${product.name}</h1>
                        <div class="detail-price">€${product.price}</div>
                        
                        <p class="detail-desc">${product.desc}</p>
                        
                        <div style="background:#f1f5f9; padding:25px; border-radius:8px;">
                            <p style="font-weight:600; margin-bottom:10px;">Ready to dominate?</p>
                            <a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-primary" style="width:100%; text-align:center; display:block;">Order Now on Instagram</a>
                            <p style="font-size:0.8rem; margin-top:10px; color:#64748b; text-align:center;">DM us your size and address.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Crucial: Reload TikTok script for dynamic content
        this.reloadTikTokScript();
    },

    renderSocks: function() {
        this.root.innerHTML = `
            <section class="section container">
                <div style="background:var(--color-blue); color:white; border-radius:12px; padding:60px 20px; text-align:center;">
                    <h2 style="color:white;">Custom Anti-Slip Socks</h2>
                    <p style="max-width:600px; margin:0 auto 30px; opacity:0.9;">
                        Professional grade grip technology. Fully customizable with your club logo, colors, and number.
                        Prevent blisters and improve agility.
                    </p>
                    <a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-primary">Start Custom Order</a>
                </div>
                
                <div style="margin-top:60px; text-align:center;">
                   <h3>Why Choose Our Socks?</h3>
                   <div style="display:flex; justify-content:center; gap:30px; margin-top:30px; flex-wrap:wrap;">
                        <div style="flex:1; min-width:250px; padding:20px; border:1px solid #eee; border-radius:8px;">
                            <h4 style="margin-bottom:10px;">Medical Grade Grip</h4>
                            <p>Silicone pads placed strategically for maximum traction.</p>
                        </div>
                        <div style="flex:1; min-width:250px; padding:20px; border:1px solid #eee; border-radius:8px;">
                            <h4 style="margin-bottom:10px;">Team Identity</h4>
                            <p>We weave your club crest directly into the fabric.</p>
                        </div>
                        <div style="flex:1; min-width:250px; padding:20px; border:1px solid #eee; border-radius:8px;">
                            <h4 style="margin-bottom:10px;">Breathable</h4>
                            <p>Moisture-wicking materials keep feet dry.</p>
                        </div>
                   </div>
                </div>
            </section>
        `;
    },

    renderAbout: function() {
        this.root.innerHTML = `
            <section class="section container">
                <div style="max-width:800px; margin:0 auto; text-align:center;">
                    <h1>About Us</h1>
                    <p style="font-size:1.2rem; margin:40px 0;">
                        <strong>Crampons Direct</strong> was founded to strip away the marketing noise and provide exactly what elite players need: 
                        top-tier footwear at a fair price (€80 flat rate) and accessories that actually improve performance.
                    </p>
                    <p>Based in France, we ship globally. We do not track you, we do not sell your data. We just sell boots.</p>
                    <br>
                    <a href="https://www.instagram.com/cramponsdirect/" target="_blank" class="btn btn-outline">Follow Our Journey</a>
                </div>
            </section>
        `;
    },

    // --- Helpers ---

    filterShop: function(brand) {
        this.renderShop(brand);
    },

    setupMobileMenu: function() {
        const btn = document.querySelector('.mobile-toggle');
        const nav = document.querySelector('.nav-links');
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    },

    reloadTikTokScript: function() {
        // Remove existing script to force reload
        const oldScript = document.querySelector('script[src*="tiktok.com"]');
        if(oldScript) oldScript.remove();

        const script = document.createElement('script');
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }
};

// --- 3. Start App ---
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
