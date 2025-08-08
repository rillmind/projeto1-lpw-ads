import { dbPromise } from "../db/db.js";

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios." });
  }
  try {
    const db = await dbPromise;
    const memberSince = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const result = await db.run(
      "INSERT INTO users (name, email, password, member_since) VALUES (?, ?, ?, ?)",
      name,
      email,
      password,
      memberSince,
    );
    res.status(201).json({ id: result.lastID, name, email });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ error: "Este email já está cadastrado." });
    }
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }
  try {
    const db = await dbPromise;
    const user = await db.get("SELECT * FROM users WHERE email = ?", email);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Senha incorreta." });
    }
    res.status(200).json({
      message: "Login bem-sucedido!",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}

async function getUserProfile(req, res) {
  const { id } = req.params;
  try {
    const db = await dbPromise;
    const userProfile = await db.get(
      `SELECT
        id, name, email, member_since, current_weight, last_workout,
        calories_burned_month, classes_attended_month, next_workout_name,
        next_workout_day, next_workout_time, next_workout_teacher,
        recent_activities
       FROM users WHERE id = ?`,
      id,
    );
    if (!userProfile) {
      return res
        .status(404)
        .json({ error: "Perfil de usuário não encontrado." });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil do usuário." });
  }
}

export { registerUser, loginUser, getUserProfile };
