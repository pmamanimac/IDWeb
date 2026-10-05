// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

function obtenerContentType(filePath) {
  const ext = path.extname(filePath);
  const tipos = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
  };
  return tipos[ext] || "text/plain";
}
const server = http.createServer((req, res) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  if (req.method === "GET" && !req.url.startsWith("/api")) {
    const urlPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(__dirname, "public", urlPath);

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Recurso no encontrado" }));
      } else {
        res.writeHead(200, { "Content-Type": obtenerContentType(filePath) });
        res.end(content);
      }
    });
  } else if (req.url === "/api/estudiantes" && req.method === "GET") {
    const dataPath = path.join(__dirname, "data", "estudiantes.json");

    fs.readFile(dataPath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Error al leer los datos" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
  } else if (req.url === "/api/estudiantes" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const dataPath = path.join(__dirname, "data", "estudiantes.json");

      fs.readFile(dataPath, "utf-8", (err, data) => {
        const estudiantes = err ? [] : JSON.parse(data);
        const nuevoEstudiante = JSON.parse(body);
        nuevoEstudiante.id = Date.now();
        estudiantes.push(nuevoEstudiante);

        fs.writeFile(
          dataPath,
          JSON.stringify(estudiantes, null, 2),
          (errEscritura) => {
            if (errEscritura) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ message: "Error al guardar el estudiante" }),
              );
            } else {
              res.writeHead(201, { "Content-Type": "application/json" });
              res.end(JSON.stringify(nuevoEstudiante));
            }
          },
        );
      });
    });
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
