import ToDoContainer from "./ToDoContainer/ToDoContainer.js";

// Initialize the app
const app = document.getElementById("app");
const todoContainer = new ToDoContainer();

// Load todos from JSON Server and render the app
async function initializeApp() {
  await todoContainer.initialize();
  app.innerHTML = todoContainer.render();
  setupEventListeners();
}

function setupEventListeners() {
  // Add todo button click
  const addBtn = document.querySelector(".add-todo-btn");
  const inputField = document.querySelector(".add-todo-input");

  if (addBtn) {
    addBtn.addEventListener("click", async () => {
      const text = inputField.value;
      if (text.trim()) {
        await todoContainer.addTodoItem(text);
        app.innerHTML = todoContainer.render();
        setupEventListeners();
        inputField.value = "";
      }
    });

    inputField.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const text = inputField.value;
        if (text.trim()) {
          await todoContainer.addTodoItem(text);
          app.innerHTML = todoContainer.render();
          setupEventListeners();
          inputField.value = "";
        }
      }
    });
  }

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.getAttribute("data-id"));
      await todoContainer.deleteTodoItem(id);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  });

  // Edit buttons
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const newText = prompt("Edit task:");
      if (newText) {
        await todoContainer.editTodoItem(id, newText);
        app.innerHTML = todoContainer.render();
        setupEventListeners();
      }
    });
  });

  // Toggle checkboxes
  const checkboxes = document.querySelectorAll(".todo-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      const id = parseInt(checkbox.getAttribute("data-id"));
      await todoContainer.toggleTodoItem(id);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  });
}

// Initialize the app when DOM is ready
initializeApp();
