/* PRODUITS INITIAUX */
let PRODUCTS = [
  {name:"Nike Phantom III Elite",cat:"nike",price:80,images:["https://i.imgur.com/m6qs6pT.jpeg","https://i.imgur.com/m6qs6pT2.jpeg"]},
  {name:"Adidas Predator Elite",cat:"adidas",price:80,images:["https://i.imgur.com/IRlkw8v.jpeg"]},
  {name:"Adidas Copa Pure III",cat:"adidas",price:80,images:["https://i.imgur.com/0N1uYRv.jpeg"]},
  {name:"New Balance Tekela",cat:"newbalance",price:80,images:["https://i.imgur.com/ILgrgIQ.jpeg"]}
];

/* ELEMENTS */
const productContainer=document.getElementById("products");
const loginModal=document.getElementById("loginModal");
const loginSubmit=document.getElementById("loginSubmit");
const loginError=document.getElementById("loginError");
const adminBtn=document.getElementById("adminBtn");
const adminPanel=document.getElementById("adminPanel");
const logTableBody=document.querySelector("#logTable tbody");
const cookieConsent=document.getElementById("cookieConsent");
const acceptCookies=document.getElementById("acceptCookies");

/* COOKIE CONSENT */
let cookiesAccepted=localStorage.getItem("cookiesAccepted");
if(!cookiesAccepted){cookieConsent.style.display="flex";}
acceptCookies.onclick=()=>{
  localStorage.setItem("cookiesAccepted","true");
  cookieConsent.style.display="none";
};

/* BLOQUE ACCESSI si pas cookie */
if(!cookiesAccepted){productContainer.innerHTML="<p style='padding:20px'>Veuillez accepter les cookies pour accéder au site.</p>";}

/* LOG VISITEUR */
function logVisitor(){
  if(!localStorage.getItem("cookiesAccepted")) return;
  let ip="xxx.xxx.xxx.xxx"; // mock IP (pas de backend ici)
  let device= /Mobi|Android/i.test(navigator.userAgent)?"Mobile":(/Tablet/i.test(navigator.userAgent)?"Tablet":"PC");
  let time=new Date().toLocaleString();
  let logs=JSON.parse(localStorage.getItem("visitorLogs")||"[]");
  logs.push({ip,device,time,banned:false});
  localStorage.setItem("visitorLogs",JSON.stringify(logs));
}
logVisitor();

/* RENDER PRODUITS */
function renderProducts(filter="all"){
  productContainer.innerHTML="";
  PRODUCTS.filter(p=>filter==="all"||p.cat===filter).forEach((p)=>{
    const card=document.createElement("div"); card.classList.add("card");
    const img=document.createElement("img"); img.src=p.images[0];
    if(p.images.length>1){
      let i=0; setInterval(()=>{i=(i+1)%p.images.length; img.src=p.images[i];},3000);
    }
    const body=document.createElement("div"); body.classList.add("card-body");
    const h3=document.createElement("h3"); h3.textContent=p.name;
    const price=document.createElement("p"); price.textContent=`${p.price}€`;
    const btn=document.createElement("button"); btn.textContent="Commander";
    btn.onclick=()=>{
      const msg=`Bonjour, je voudrais commander 1 paire de ${p.name}.`;
      navigator.clipboard.writeText(msg).then(()=>{
        window.location.href="instagram://user?username=cramponsdirect";
        alert("Message prêt ! Collez-le dans le DM Instagram.");
      });
    };
    body.append(h3,price,btn); card.append(img,body); productContainer.appendChild(card);
  });
}
renderProducts();

/* NAVIGATION CATEGORIES */
document.querySelectorAll("nav li").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelector("nav li.active")?.classList.remove("active");
    btn.classList.add("active"); renderProducts(btn.dataset.cat);
  }
});

/* ADMIN LOGIN */
adminBtn.onclick=()=>loginModal.style.display="flex";
document.querySelector(".close").onclick=()=>loginModal.style.display="none";
document.querySelector(".close-admin").onclick=()=>adminPanel.style.display="none";

loginSubmit.onclick=()=>{
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  if(["admin1","admin2","admin3"].includes(user) && pass==="1234"){
    loginError.textContent="Connexion réussie ✔"; loginError.style.color="green";
    setTimeout(()=>{
      loginModal.style.display="none"; adminPanel.style.display="flex"; renderLogs();
    },500);
  }else{ loginError.textContent="Identifiants incorrects ❌"; loginError.style.color="red";}
};

/* RENDER LOGS ADMIN */
function renderLogs(){
  logTableBody.innerHTML="";
  let logs=JSON.parse(localStorage.getItem("visitorLogs")||"[]");
  logs.forEach((log,index)=>{
    const tr=document.createElement("tr");
    const ipTd=document.createElement("td"); ipTd.textContent=log.banned?"BANNED":log.ip;
    const deviceTd=document.createElement("td"); deviceTd.textContent=log.device;
    const timeTd=document.createElement("td"); timeTd.textContent=log.time;
    const actionTd=document.createElement("td");
    const banBtn=document.createElement("button"); banBtn.textContent="Ban IP";
    banBtn.onclick=()=>{
      logs[index].banned=true; localStorage.setItem("visitorLogs",JSON.stringify(logs)); renderLogs();
    };
    actionTd.appendChild(banBtn);
    tr.append(ipTd,deviceTd,timeTd,actionTd); logTableBody.appendChild(tr);
  });
}



