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
  // User selector
  const userSelector = document.querySelector(".user-selector");
  if (userSelector) {
    userSelector.addEventListener("change", async (e) => {
      const userId = parseInt(e.target.value);
      todoContainer.setCurrentUser(userId);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  }

  // Add todo button click
  const addBtn = document.querySelector(".add-todo-btn");
  const inputField = document.querySelector(".add-todo-input");
  const assignedToSelect = document.querySelector(".task-assigned-to");
  const categorySelect = document.querySelector(".task-category");
  const prioritySelect = document.querySelector(".task-priority");

  if (addBtn && inputField) {
    addBtn.addEventListener("click", async () => {
      const text = inputField.value;
      const assignedTo = assignedToSelect ? parseInt(assignedToSelect.value) : todoContainer.currentUserId;
      const categoryId = categorySelect ? parseInt(categorySelect.value) : 1;
      const priority = prioritySelect ? prioritySelect.value : "medium";

      if (text.trim()) {
        await todoContainer.addTodoItem({
          text: text,
          assignedTo: assignedTo,
          categoryId: categoryId,
          priority: priority
        });
        app.innerHTML = todoContainer.render();
        setupEventListeners();
      }
    });

    inputField.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const text = inputField.value;
        const assignedTo = assignedToSelect ? parseInt(assignedToSelect.value) : todoContainer.currentUserId;
        const categoryId = categorySelect ? parseInt(categorySelect.value) : 1;
        const priority = prioritySelect ? prioritySelect.value : "medium";

        if (text.trim()) {
          await todoContainer.addTodoItem({
            text: text,
            assignedTo: assignedTo,
            categoryId: categoryId,
            priority: priority
          });
          app.innerHTML = todoContainer.render();
          setupEventListeners();
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
      const currentText = btn.getAttribute("data-text");
      const newText = prompt("Edit task:", currentText);
      if (newText !== null && newText.trim()) {
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
