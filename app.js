/* Carrousel images */
.carousel { position: relative; overflow: hidden; }
.carousel img { width:100%; height:200px; object-fit:cover; transition: opacity 0.5s; position:absolute; top:0; left:0; opacity:0; }
.carousel img.active { opacity:1; }

/* Admin panel */
#adminPanel { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.65); justify-content:center; align-items:center; }
#adminPanel .modal-content { background:#fff; padding:30px; width:400px; border-radius:10px; box-shadow:0 5px 20px rgba(0,0,0,0.3); position:relative; }
#adminPanel input, #adminPanel textarea { width:100%; padding:10px; margin:10px 0; border:1px solid #bbb; border-radius:5px; }
#adminPanel button { width:100%; padding:10px; background:#0073ff; border:none; color:#fff; border-radius:5px; cursor:pointer; font-weight:bold; }
#adminPanel button:hover { background:#0056bd; }
.close-admin { position:absolute; top:10px; right:10px; cursor:pointer; font-size:20px; }
