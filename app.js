let products = [
  { name:"Nike Phantom III Elite", brand:"nike", price:80,
img:"https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f6b00c2d-fc96-421b-a4d7-2a34429f8d28/phantom-gx-ii-elite-fg-football-boot-bStMCx.png"},

  { name:"Adidas Predator Elite", brand:"adidas", price:80,
img:"https://assets.adidas.com/images/w_600,f_auto,q_auto/0c36ecc23c304e3eb33caca701403824_9366/Predator_Elite_FG_Black_IE1804_01_standard.jpg"},

  { name:"Adidas Copa Pure III", brand:"adidas", price:80,
img:"https://assets.adidas.com/images/w_600,f_auto,q_auto/1d529c9cb3c444edbde6050531b203c2_9366/Copa_Pure_III_FG_Black_GW4968_01_standard.jpg"},

  { name:"New Balance Tekela", brand:"newbalance", price:80,
img:"https://nb.scene7.com/is/image/NB/msplsfd4_nb_02_i?$pdpflexf2$"},
];

const container = document.getElementById("products");

function display(brand="nike"){
  container.innerHTML = "";
  products.filter(p=>p.brand===brand).forEach(p=>{
    container.innerHTML += `
      <div class="card">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p class="price">${p.price}€</p>
      </div>`;
  });
}
display();

document.querySelectorAll("nav li").forEach(li=>{
  li.onclick = ()=> display(li.dataset.cat);
});
