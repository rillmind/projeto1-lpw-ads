import { dbPromise } from "../db/db.js";

async function getAllPlans(req, res) {
  try {
    const db = await dbPromise;
    const plans = await db.all("SELECT * FROM plans");
    const parsedPlans = plans.map((plan) => ({
      ...plan,
      features: JSON.parse(plan.features),
    }));
    res.status(200).json(parsedPlans);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar planos." });
  }
}

export { getAllPlans };
