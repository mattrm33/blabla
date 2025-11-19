import jwt from 'jsonwebtoken';
import { Client } from "pg";
const SECRET="TON_SECRET_KEY";
const client=new Client({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
await client.connect();

export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).end();
  const auth=req.headers.authorization;
  if(!auth) return res.status(401).end();
  try{
    const token=auth.split(" ")[1];
    jwt.verify(token,SECRET);
    const {ip}=req.body;
    await client.query("UPDATE visitors SET banned=true WHERE ip=$1",[ip]);
    res.status(200).json({success:true});
  }catch(e){ res.status(401).end(); }
}
