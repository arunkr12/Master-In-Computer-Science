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
    // UI listener: user dropdown change
    userSelector.addEventListener("change", async (e) => {
      const userId = parseInt(
        /** @type {HTMLSelectElement} */ (e.target).value,
      );
      todoContainer.setCurrentUser(userId);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  }

  // Add todo button click
  const addBtn = document.querySelector(".add-todo-btn");
  const inputField = /** @type {HTMLInputElement} */ (
    document.querySelector(".add-todo-input")
  );
  const assignedToSelect = /** @type {HTMLSelectElement} */ (
    document.querySelector(".task-assigned-to")
  );
  const categorySelect = /** @type {HTMLSelectElement} */ (
    document.querySelector(".task-category")
  );
  const prioritySelect = /** @type {HTMLSelectElement} */ (
    document.querySelector(".task-priority")
  );

  if (addBtn && inputField) {
    // UI listener: Add Task button click
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

    // UI listener: Enter key in task input
    inputField.addEventListener("keypress", async (e) => {
      if (/** @type {KeyboardEvent} */ (e).key === "Enter") {
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
    // UI listener: delete task button
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
    // UI listener: edit task button
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      const currentText = btn.getAttribute("data-text") || "";

      const row = btn.closest("[data-todo-id]");
      if (!row) return;

      // prevent opening multiple editors for same row
      if (row.querySelector(".edit-input")) return;

      const textSpan = /** @type {HTMLElement} */ (
        row.querySelector(".todo-text")
      );
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
      /** @type {HTMLButtonElement} */ (btn).title = "Save";
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
        /** @type {HTMLButtonElement} */ (btn).title = "Edit";
        btn.classList.remove("save-btn");
        // rebind listeners by re-running setupEventListeners
        // (we don't re-render here to keep existing state)
        setupEventListeners();
      };

      // UI listener: save edited task
      btn.addEventListener("click", saveHandler, { once: true });
      // UI listener: cancel edit
      cancelBtn.addEventListener("click", cancelHandler, { once: true });

      // allow Enter to save and Escape to cancel
      // UI listener: keyboard shortcuts while editing
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

  // Toggle buttons
  const toggleButtons = document.querySelectorAll(".todo-toggle");
  toggleButtons.forEach((btn) => {
    // UI listener: finish/undo task button
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.getAttribute("data-id"));
      await todoContainer.toggleTodoItem(id);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  });

  // Category buttons (filtering)
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    // UI listener: category filter button
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.getAttribute("data-id")) || 0;
      todoContainer.setSelectedCategory(id);
      app.innerHTML = todoContainer.render();
      setupEventListeners();
    });
  });
}

// Initialize the app
initializeApp();
