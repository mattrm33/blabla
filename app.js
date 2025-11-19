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
      <div style="margin-top:12px;display:flex;gap:8px">
        <button id="checkoutBtn" class="btn btn-block">Commander (Instagram)</button>
        <button id="clearCartBtn" class="btn ghost">Vider</button>
      </div>
      <div style="margin-top:8px" class="small">⚠️ Le message est copié, puis nous ouvrons Instagram pour que tu colles en DM.</div>
    </div>
  `;
}

/* Home render */
function renderHome(filterBrand='all'){
  const products = loadProducts();
  const filtered = filterBrand === 'all' ? products : products.filter(p=>p.brand === filterBrand);
  const grid = filtered.map(p => productCardHTML(p)).join('') || `<div class="notfound center"><p class="kicker">Aucun produit pour cette catégorie</p></div>`;

  APP.innerHTML = `
    ${renderHeader()}
    ${renderHero()}
    <div class="container">
      <main>
        <div class="grid">${grid}</div>
      </main>
      <aside class="aside">
        ${cartPanelHTML()}
      </aside>
    </div>
    <footer class="footer">© ${new Date().getFullYear()} Crampon Direct</footer>
  `;

  attachHomeListeners();
}

/* Product detail render */
function renderProductDetail(id){
  const products = loadProducts();
  const p = products.find(x => x.id === id);
  if(!p){ APP.innerHTML = `${renderHeader()}<div class="notfound center"><h2>404 — Produit introuvable</h2><p><a class="btn" href="#/">Retour</a></p></div>`; return; }

  APP.innerHTML = `
    ${renderHeader()}
    <section class="hero" style="text-align:left;max-width:1100px;margin:24px auto">
      <div class="detail">
        <div class="detail-media"><img src="${esc(p.image)}" alt="${esc(p.name)}" style="width:100%;height:100%;object-fit:cover"></div>
        <div class="detail-info">
          <div class="badge">${getBrandLabel(p.brand)}</div>
          <h2 style="margin:10px 0">${esc(p.name)}</h2>
          <p class="small">${esc(p.description)}</p>
          <div style="margin-top:18px;font-size:28px;font-weight:800">${p.price.toFixed(2)}€</div>
          <div style="margin-top:12px;display:flex;gap:8px">
            <button class="btn" data-action="add" data-id="${p.id}">Ajouter au panier</button>
            <a class="btn ghost" href="#/">Retour</a>
          </div>
          <div style="margin-top:10px" class="small">Stock : ${p.stock}</div>
        </div>
      </div>
    </section>
    <div style="max-width:1100px;margin:20px auto">${cartPanelHTML()}</div>
    <footer class="footer">© ${new Date().getFullYear()} Crampon Direct</footer>
  `;

  attachDetailListeners();
}

/* -------------------------
   Attach listeners
   ------------------------- */
function attachHomeListeners(){
  // category buttons
  document.querySelectorAll('.cat-btn').forEach(btn=>{
    btn.onclick = (e)=>{
      document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      renderHome(cat);
    };
  });

  // action buttons on cards
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = (e)=>{
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if(action === 'view'){ location.hash = `#product-${id}` }
      else if(action === 'add'){ addToCart(id); renderHome(currentCategory()) }
      else if(action === 'edit'){ showEditProductModal(id) }
    };
  });

  // login / add / logout
  const loginBtn = document.getElementById('btn-login');
  if(loginBtn) loginBtn.onclick = showLoginModal;
  const addBtn = document.getElementById('btn-add');
  if(addBtn) addBtn.onclick = showAddProductModal;
  const logoutBtn = document.getElementById('btn-logout');
  if(logoutBtn) { logoutBtn.onclick = ()=>{ sessionStorage.removeItem(SESSION_ADMIN); toast('Déconnecté'); renderHome(currentCategory()) } }

  // cart actions
  attachCartListeners();
}

function attachDetailListeners(){
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.onclick = (e)=>{
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if(action === 'add'){ addToCart(id); renderProductDetail(id); }
    }
  });
  attachCartListeners();
}

function attachCartListeners(){
  // increment / decrement / remove
  document.querySelectorAll('#cart-items [data-action]').forEach(btn=>{
    btn.onclick = ()=>{
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if(action === 'inc') changeCartQty(id, +1);
      if(action === 'dec') changeCartQty(id, -1);
      if(action === 'remove') removeFromCart(id);
      refreshCartPanel();
    };
  });
  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn) checkoutBtn.onclick = startInstagramCheckout;
  const clearBtn = document.getElementById('clearCartBtn');
  if(clearBtn) clearBtn.onclick = ()=> { saveCart([]); refreshCartPanel(); toast('Panier vidé') }
}

/* -------------------------
   Cart operations
   ------------------------- */
function addToCart(id){
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  if(!p || p.stock <= 0){ toast('Stock insuffisant'); return }
  const cart = loadCart();
  const line = cart.find(l=>l.id===id);
  if(line){
    // only add if stock allows
    if(line.qty + 1 > p.stock){ toast('Quantité supérieure au stock'); return }
    line.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  toast('Produit ajouté');
}

function changeCartQty(id, diff){
  const cart = loadCart();
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  const l = cart.find(x=>x.id===id);
  if(!l) return;
  l.qty += diff;
  if(l.qty < 1) l.qty = 1;
  if(l.qty > (p? p.stock : Infinity)){ l.qty = p.stock; toast('Limite stock atteinte') }
  saveCart(cart);
}

function removeFromCart(id){
  let cart = loadCart();
  cart = cart.filter(x=>x.id!==id);
  saveCart(cart);
  toast('Supprimé du panier');
}

function refreshCartPanel(){
  // re-render whole page to update cart (simple approach)
  if(location.hash.startsWith('#product-')) router(); else renderHome(currentCategory());
}

/* -------------------------
   Checkout (Instagram flow)
   ------------------------- */
function startInstagramCheckout(){
  const cart = loadCart();
  if(!cart.length){ toast('Panier vide'); return }
  const products = loadProducts();

  // Build message
  let message = `Bonjour, je souhaite commander :%0A`; // %0A -> newline in URL when needed but we copy raw
  let plain = `Bonjour, je souhaite commander :\n`;
  let total = 0;
  cart.forEach(line=>{
    const p = products.find(pr=>pr.id===line.id);
    if(p){
      const lineTotal = (line.qty * p.price);
      total += lineTotal;
      plain += `- ${p.name} x${line.qty} → ${lineTotal.toFixed(2)}€\n`;
      message += `- ${p.name} x${line.qty} → ${lineTotal.toFixed(2)}€%0A`;
    }
  });
  plain += `Total: ${total.toFixed(2)}€\n\nNom: \nTéléphone: \nAdresse (optionnel): \n\nMerci !`;
  message += `Total: ${total.toFixed(2)}€%0A%0ANom:%0ATéléphone:%0AAdresse:%0A%0AMerci !`;

  // reduce stock immediately (simulate reservation) and clear cart
  const productsUpdated = products.map(p=>{
    const inCart = cart.find(c=>c.id===p.id);
    if(inCart) return { ...p, stock: Math.max(0, p.stock - inCart.qty) };
    return p;
  });
  saveProducts(productsUpdated);
  saveCart([]);

  // Copy plain message to clipboard, then open Instagram profile
  copyTextToClipboard(plain).then(()=>{
    toast('Message copié ✅ — ouverture Instagram...');
    // open Instagram profile in new tab
    window.open(INSTAGRAM_PROFILE, '_blank', 'noopener');

    // After a little delay, refresh UI so updated stock & empty cart are shown
    setTimeout(()=> { refreshCartPanel(); }, 700);
  }).catch(()=>{
    // fallback: open profile but also show modal with message to copy
    showPlainMessageModal(plain);
    window.open(INSTAGRAM_PROFILE, '_blank', 'noopener');
    saveProducts(productsUpdated);
    saveCart([]);
    refreshCartPanel();
  });
}

/* Copy helper */
function copyTextToClipboard(text){
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(text);
  } else {
    // older fallback
    return new Promise((resolve, reject)=>{
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position='fixed'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ta.remove(); resolve(); } catch(e){ ta.remove(); reject(e) }
    })
  }
}

/* If clipboard fails, show modal with message to copy manually */
function showPlainMessageModal(text){
  MODAL_ROOT.innerHTML = `
    <div class="modal-backdrop" id="plainModal">
      <div class="modal">
        <h3>Copier le message</h3>
        <p>Nous avons ouvert Instagram. Copie le message ci-dessous et colle le en DM sur notre profil.</p>
        <textarea readonly style="width:100%;min-height:160px;padding:10px;border-radius:8px">${esc(text)}</textarea>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button id="closePlain" class="btn">Fermer</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('closePlain').onclick = ()=>{ MODAL_ROOT.innerHTML = '' };
}

/* -------------------------
   Admin: login + add/edit/delete
   ------------------------- */
function showLoginModal(){
  MODAL_ROOT.innerHTML = `
    <div class="modal-backdrop" id="loginBackdrop">
      <div class="modal">
        <h3>Connexion Admin</h3>
        <div class="form-row"><input id="adminUser" class="input" placeholder="Identifiant (admin)"></div>
        <div class="form-row"><input id="adminPass" type="password" class="input" placeholder="Mot de passe (1234)"></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="doLogin" class="btn">Se connecter</button>
          <button id="closeLogin" class="btn ghost">Annuler</button>
        </div>
        <div id="loginError" class="small" style="color:var(--danger);margin-top:8px"></div>
      </div>
    </div>
  `;
  document.getElementById('closeLogin').onclick = ()=> MODAL_ROOT.innerHTML = '';
  document.getElementById('doLogin').onclick = doLogin;
  document.getElementById('adminPass').addEventListener('keydown', (e)=> e.key==='Enter' && doLogin());
}

function doLogin(){
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value;
  const err = document.getElementById('loginError');
  if(u === ADMIN_USER && p === ADMIN_PASS){
    sessionStorage.setItem(SESSION_ADMIN, '1');
    MODAL_ROOT.innerHTML = '';
    toast('Admin connecté');
    renderHome(currentCategory());
    // open add modal optionally
  } else {
    err.textContent = 'Identifiants incorrects';
  }
}

/* Add product modal */
function showAddProductModal(){
  if(!isAdmin()){ toast('Connecte toi en admin'); return }
  MODAL_ROOT.innerHTML = `
    <div class="modal-backdrop" id="addBackdrop">
      <div class="modal">
        <h3>Ajouter un produit</h3>
        <div class="form-row"><input id="p_name" class="input" placeholder="Nom du produit"></div>
        <div class="form-row">
          <select id="p_brand" class="input">
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
            <option value="newbalance">New Balance</option>
          </select>
        </div>
        <div class="form-row"><input id="p_price" class="input" placeholder="Prix €" type="number" step="0.01" value="80"></div>
        <div class="form-row"><input id="p_stock" class="input" placeholder="Stock" type="number" value="1"></div>
        <div class="form-row"><input id="p_image" class="input" placeholder="URL image (ou laisse vide)"></div>
        <div class="form-row"><textarea id="p_desc" class="input" placeholder="Description"></textarea></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="saveProduct" class="btn">Ajouter</button>
          <button id="closeAdd" class="btn ghost">Annuler</button>
        </div>
        <div id="addError" class="small" style="color:var(--danger);margin-top:8px"></div>
      </div>
    </div>
  `;
  document.getElementById('closeAdd').onclick = ()=> MODAL_ROOT.innerHTML = '';
  document.getElementById('saveProduct').onclick = ()=>{
    const name = document.getElementById('p_name').value.trim();
    const brand = document.getElementById('p_brand').value;
    const price = parseFloat(document.getElementById('p_price').value || 0);
    const stock = parseInt(document.getElementById('p_stock').value || 0);
    const image = document.getElementById('p_image').value.trim() || 'https://via.placeholder.com/800x600?text=Cramp';
    const desc = document.getElementById('p_desc').value.trim();

    if(!name || !price || !Number.isFinite(stock)){
      document.getElementById('addError').textContent = 'Remplis nom / prix / stock';
      return;
    }
    const products = loadProducts();
    products.push({ id: genId(), name, brand, price, stock, image, description: desc });
    saveProducts(products);
    MODAL_ROOT.innerHTML = '';
    toast('Produit ajouté');
    renderHome(currentCategory());
  };
}

/* Edit product modal */
function showEditProductModal(id){
  if(!isAdmin()){ toast('Connecte toi en admin'); return }
  const products = loadProducts();
  const p = products.find(x=>x.id===id);
  if(!p) return;
  MODAL_ROOT.innerHTML = `
    <div class="modal-backdrop" id="editBackdrop">
      <div class="modal">
        <h3>Éditer produit</h3>
        <div class="form-row"><input id="e_name" class="input" value="${esc(p.name)}"></div>
        <div class="form-row">
          <select id="e_brand" class="input">
            <option value="nike"${p.brand==='nike'?' selected':''}>Nike</option>
            <option value="adidas"${p.brand==='adidas'?' selected':''}>Adidas</option>
            <option value="newbalance"${p.brand==='newbalance'?' selected':''}>New Balance</option>
          </select>
        </div>
        <div class="form-row"><input id="e_price" class="input" type="number" step="0.01" value="${p.price}"></div>
        <div class="form-row"><input id="e_stock" class="input" type="number" value="${p.stock}"></div>
        <div class="form-row"><input id="e_image" class="input" value="${esc(p.image)}"></div>
        <div class="form-row"><textarea id="e_desc" class="input">${esc(p.description)}</textarea></div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="saveEdit" class="btn">Sauvegarder</button>
          <button id="delProd" class="btn danger">Supprimer</button>
          <button id="closeEdit" class="btn ghost">Annuler</button>
        </div>
        <div id="editError" class="small" style="color:var(--danger);margin-top:8px"></div>
      </div>
    </div>
  `;
  document.getElementById('closeEdit').onclick = ()=> MODAL_ROOT.innerHTML = '';
  document.getElementById('delProd').onclick = ()=>{
    if(!confirm('Supprimer ce produit ?')) return;
    let products = loadProducts(); products = products.filter(x=>x.id!==p.id); saveProducts(products);
    MODAL_ROOT.innerHTML = ''; toast('Produit supprimé'); renderHome(currentCategory());
  };
  document.getElementById('saveEdit').onclick = ()=>{
    const name = document.getElementById('e_name').value.trim();
    const brand = document.getElementById('e_brand').value;
    const price = parseFloat(document.getElementById('e_price').value || 0);
    const stock = parseInt(document.getElementById('e_stock').value || 0);
    const image = document.getElementById('e_image').value.trim() || p.image;
    const desc = document.getElementById('e_desc').value.trim();
    if(!name){ document.getElementById('editError').textContent='Nom requis'; return; }
    const products = loadProducts();
    const idx = products.findIndex(x=>x.id===p.id);
    products[idx] = { ...products[idx], name, brand, price, stock, image, description: desc };
    saveProducts(products);
    MODAL_ROOT.innerHTML = ''; toast('Modifications sauvegardées'); renderHome(currentCategory());
  };
}

/* -------------------------
   Helpers
   ------------------------- */
function currentCategory(){
  const active = document.querySelector('.cat-btn.active');
  return active ? active.dataset.cat : 'all';
}

/* -------------------------
   Init
   ------------------------- */
function init(){
  // make sure products exist
  loadProducts();

  // initial route render
  router();

  // global click delegation for dynamic buttons (cards)
  document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('[data-action]');
    if(btn){
      const action = btn.dataset.action; const id = btn.dataset.id;
      if(action === 'view'){ location.hash = `#product-${id}` }
    }
  });

  // delegate login/add buttons from header after render
  document.addEventListener('click', (ev)=>{
    if(ev.target.id === 'btn-login'){ showLoginModal() }
    if(ev.target.id === 'btn-add'){ showAddProductModal() }
    if(ev.target.id === 'btn-logout'){ sessionStorage.removeItem(SESSION_ADMIN); toast('Déconnecté'); renderHome(currentCategory()) }
  });
}

init();
