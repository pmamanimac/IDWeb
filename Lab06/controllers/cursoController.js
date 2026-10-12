let cursos = require("../data/cursos.json");

exports.getAllCursos = (req, res) => {
  const { creditos } = req.query;
  let resultado = cursos;

  if (creditos) {
    resultado = cursos.filter((c) => c.creditos === Number(creditos));
  }

  res.status(200).json({ status: "success", data: resultado });
};

exports.getCursoById = (req, res) => {
  const curso = cursos.find((c) => c.id === Number(req.params.id));

  if (!curso) {
    return res
      .status(404)
      .json({ status: "fail", message: "Curso no encontrado" });
  }

  res.status(200).json({ status: "success", data: curso });
};
