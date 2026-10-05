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
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
