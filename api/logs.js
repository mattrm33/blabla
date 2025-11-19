import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    if(req.method === "GET") {
      const logs = await pool.query("SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100");
      // ici tu peux aussi compter commandes si tu veux
      res.json({ logs: logs.rows, orders: 0 });
    }
    else if(req.method === "DELETE") {
      await pool.query("DELETE FROM logs");
      res.json({ success:true });
    } else res.status(405).send("Method not allowed");
  } catch(err) {
    console.error(err);
    res.status(500).json({ success:false });
  }
}
