import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.js";
import programRoutes from "./routes/program.js";
import planRoutes from "./routes/plan.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api", userRoutes);
app.use("/api", programRoutes);
app.use("/api", planRoutes);

app.listen(port, () => {
  console.log(`Servidor Node.js rodando em http://localhost:${port}`);
  console.log(`Acesse o front-end em http://localhost:3000/index.html`);
});
