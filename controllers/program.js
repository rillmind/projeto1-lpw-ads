import { dbPromise } from "../db/db.js";

async function getAllPrograms(req, res) {
  try {
    const db = await dbPromise;
    const programs = await db.all("SELECT * FROM programs");
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar programas." });
  }
}

export { getAllPrograms };
