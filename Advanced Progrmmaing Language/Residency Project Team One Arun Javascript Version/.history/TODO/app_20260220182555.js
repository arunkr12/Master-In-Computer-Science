import ToDoContainer from "./ToDoContainer/ToDoContainer.js";

// Initialize the app
const app = document.getElementById("app");
const todoContainer = new ToDoContainer();

// Render the app
app.innerHTML = todoContainer.render();
