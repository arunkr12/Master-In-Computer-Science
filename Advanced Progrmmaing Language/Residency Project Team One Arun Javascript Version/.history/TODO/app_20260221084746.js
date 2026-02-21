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
      const assignedTo = assignedToSelect
        ? parseInt(assignedToSelect.value)
        : todoContainer.currentUserId;
      const categoryId = categorySelect ? parseInt(categorySelect.value) : 1;
      const priority = prioritySelect ? prioritySelect.value : "medium";

      if (text.trim()) {
        await todoContainer.addTodoItem({
          text: text,
          assignedTo: assignedTo,
          categoryId: categoryId,
          priority: priority,
        });
        app.innerHTML = todoContainer.render();
        setupEventListeners();
      }
    });

    inputField.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const text = inputField.value;
        const assignedTo = assignedToSelect
          ? parseInt(assignedToSelect.value)
          : todoContainer.currentUserId;
        const categoryId = categorySelect ? parseInt(categorySelect.value) : 1;
        const priority = prioritySelect ? prioritySelect.value : "medium";

        if (text.trim()) {
          await todoContainer.addTodoItem({
            text: text,
            assignedTo: assignedTo,
            categoryId: categoryId,
            priority: priority,
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
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      const currentText = btn.getAttribute("data-text") || "";

      const row = btn.closest("[data-todo-id]");
      if (!row) return;

      // prevent opening multiple editors for same row
      if (row.querySelector(".edit-input")) return;

      const textSpan = row.querySelector(".todo-text");
      if (!textSpan) return;

      // hide text and insert input
      textSpan.style.display = "none";
      const input = document.createElement("input");
      input.type = "text";
      input.className = "edit-input form-control";
      input.value = currentText;
      input.style.marginBottom = "0.25rem";

      // place input just after the text span
      textSpan.parentNode.insertBefore(input, textSpan.nextSibling);

      // change edit button to Save and add Cancel button
      const buttonsContainer = btn.parentElement;
      if (!buttonsContainer) return;

      const originalEditHTML = btn.innerHTML;
      btn.innerHTML = "💾";
      btn.title = "Save";
      btn.classList.add("save-btn");

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "cancel-edit-btn";
      cancelBtn.style.cssText =
        "background:#6c757d;color:white;border:none;padding:0.4rem 0.6rem;border-radius:4px;cursor:pointer;font-size:0.75rem;margin-left:0.3rem;font-weight:bold;";
      cancelBtn.textContent = "✖";
      cancelBtn.title = "Cancel";
      buttonsContainer.appendChild(cancelBtn);

      // Save handler
      const saveHandler = async () => {
        const newText = input.value;
        if (newText !== null && newText.trim()) {
          await todoContainer.editTodoItem(id, newText.trim());
          app.innerHTML = todoContainer.render();
          setupEventListeners();
        }
      };

      // Cancel handler
      const cancelHandler = () => {
        // remove input and cancel button, restore text and edit button
        input.remove();
        cancelBtn.remove();
        textSpan.style.display = "block";
        btn.innerHTML = originalEditHTML;
        btn.title = "Edit";
        btn.classList.remove("save-btn");
        // rebind listeners by re-running setupEventListeners
        // (we don't re-render here to keep existing state)
        setupEventListeners();
      };

      btn.addEventListener("click", saveHandler, { once: true });
      cancelBtn.addEventListener("click", cancelHandler, { once: true });

      // allow Enter to save and Escape to cancel
      input.addEventListener("keydown", (ke) => {
        if (ke.key === "Enter") {
          saveHandler();
        } else if (ke.key === "Escape") {
          cancelHandler();
        }
      });
      // focus input for quick editing
      input.focus();
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
