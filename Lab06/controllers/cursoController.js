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

exports.createCurso = (req, res) => {
  const { nombre, codigo, creditos } = req.body;

  if (!nombre || !codigo || !creditos) {
    return res
      .status(400)
      .json({ status: "fail", message: "Faltan campos obligatorios" });
  }

  const nuevoCurso = {
    id: cursos.length > 0 ? cursos[cursos.length - 1].id + 1 : 1,
    nombre,
    codigo,
    creditos: Number(creditos),
  };

  cursos.push(nuevoCurso);
  res.status(201).json({ status: "success", data: nuevoCurso });
};

exports.updateCurso = (req, res) => {
  const curso = cursos.find((c) => c.id === Number(req.params.id));

  if (!curso) {
    return res
      .status(404)
      .json({ status: "fail", message: "Curso no encontrado" });
  }

  const { nombre, codigo, creditos } = req.body;

  if (nombre) curso.nombre = nombre;
  if (codigo) curso.codigo = codigo;
  if (creditos) curso.creditos = Number(creditos);

  res.status(200).json({ status: "success", data: curso });
};

exports.deleteCurso = (req, res) => {
  const index = cursos.findIndex((c) => c.id === Number(req.params.id));

  if (index === -1) {
    return res
      .status(404)
      .json({ status: "fail", message: "Curso no encontrado" });
  }

  cursos.splice(index, 1);
  res
    .status(200)
    .json({ status: "success", message: "Curso eliminado correctamente" });
};
