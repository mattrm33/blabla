/* ======================= PRODUITS ======================= */
const PRODUCTS = [
  {
    name: "Nike Phantom III Elite",
    cat: "nike",
    price: 80,
    colors: [
      "https://imgur.com/m6qs6pT.png",
      "https://imgur.com/m6qs6pT.png"
    ]
  },
  {
    name: "Adidas Predator Elite",
    cat: "adidas",
    price: 80,
    colors: [
      "https://imgur.com/IRlkw8v.png",
      "https://imgur.com/IRlkw8v.png"
    ]
  },
  {
    name: "Adidas Copa Pure III",
    cat: "adidas",
    price: 80,
    colors: [
      "https://imgur.com/0N1uYRv.png"
    ]
  },
  {
    name: "New Balance Tekela",
    cat: "newbalance",
    price: 80,
    colors: [
      "https://imgur.com/ILgrgIQ.png"
    ]
  }
];

/* ======================= AFFICHAGE PRODUITS ======================= */
const productContainer = document.getElementById("products");

function renderProducts(filter = "all") {
  productContainer.innerHTML = "";
  PRODUCTS.filter(p => filter === "all" || p.cat === filter).forEach((p, idx) => {
    let imagesHTML = p.colors
      .map((url, i) => `<img src="${url}" class="slide ${i === 0 ? 'active' : ''}">`)
      .join("");
    
    productContainer.innerHTML += `
      <div class="card">
        <div class="slider" id="slider-${idx}">${imagesHTML}</div>
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="price">${p.price}€</p>
          <p class="colors-count">Couleurs disponibles: ${p.colors.length}</p>
          <button class="orderBtn" data-name="${p.name}">Commander</button>
        </div>
      </div>
    `;

    startSlider(`slider-${idx}`);
  });

  // Ajouter événement boutons commander
  document.querySelectorAll(".orderBtn").forEach(btn => {
    btn.onclick = () => {
      const prodName = btn.dataset.name;
      const insta = "https://www.instagram.com/cramponsdirect/";
      const message = encodeURIComponent(`Bonjour, je voudrais commander 1 paire de ${prodName}`);
      window.open(`${insta}`, "_blank");
    };
  });
}

/* ======================= SLIDER AUTOMATIQUE ======================= */
function startSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const slides = slider.querySelectorAll(".slide");
  if (slides.length <= 1) return;

  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 2500);
}

/* ======================= NAV CATEGORIES ======================= */
document.querySelectorAll("nav li").forEach(btn => {
  btn.onclick = () => {
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  };
});

renderProducts();

/* ======================= COOKIES ======================= */
const cookieModal = document.getElementById("cookieModal");
const acceptCookies = document.getElementById("acceptCookies");
const refuseCookies = document.getElementById("refuseCookies");

window.onload = () => {
  if (!localStorage.getItem("cookiesAccepted")) {
    cookieModal.style.display = "flex";
  }
};

acceptCookies.onclick = () => {
  localStorage.setItem("cookiesAccepted", "true");
  cookieModal.style.display = "none";
};

refuseCookies.onclick = () => {
  alert("Vous devez accepter les cookies pour naviguer sur le site.");
  window.close();
};

/* ======================= ADMIN ======================= */
const adminBtn = document.getElementById("adminBtn");
const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginError = document.getElementById("loginError");
const adminPanelBtn = document.getElementById("adminPanelBtn");

adminBtn.onclick = () => (loginModal.style.display = "flex");
document.querySelector(".close").onclick = () => (loginModal.style.display = "none");

loginSubmit.onclick = async () => {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, pass })
    });
    const data = await res.json();

    if (data.success) {
      loginError.textContent = "Connexion réussie ✔";
      loginError.style.color = "green";
      setTimeout(() => {
        loginModal.style.display = "none";
        adminPanelBtn.style.display = "block";
      }, 800);
    } else {
      loginError.textContent = "Identifiants incorrects ❌";
      loginError.style.color = "red";
    }
  } catch (err) {
    loginError.textContent = "Erreur serveur ❌";
    loginError.style.color = "red";
  }
};


