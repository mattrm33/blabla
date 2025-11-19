/* === PRODUITS INITIAL === */
const PRODUCTS = [
  { name: "Nike Phantom III Elite", cat:"nike", price:80, stock:10, img:"https://imgur.com/m6qs6pT.png" },
  { name: "Adidas Predator Elite", cat:"adidas", price:80, stock:5, img:"https://imgur.com/IRlkw8v.png" },
  { name: "Adidas Copa Pure III", cat:"adidas", price:80, stock:5, img:"https://imgur.com/0N1uYRv.png" },
  { name: "New Balance Tekela", cat:"newbalance", price:80, stock:6, img:"https://imgur.com/ILgrgIQ.png" }
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
    img.src = p.img;

    const body = document.createElement("div");
    body.classList.add("card-body");

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `${p.price}€`;

    const stock = document.createElement("p");
    stock.classList.add("stock");
    stock.textContent = `Stock : ${p.stock}`;

    body.append(title, price, stock);
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
