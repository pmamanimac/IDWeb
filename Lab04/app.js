// app.js - Módulo de Gestión

const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const cursoInput = document.querySelector("#curso-input");
const fechaInput = document.querySelector("#fecha-input");
const alertContainer = document.querySelector("#alert-container");
const filterButtons = document.querySelectorAll("[data-filtro]");
let filtroActual = "todas";

//Arreglo global de objetos Tarea
let tasks = JSON.parse(localStorage.getItem("tasks")) || [
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

// Métodos iterativos ES6+ (movidos arriba para evitar error de orden)
const obtenerPendientes = () => tasks.filter((task) => !task.completada);
const obtenerCompletadas = () => tasks.filter((task) => task.completada);
const obtenerTitulos = () => tasks.map((task) => task.titulo);
const marcarCompletada = (id) =>
  tasks.map((task) => (task.id === id ? { ...task, completada: true } : task));
const buscarTareaPorId = (id) => tasks.find((task) => task.id === id);
const contarCompletadas = () =>
  tasks.reduce((total, task) => (task.completada ? total + 1 : total), 0);
const agruparPorCurso = () =>
  tasks.reduce((grupos, task) => {
    grupos[task.curso] = grupos[task.curso] || [];
    grupos[task.curso].push(task);
    return grupos;
  }, {});

// Alertas dinámicas
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

// --> Función centralizada de persistencia
function guardarTareas() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

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

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completada: !task.completada } : task,
  );
  guardarTareas();
  renderTasks();
}

// Eliminar tarea
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  guardarTareas();
  renderTasks();
}

//Intercepta el submit y valida
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
  guardarTareas();

  input.value = "";
  cursoInput.value = "";
  fechaInput.value = "";

  renderTasks();
});

//Filtro visual Todas / Pendientes / Completadas
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroActual = btn.dataset.filtro;

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

renderTasks();
