// /api/logs.js
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const logs = await pool.query("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100");
      res.json({ logs: logs.rows });
    } 
    else if (req.method === "POST") {
      const { ip, user_agent } = req.body;
      await pool.query(
        "INSERT INTO logs(ip,user_agent) VALUES($1,$2)",
        [ip, user_agent]
      );
      res.json({ success: true });
    } 
    else if (req.method === "DELETE") {
      await pool.query("DELETE FROM logs");
      res.json({ success: true });
    } 
    else res.status(405).json({ success: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
