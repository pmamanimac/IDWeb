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
            <span>${task.text}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Eliminar</button>
        `;
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
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
