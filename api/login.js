import jwt from "jsonwebtoken";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { user, pass } = req.body;
    if (!user || !pass) return res.status(400).json({ success: false });

    const result = await pool.query(
      "SELECT * FROM admins WHERE username=$1 AND password=$2",
      [user, pass]
    );

    if (result.rows.length === 0)
      return res.json({ success: false, msg: "Identifiants incorrects" });

    const token = jwt.sign({ user }, process.env.SECRET_KEY);
    return res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Erreur serveur" });
  }
}


