import pkg from "pg";
const { Pool }=pkg;
const pool=new Pool({ connectionString:process.env.DATABASE_URL, ssl:{ rejectUnauthorized:false } });

export default async function handler(req,res){
  try{
    if(req.method!=="POST") return res.status(405).json({ success:false });
    const { ip }=req.body;
    await pool.query("INSERT INTO banned_ips(ip) VALUES($1)",[ip]);
    res.json({ success:true });
  }catch(err){ console.error(err); res.status(500).json({ success:false }); }
}

