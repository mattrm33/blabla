import pkg from 'pg';
import jwt from 'jsonwebtoken';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const SECRET_KEY = process.env.SECRET_KEY || "changeme";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});

  const { user, pass } = req.body;
  if(!user || !pass) return res.status(400).json({success:false, message:"User or pass missing"});

  try {
    const query = await pool.query("SELECT * FROM admins WHERE username=$1 AND password=$2", [user, pass]);
    if(query.rows.length === 0) return res.json({success:false});

    const token = jwt.sign({username:user}, SECRET_KEY, {expiresIn:"4h"});
    return res.json({success:true, token});
  } catch(err) {
    console.error(err);
    return res.status(500).json({success:false, message:"Server error"});
  }
}

