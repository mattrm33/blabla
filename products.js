import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'api', 'data.json');

export default function handler(req, res) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Auth
  const ADMINS = [
    { user: "admin1", pass: "1234" },
    { user: "admin2", pass: "1234" },
    { user: "admin3", pass: "1234" }
  ];

  const { user, pass } = req.headers;

  const isAdmin = ADMINS.find(a => a.user === user && a.pass === pass);

  if(req.method === 'GET'){
    return res.status(200).json(data.products);
  }

  if(!isAdmin) return res.status(401).json({ error:"Unauthorized" });

  if(req.method === 'POST'){
    const newProd = {...req.body, id:Date.now()};
    data.products.push(newProd);
    data.logs.push({admin:user, action:`Ajout produit ${newProd.name}`, date:new Date()});
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));
    return res.status(201).json(newProd);
  }

  if(req.method === 'PUT'){
    const prod = data.products.find(p=>p.id==req.body.id);
    if(!prod) return res.status(404).json({error:"Produit non trouvé"});
    Object.assign(prod, req.body);
    data.logs.push({admin:user, action:`Modification produit ${prod.name}`, date:new Date()});
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));
    return res.status(200).json(prod);
  }

  if(req.method === 'DELETE'){
    const index = data.products.findIndex(p=>p.id==req.body.id);
    if(index===-1) return res.status(404).json({error:"Produit non trouvé"});
    const removed = data.products.splice(index,1)[0];
    data.logs.push({admin:user, action:`Suppression produit ${removed.name}`, date:new Date()});
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));
    return res.status(200).json(removed);
  }

  res.status(405).json({error:"Méthode non autorisée"});
}

