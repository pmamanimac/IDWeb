// app.js - Módulo de Gestión
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const cursoInput = document.querySelector("#curso-input");
const fechaInput = document.querySelector("#fecha-input");
const alertContainer = document.querySelector("#alert-container");
const filterButtons = document.querySelectorAll("[data-filtro]");
let filtroActual = "todas";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  // Arreglo global de objetos Tarea
  {
    id: 1,
    titulo: "Entregar informe de limites",
    curso: "Calculo en una variable",
    fechaEntrega: "2026-10-05",
    completada: false,
  },
  {
    id: 2,
    titulo: "Repasar Flexbox y Grid",
    curso: "Desarrollo web",
    fechaEntrega: "2026-10-10",
    completada: true,
  },
];

function renderTasks() {
  list.innerHTML = "";

  let tareasFiltradas = tasks;
  if (filtroActual === "pendientes") {
    tareasFiltradas = obtenerPendientes();
  } else if (filtroActual === "completadas") {
    tareasFiltradas = obtenerCompletadas();
  }

  tareasFiltradas.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
            <div class="${task.completada ? "text-decoration-line-through text-muted" : ""}">
                <strong>${task.titulo}</strong><br>
                <small>${task.curso} - Entrega: ${task.fechaEntrega}</small>
            </div>
            <div>
                <span class="badge bg-${task.completada ? "success" : "warning"} me-2">
                    ${task.completada ? "Completada" : "Pendiente"}
                </span>
                <button class="btn btn-outline-secondary btn-sm me-1" onclick="toggleTask(${task.id})">
                    ${task.completada ? "Marcar pendiente" : "Marcar completada"}
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">
                    Eliminar
                </button>
            </div>
        `;

    list.appendChild(li);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroActual = btn.dataset.filtro;

    // Actualizar clase "active" en los botones
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});
// Alternar estado completada/pendiente

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completada: !task.completada } : task,
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Intercepta el evento submit del formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = input.value.trim();
  const curso = cursoInput.value.trim();
  const fechaEntrega = fechaInput.value;

  if (!titulo || !curso || !fechaEntrega) {
    mostrarAlerta("Todos los campos son obligatorios.");
    return;
  }

  const hoy = new Date().toISOString().split("T")[0];
  if (fechaEntrega <= hoy) {
    mostrarAlerta("La fecha de entrega debe ser posterior a la fecha actual.");
    return;
  }

  limpiarAlerta();

  const nuevaTarea = {
    id: Date.now(),
    titulo,
    curso,
    fechaEntrega,
    completada: false,
  };

  tasks.push(nuevaTarea);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  cursoInput.value = "";
  fechaInput.value = "";

  renderTasks();
});

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

renderTasks();

//  Métodos iterativos ES6+ sobre el arreglo "tasks"

// filter: tareas pendientes
const obtenerPendientes = () => tasks.filter((task) => !task.completada);

// filter: tareas completadas
const obtenerCompletadas = () => tasks.filter((task) => task.completada);

// map: solo los títulos de las tareas
const obtenerTitulos = () => tasks.map((task) => task.titulo);

// map: marcar una tarea como completada según su id
const marcarCompletada = (id) =>
  tasks.map((task) => (task.id === id ? { ...task, completada: true } : task));

// find: buscar una tarea por su id
const buscarTareaPorId = (id) => tasks.find((task) => task.id === id);

// reduce: contar tareas completadas
const contarCompletadas = () =>
  tasks.reduce((total, task) => (task.completada ? total + 1 : total), 0);

// reduce: agrupar tareas por curso
const agruparPorCurso = () =>
  tasks.reduce((grupos, task) => {
    grupos[task.curso] = grupos[task.curso] || [];
    grupos[task.curso].push(task);
    return grupos;
  }, {});

function mostrarAlerta(mensaje) {
  alertContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${mensaje}
        </div>
    `;
}

function limpiarAlerta() {
  alertContainer.innerHTML = "";
}
