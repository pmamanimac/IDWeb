const express = require("express");
const cursoRoutes = require("./routes/cursoRoutes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracion = Date.now() - inicio;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${duracion}ms`,
    );
  });
  next();
});

app.use("/api/cursos", cursoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ status: "error", message: "Error interno del servidor" });
});

app.listen(3000, () => console.log("API Express en puerto 3000"));
