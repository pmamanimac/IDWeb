// app.js - Módulo de Gestión
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

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
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
            <span>${task.titulo}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Eliminar</button>
        `;
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    titulo: text,
    curso: "Sin curso",
    fechaEntrega: "",
    completada: false,
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  input.value = "";
  renderTasks();
});

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

document.addEventListener("DOMContentLoaded", renderTasks);

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
