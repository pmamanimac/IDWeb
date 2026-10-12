const express = require("express");
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
