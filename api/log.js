import { Client } from "pg";
const client=new Client({ connectionString: process.env.DATABASE_URL, ssl:{rejectUnauthorized:false} });
await client.connect();

export default async function handler(req,res){
  if(req.method==="POST"){
    const {device}=req.body;
    const ip=req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const time=new Date();
    await client.query("INSERT INTO visitors(ip,device,time,banned) VALUES($1,$2,$3,false)",[ip,device,time]);
    res.status(200).json({success:true});
  }
}
