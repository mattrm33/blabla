/* === PRODUITS INITIAL === */
const PRODUCTS = [
  { name: "Nike Phantom III Elite", cat:"nike", price:80, colors:10, img:"https://i.imgur.com/m6qs6pT.jpeg" },
  { name: "Adidas Predator Elite", cat:"adidas", price:80, colors:5, img:"https://i.imgur.com/IRlkw8v.jpeg" },
  { name: "Adidas Copa Pure III", cat:"adidas", price:80, colors:6, img:"https://i.imgur.com/0N1uYRv.jpeg" },
  { name: "New Balance Tekela", cat:"newbalance", price:80, colors:6, img:"https://i.imgur.com/ILgrgIQ.jpeg" }
];

/* STOCK HTML */
const productContainer = document.getElementById("products");

/* Affichage Produits */
function renderProducts(filter="all") {
  productContainer.innerHTML = "";
  PRODUCTS.filter(p => filter==="all" || p.cat===filter).forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = p.img;  // facile à remplacer par ton URL Imgur

    const body = document.createElement("div");
    body.classList.add("card-body");

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `${p.price}€`;

    const colors = document.createElement("p");
    colors.classList.add("stock"); // on garde la classe "stock" pour le style
    colors.textContent = `Coloris disponibles : ${p.colors}`;

    body.append(title, price, colors);
    card.append(img, body);
    productContainer.appendChild(card);
  });
}

renderProducts();

/* === NAV CATEGORIES === */
document.querySelectorAll("nav li").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active");
    renderProducts(btn.dataset.cat);
  });
});

/* === ADMIN === */
const adminBtn = document.getElementById("adminBtn");
const loginModal = document.getElementById("loginModal");
const loginSubmit = document.getElementById("loginSubmit");
const loginError = document.getElementById("loginError");

adminBtn.onclick = () => loginModal.style.display = "flex";
document.querySelector(".close").onclick = () => loginModal.style.display = "none";

loginSubmit.onclick = () => {
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;
  if(user === "admin" && pass === "1234") {
    loginError.textContent = "Connexion réussie ✔";
    loginError.style.color = "green";
    setTimeout(() => loginModal.style.display = "none", 800);
  } else {
    loginError.textContent = "Identifiants incorrects ❌";
    loginError.style.color = "red";
  }
};

