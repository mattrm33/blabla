import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(), 'api', 'data.json');

export default function handler(req,res){
  const data = JSON.parse(fs.readFileSync(filePath,'utf8'));

  const ADMINS = [
    { user: "admin1", pass: "1234" },
    { user: "admin2", pass: "1234" },
    { user: "admin3", pass: "1234" }
  ];

  const { user, pass } = req.headers;
  const isAdmin = ADMINS.find(a => a.user===user && a.pass===pass);
  if(!isAdmin) return res.status(401).json({error:"Unauthorized"});

  if(req.method==='GET'){
    return res.status(200).json(data.logs);
  }
  res.status(405).json({error:"Méthode non autorisée"});
}
