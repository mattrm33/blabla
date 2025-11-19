// app.js (module)
const APP = document.getElementById('app');
const MODAL_ROOT = document.getElementById('modal-root');

const STORAGE_PRODUCTS = 'crampon_products_v2';
const STORAGE_CART = 'crampon_cart_v2';
const SESSION_ADMIN = 'crampon_is_admin';
const INSTAGRAM_PROFILE = 'https://www.instagram.com/cramponsdirect/'; // ouvre profil

// Admin credentials (user: admin / pass: 1234)
const ADMIN_USER = 'admin';
const ADMIN_PASS = '1234';

/* -------------------------
   Initial products requested
   ------------------------- */
const INITIAL_PRODUCTS = [
  { id: genId(), name: "Nike Phantom III Elite", brand: "nike", price: 80.00, stock: 10,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop" ,
    description: "Nike Phantom III Elite — contrôle et confort." },
  { id: genId(), name: "Adidas Predator Elite", brand: "adidas", price: 80.00, stock: 5,
    image: "https://images.unsplash.com/photo-1520975916958-0fd9d2d6f7f3?q=80&w=1600&auto=format&fit=crop",
    description: "Adidas Predator Elite — adhérence supérieure." },
  { id: genId(), name: "Adidas Copa Pure III", brand: "adidas", price: 80.00, stock: 5,
    image: "https://images.unsplash.com/photo-1520975916958-0fd9d2d6f7f3?q=80&w=1600&auto=format&fit=crop",
    description: "Adidas Copa Pure III — toucher classique et précision." },
  { id: genId(), name: "New Balance Tekela", brand: "newbalance", price: 80.00, stock: 6,
    image: "https://images.unsplash.com/photo-1565044607084-9e04b8e4f6df?q=80&w=1600&auto=format&fit=crop",
    description: "New Balance Tekela — légèreté et traction." }
];

/* -------------------------
   Utilities
   ------------------------- */
function genId(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8) }

function loadProducts(){
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS);
    if(!raw){ localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS)); return INITIAL_PRODUCTS.slice() }
    return JSON.parse(raw);
  } catch(e){ console.error(e); return INITIAL_PRODUCTS.slice() }
}
function saveProducts(products){ localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products)) }

function loadCart(){ try { return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]') } catch(e){ return [] } }
function saveCart(cart){ localStorage.setItem(STORAGE_CART, JSON.stringify(cart)) }

function isAdmin(){ return sessionStorage.getItem(SESSION_ADMIN) === '1' }

function toast(msg, ms=1800){
  const el = document.createElement('div'); el.className='toast'; el.textContent=msg;
  document.body.appendChild(el); setTimeout(()=> el.style.opacity='0', ms-400); setTimeout(()=> el.remove(), ms);
}

/* Escape for safety (small) */
function esc(s){ return String(s || '').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) }

/* -------------------------
   Router (hash-based)
   ------------------------- */
function router(){
  const hash = location.hash || '#/';
  if(hash.startsWith('#product-')){
    const id = hash.split('-')[1];
    renderProductDetail(id);
  } else {
    renderHome();
  }
}
window.addEventListener('hashchange', router);

/* -------------------------
   Render: Header + Home + Detail + Cart Panel
   ------------------------- */
function renderHeader(){
  const admin = isAdmin();
  return `
    <header class="header">
      <div class="header-inner">
        <div class="brand">
          <div class="logo">CD</div>
          <div>
            <h1>CRAMPON DIRECT</h1>
            <div class="small">Football • Rugby • Chaussettes</div>
          </div>
        </div>

        <div class="header-actions">
          <div class="categories" id="categories">
            <button class="cat-btn active" data-cat="all">Tous</button>
            <button class="cat-btn" data-cat="nike">Nike</button>
            <button class="cat-btn" data-cat="adidas">Adidas</button>
            <button class="cat-btn" data-cat="newbalance">New Balance</button>
          </div>

          <a class="btn small" href="${INSTAGRAM_PROFILE}" target="_blank" rel="noreferrer">Nous contacter</a>

          ${ admin 
            ? `<button id="btn-add" class="btn small">Ajouter</button>
               <button id="btn-logout" class="btn small" style="background:var(--danger)">Déconnexion</button>`
            : `<button id="btn-login" class="btn small">Admin</button>`}
        </div>
      </div>
    </header>
  `;
}

function renderHero(){
  return `
    <section class="hero">
      <h2>LES MEILLEURS CRAMPONS</h2>
      <p>Nike • Adidas • New Balance — Prix fixes, stock suivi</p>
    </section>
  `;
}

function getBrandLabel(b){
  return { nike:'⚽ Nike', adidas:'⚽ Adidas', newbalance:'⚽ New Balance' }[b] || b;
}

function productCardHTML(p){
  return `
    <div class="card" data-id="${p.id}">
      <div class="card-media"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div>
      <div class="card-body">
        <div class="tag">${getBrandLabel(p.brand)}</div>
        <h3>${esc(p.name)}</h3>
        <p class="small">${esc(p.description)}</p>
        <div class="row">
          <div style="font-weight:800">${p.price.toFixed(2)}€</div>
          <div style="display:flex;gap:8px;align-items:center">
            <button class="btn small" data-action="view" data-id="${p.id}">Voir</button>
            <button class="btn small" ${p.stock<=0?'disabled style="opacity:.6"':''} data-action="add" data-id="${p.id}">+ Panier</button>
            ${ isAdmin() ? `<button class="btn small" style="background:var(--danger)" data-action="edit" data-id="${p.id}">Édit</button>` : '' }
          </div>
        </div>
        <div class="small" style="margin-top:8px">Stock: ${p.stock}</div>
      </div>
    </div>
  `;
}

function cartPanelHTML(){
  const cart = loadCart();
  const products = loadProducts();
  const lines = cart.map(item=>{
    const p = products.find(pr => pr.id === item.id) || { name:'?', price:0, image:'' };
    return `<div class="cart-item">
      <img src="${esc(p.image)}" alt="${esc(p.name)}" />
      <div style="flex:1">
        <div style="font-weight:700">${esc(p.name)}</div>
        <div class="small">${item.qty} × ${p.price.toFixed(2)}€</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:800">${(item.qty * p.price).toFixed(2)}€</div>
        <div style="display:flex;gap:6px;margin-top:6px">
          <button class="btn small" data-action="dec" data-id="${item.id}">-</button>
          <button class="btn small" data-action="inc" data-id="${item.id}">+</button>
          <button class="btn small" style="background:var(--danger)" data-action="remove" data-id="${item.id}">x</button>
        </div>
      </div>
    </div>`;
  }).join('') || `<div class="small center" style="padding:12px">Panier vide</div>`;

  const total = cart.reduce((acc,it)=>{
    const p = products.find(pr=>pr.id===it.id); return acc + (p? p.price*it.qty : 0);
  },0);

  return `
    <div class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <strong>Panier</strong>
        <div class="small">Total: <strong>${total.toFixed(2)}€</strong></div>
      </div>
      <div class="cart-items" id="cart-items">${lines}</div>
      <div style="margin-top:12px;displa
