import jwt from 'jsonwebtoken';
import { Client } from "pg";
const SECRET="TON_SECRET_KEY";
const client=new Client({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
await client.connect();

export default async function handler(req,res){
  const auth=req.headers.authorization;
  if(!auth) return res.status(401).end();
  try{
    const token=auth.split(" ")[1];
    jwt.verify(token,SECRET);
    const result=await client.query("SELECT ip,device,time,banned FROM visitors ORDER BY time DESC");
    res.status(200).json(result.rows);
  }catch(e){ res.status(401).end(); }
}
