// ======== PRODUITS ========
const products = [
  { name: "Nike Phantom III Elite", brand: "nike", stock: 10, price: 80, img: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f6b00c2d-fc96-421b-a4d7-2a34429f8d28/phantom-gx-ii-elite-fg-football-boot-bStMCx.png" },

  { name: "Adidas Predator Elite", brand: "adidas", stock: 5, price: 80, img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/0c36ecc23c304e3eb33caca701403824_9366/Predator_Elite_FG_Black_IE1804_01_standard.jpg" },
  { name: "Adidas Copa Pure III", brand: "adidas", stock: 5, price: 80, img: "https://assets.adidas.com/images/w_600,f_auto,q_auto/1d529c9cb3c444edbde6050531b203c2_9366/Copa_Pure_III_FG_Black_GW4968_01_standard.jpg" },

  { name: "New Balance Tekela", brand: "newbalance", stock: 6, price: 80, img: "https://nb.scene7.com/is/image/NB/msplsfd4_nb_02_i?$pdpflexf2$" }
];

let admin = false;

// ======== AFFICHER LES PRODUITS ========
function showProducts(brand="nike") {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.filter(p => p.brand === brand).forEach(p => {
    list.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price}€ — Stock : ${p.stock}</p>
        <button class="buy">Voir</button>
        ${admin ? `<button class="add">Supprimer</button>` : ""}
      </div>`;
  });
}

showProducts();

// ======== CLIC CATEGORIE ========
document.querySelectorAll(".catBtn").forEach(btn => {
  btn.addEventListener("click", () => showProducts(btn.dataset.cat));
});

// ======== LOGIN ADMIN ========
document.getElementById("adminBtn").onclick = () => {
  document.getElementById("loginModal").classList.remove("hidden");
};

document.querySelector(".closeModal").onclick = () => {
  document.getElementById("loginModal").classList.add("hidden");
};

document.getElementById("loginSubmit").onclick = () => {
  if (document.getElementById("adminPass").value === "1234") {
    admin = true;
    alert("Admin activé !");
    showProducts();
  } else alert("Mot de passe incorrect !");
  document.getElementById("loginModal").classList.add("hidden");
};
