import { dbPromise } from "./db.js";

async function setupDatabase() {
  const db = await dbPromise;

  console.log("Iniciando configuração do banco de dados...");
  await db.exec("BEGIN TRANSACTION");

  try {
    await db.exec(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        member_since TEXT,
        current_weight REAL,
        last_workout TEXT,
        calories_burned_month INTEGER,
        classes_attended_month INTEGER,
        next_workout_name TEXT,
        next_workout_day TEXT,
        next_workout_time TEXT,
        next_workout_teacher TEXT,
        recent_activities TEXT
      );`,
    );

    await db.exec(
      `CREATE TABLE IF NOT EXISTS programs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, lessons INTEGER NOT NULL, image_url TEXT NOT NULL);`,
    );
    await db.exec(
      `CREATE TABLE IF NOT EXISTS plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, price REAL NOT NULL, original_price REAL, loyalty_period INTEGER, features TEXT, is_most_advantageous BOOLEAN DEFAULT 0);`,
    );
    console.log("Tabelas verificadas/criadas com sucesso.");

    const userCount = await db.get("SELECT COUNT(id) as count FROM users;");
    if (userCount.count === 0) {
      const fakeUserData = {
        name: "Raul Holanda",
        email: "raul@email.com",
        password: "senha123",
        member_since: "15/03/2024",
        current_weight: 78.3,
        last_workout: "Corrida e Movimento",
        calories_burned_month: 1723,
        classes_attended_month: 10,
        next_workout_name: "Musculação - Treino A",
        next_workout_day: "Quinta-feira",
        next_workout_time: "19h",
        next_workout_teacher: "Ana Paula",
        recent_activities: JSON.stringify([
          "Você completou o treino de pernas. (Há 2 dias)",
          "Nova meta de hidratação definida: 3L/dia. (Há 3 dias)",
          "Participou da aula de Zumba. (Há 4 dias)",
        ]),
      };

      await db.run(
        `INSERT INTO users (
          name, email, password, member_since, current_weight, last_workout,
          calories_burned_month, classes_attended_month, next_workout_name,
          next_workout_day, next_workout_time, next_workout_teacher, recent_activities
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        fakeUserData.name,
        fakeUserData.email,
        fakeUserData.password,
        fakeUserData.member_since,
        fakeUserData.current_weight,
        fakeUserData.last_workout,
        fakeUserData.calories_burned_month,
        fakeUserData.classes_attended_month,
        fakeUserData.next_workout_name,
        fakeUserData.next_workout_day,
        fakeUserData.next_workout_time,
        fakeUserData.next_workout_teacher,
        fakeUserData.recent_activities,
      );
      console.log(
        "Tabela 'users' populada com um usuário de exemplo completo.",
      );
    }

    const programCount = await db.get(
      "SELECT COUNT(id) as count FROM programs;",
    );
    if (programCount.count === 0) {
      const programsData = [
        { name: "Bora pro combate", lessons: 8, image_url: "./img/box.png" },
        {
          name: "Corrida e movimento",
          lessons: 4,
          image_url: "./img/corrida.png",
        },
        { name: "Flex e Relax", lessons: 11, image_url: "./img/yoga.png" },
        { name: "Foco e Cardio", lessons: 15, image_url: "./img/yoga2.png" },
        { name: "Foco e Força", lessons: 12, image_url: "./img/crossfit.png" },
      ];
      for (const program of programsData) {
        await db.run(
          "INSERT INTO programs (name, lessons, image_url) VALUES (?, ?, ?)",
          program.name,
          program.lessons,
          program.image_url,
        );
      }
      console.log("Tabela 'programs' populada.");
    }

    const planCount = await db.get("SELECT COUNT(id) as count FROM plans;");
    if (planCount.count === 0) {
      const plansData = [
        {
          name: "Plano Grey",
          description: "Treine quando quiser, qualquer dia, qualquer hora.",
          price: 119.99,
          original_price: 149.99,
          loyalty_period: 12,
          is_most_advantageous: true,
          features: JSON.stringify([
            { text: "Todos os 7 dias da semana", allowed: true },
            { text: "Quantas vezes por dia quiser", allowed: true },
            { text: "Trazer convidados até 5 vezes por mês", allowed: true },
            { text: "Cadeira de massagem", allowed: true },
            { text: "KS GO (treinos online) no app", allowed: true },
            { text: "Área de musculação e aeróbico", allowed: true },
          ]),
        },
        {
          name: "Plano Padrão",
          description: "Treine de segunda a sexta, uma vez por dia.",
          price: 99.99,
          original_price: 119.99,
          loyalty_period: 12,
          is_most_advantageous: false,
          features: JSON.stringify([
            { text: "Todos os 7 dias da semana", allowed: false },
            { text: "Treine quantas vezes por dia quiser", allowed: false },
            { text: "Trazer convidados até 5 vezes por mês", allowed: false },
            { text: "Cadeira de massagem", allowed: false },
            { text: "KS GO (treinos online) no app", allowed: true },
            { text: "Área de musculação e aeróbico", allowed: true },
          ]),
        },
        {
          name: "Plano Mínimo",
          description:
            "Treine 3 vezes na semana, uma vez por dia, sem convidados.",
          price: 79.99,
          original_price: 109.99,
          loyalty_period: 12,
          is_most_advantageous: false,
          features: JSON.stringify([
            { text: "Todos os 7 dias da semana", allowed: false },
            { text: "Treine quantas vezes por dia quiser", allowed: false },
            { text: "Trazer convidados até 5 vezes por mês", allowed: false },
            { text: "Cadeira de massagem", allowed: false },
            { text: "KS GO (treinos online) no app", allowed: true },
            { text: "Área de musculação e aeróbico", allowed: true },
          ]),
        },
      ];
      for (const plan of plansData) {
        await db.run(
          "INSERT INTO plans (name, description, price, original_price, loyalty_period, features, is_most_advantageous) VALUES (?, ?, ?, ?, ?, ?, ?)",
          plan.name,
          plan.description,
          plan.price,
          plan.original_price,
          plan.loyalty_period,
          plan.features,
          plan.is_most_advantageous,
        );
      }
      console.log("Tabela 'plans' populada com todos os 3 planos.");
    }

    await db.exec("COMMIT");
    console.log("Configuração do banco de dados concluída com sucesso.");
  } catch (error) {
    await db.exec("ROLLBACK");
    console.error("Erro na configuração do banco:", error);
  }
}

setupDatabase();
