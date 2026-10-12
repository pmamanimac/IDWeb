let cursos = require("../data/cursos.json");

exports.getAllCursos = (req, res) => {
  const { creditos } = req.query;
  let resultado = cursos;

  if (creditos) {
    resultado = cursos.filter((c) => c.creditos === Number(creditos));
  }

  res.status(200).json({ status: "success", data: resultado });
};
