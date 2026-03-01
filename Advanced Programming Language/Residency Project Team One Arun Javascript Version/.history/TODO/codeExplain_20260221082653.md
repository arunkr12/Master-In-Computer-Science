# Code Explanation

This file explains the application code starting from the entry point (`index.html`) and follows the execution flow through `app.js`, `ToDoContainer`, `ToDoList`, and `AddTodo`. Each code line or logical group of lines is explained so you can trace how the HTML is rendered and how JS manipulates the DOM.

---

**Entry Point: `index.html`**

```html
<!doctype html>
```

- Declares the document type as HTML5; tells the browser to render using standards mode.

```html
<html lang="en"></html>
```

- Root element of the document; `lang="en"` helps accessibility and language-aware tools.

```html
<head></head>
```

- Document head; contains metadata, title, styles and other resources.

```html
<meta charset="UTF-8" />
```

- Declares character encoding (UTF-8) for correct text rendering.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

- Ensures correct scaling on mobile devices; sets the viewport width to device width.

```html
<title>TODO App</title>
```

- Page title shown in browser tab.

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
```

- Loads Bootstrap CSS from CDN to use its grid and utilities for layout and styling.

```html
<link href="https://cdn.tailwindcss.com" rel="stylesheet" />
```

- Loads Tailwind CSS (note: linking CDN like this loads Tailwind runtime utilities); used for additional styling.

```html
<style>
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  main {
    flex: 1;
  }
  footer {
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
  }
</style>
```

- Inline styles to make the page use a column layout, ensure main fills available height, and style footer.

```html
  </head>
  <body>
```

- Closes head and opens body — the renderable content goes here.

```html
<div id="app"></div>
```

- The single application root container. `app.js` will select this element by ID and inject rendered HTML (client-side rendering).

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

- Loads Bootstrap JS bundle (optional for interactive Bootstrap components).

```html
<script type="module" src="app.js"></script>
```

- Loads the main JavaScript entry file `app.js` as an ES module. Because it's `type="module"`, imports inside `app.js` will be handled by the browser.

```html
  </body>
</html>
```

- Closes body and html.

---

**Main script: `app.js`**

This file bootstraps the client app. It imports the main container, attaches it to the DOM, initializes data from the JSON server, and sets up event listeners.

```javascript
import ToDoContainer from "./ToDoContainer/ToDoContainer.js";
```

- Imports default export (`ToDoContainer`) from the specified module. Because `index.html` uses `type="module"`, the browser supports this import.

```javascript
// Initialize the app
const app = document.getElementById("app");
const todoContainer = new ToDoContainer();
```

- `app` is the DOM element where the app will render. `todoContainer` is an instance of the component that manages UI state and data.

```javascript
async function initializeApp() {
  await todoContainer.initialize();
  app.innerHTML = todoContainer.render();
  setupEventListeners();
}
```

- `initializeApp` does three things:
  1. Calls `todoContainer.initialize()` to fetch data (users, categories, todos) and prepare subcomponents.
  2. Sets the `innerHTML` of `#app` to the HTML string returned by `todoContainer.render()`.
  3. Calls `setupEventListeners()` to wire DOM event handlers for user interactions.

```javascript
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
```

- `setupEventListeners` queries DOM elements by class and attaches event listeners. Example: when the `user-selector` (a select element) changes, it updates the current user in the container, re-renders the app HTML, and re-attaches listeners (because re-rendering replaces nodes).

```javascript
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
```

- Add-todo flow:
  - Queries the add button, input, and selects.
  - On button click (or Enter key), collects field values and calls `todoContainer.addTodoItem()`.
  - After the service call resolves, re-renders the UI and re-attaches event listeners.
  - Note: `todoContainer.addTodoItem()` handles the API call and local state update.

```javascript
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
```

- Delete flow: buttons have `data-id` attributes. On click, the id is read and passed to `todoContainer.deleteTodoItem()`. After deletion the UI re-renders.

```javascript
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
```

- Edit flow: opens a `prompt` pre-filled with current text; on confirmation calls `editTodoItem` and re-renders.

```javascript
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
```

- Toggle flow: checkboxes toggle `completed` on a task; the `toggleTodoItem` method handles the server update and local state.

```javascript
// Initialize the app when DOM is ready
initializeApp();
```

- Kicks off the application: fetches initial data and renders UI.

---

**`ToDoContainer/ToDoContainer.js`**

`ToDoContainer` orchestrates data fetching, component composition, concurrency handling, auto-refresh, and state updates. It composes the header, footer, todo list, add-todo form, stats, user selector, categories, and services.

Top imports (lines collapsed): it imports subcomponents and services:

- `Header`, `Footer`, `ToDoList`, `AddTodo`, `Stats`, `User`, `Category` — UI components that return HTML strings from `render()` methods.
- `TodoService` — abstraction over REST calls (`getTodos`, `addTodo`, `updateTodo`, `deleteTodo`, `getUsers`, `getCategories`).
- `ConcurrencyManager` & `RefreshManager` — manage optimistic concurrency/version cache and periodic refresh.

Class constructor sets up component instances and local state:

```javascript
this.header = new Header("TODO App", "Manage all your tasks efficiently");
this.footer = new Footer(2026, "TODO App");
this.todoList = new ToDoList();
this.addTodo = new AddTodo();
this.stats = new Stats();
this.user = new User();
this.category = new Category();
this.todoService = new TodoService();

this.concurrencyManager = new ConcurrencyManager();
this.refreshManager = new RefreshManager(this.todoService, 5000);

this.todos = [];
this.users = [];
this.categories = [];
this.currentUserId = 1;
this.remoteUpdateNotifications = [];
```

- Creates component instances and prepares arrays to hold remote data. `refreshManager` will poll the server every 5000 ms (5s).

`initialize()`:

- Fetches `users`, `categories`, and `todos` from `todoService`.
- Caches each todo's `version` in `concurrencyManager` to detect concurrent edits.
- Populates child components with data (via `setUsers`, `setCategories`, etc.).
- Subscribes to concurrency conflict and refresh events to push notifications and keep UI in sync.
- Starts auto-refresh and calls `updateComponents()`.

`updateComponents()`:

- Filters `todos` by `this.currentUserId` to show only the tasks assigned to the chosen user.
- Supplies filtered `todos` and supporting data (`users`, `categories`) to UI components (`todoList`, `stats`, `addTodo`).

`addTodoItem(todoData)`:

- Validates `text` then calls `this.todoService.addTodo()` to add remotely.
- On success pushes the new todo to `this.todos` and calls `updateComponents()`.

`editTodoItem(id, newText)` and `toggleTodoItem(id)`:

- Both call `this.todoService.updateTodo` and use `concurrencyManager` to detect and record version changes.
- On success, update local `todos` item fields (text, completed, version, timestamps) and call `updateComponents()`.
- On conflict, notify user and refresh local todos.

`deleteTodoItem(id)`:

- Calls `this.todoService.deleteTodo(id)`; on success removes the item from `this.todos`, logs the deletion, and updates components.
- On failure, shows an alert and attempts a refresh.

`render()` and `renderMain()`:

- `render()` builds a template that concatenates `header.render()`, `renderMain()`, and `footer.render()`.
- `renderMain()` composes the main layout: user selection, categories, the todo list (left), add-todo form (right), and stats.

Notes about rendering flow:

- Each `render()` returns HTML strings only. The main `app.js` sets `app.innerHTML = todoContainer.render()` to place the combined markup into the DOM.
- Because the code reassigns `innerHTML` on interactions, previously attached event listeners are removed; `setupEventListeners()` must be called again to attach handlers to the newly created nodes.

---

**`ToDoList/ToDoList.js`**

This component receives `todos`, `users`, `categories` and produces the DOM HTML for the list.

Constructor and setters:

- Stores arrays and simple edit state (`editingId`, `editText`). Setters are used by `ToDoContainer.updateComponents()` to inject data.

`getUserName(userId)` and `getCategoryInfo(categoryId)`:

- Small helper methods that map IDs to displayable names/colors using the `users` and `categories` arrays.

`renderTodoRow(todo)`:

- Builds a single task's HTML string:
  - Status icon: `✅` when completed, `📌` when not.
  - Category badge shows `category.name` and uses `category.color` for background.
  - Assigned user name via `getUserName`.
  - Priority displays a colored icon and text.
  - Checkbox input `.todo-checkbox` with `data-id` attribute used by `app.js` to toggle completion.
  - Edit and Delete buttons (`.edit-btn` and `.delete-btn`) include `data-id` and `data-text` attributes for identifying the task.
  - Inline styles control the visual layout; the row includes `data-todo-id` attribute for convenience.

`render()`:

- Maps `todos` to `renderTodoRow` and wraps them inside a card with a header showing the count of tasks.
- If there are no todos, it returns a friendly placeholder message.

Important runtime notes:

- `ToDoList` does not attach any event listeners. It only produces HTML. `app.js` must attach event handlers to `.edit-btn`, `.delete-btn`, `.todo-checkbox`, etc., after `innerHTML` is replaced.

---

**`AddTodo/AddTodo.js`**

This component renders the form used to add a new todo. It accepts `users` and `categories` (set via `setUsers()` and `setCategories()`) which it uses to populate `<select>` options.

`render()` returns an HTML string containing:

- An input `.add-todo-input` for the task title.
- A `<select class="task-assigned-to">` populated with `this.users` via `map()`.
- A `<select class="task-category">` populated with `this.categories` via `map()`.
- A `<select class="task-priority">` (low/medium/high).
- A button `.add-todo-btn` that `app.js` binds to for creating a new todo.

Notes about behavior:

- The `AddTodo` component only outputs markup. The event handling and the actual create call are made by `app.js`, which reads values from DOM elements and passes them to `todoContainer.addTodoItem()`.

---

**How HTML is rendered and how JS calls HTML (end-to-end flow)**

1. Browser loads `index.html` and reaches `<script type="module" src="app.js"></script>`.
2. `app.js` is executed as an ES module. It imports `ToDoContainer` and constructs it.
3. `initializeApp()` is called:
   - `todoContainer.initialize()` fetches data from the JSON server (via `TodoService`) and configures components.
   - Once the data is available, `app.innerHTML = todoContainer.render()` injects the composed HTML string into the DOM node with ID `app`.
4. Immediately after rendering, `setupEventListeners()` queries the newly rendered DOM for elements by class (for example `.add-todo-btn`, `.todo-checkbox`, `.delete-btn`, `.edit-btn`, `.user-selector`) and attaches event listeners.
   - Important: because the app re-renders by setting `innerHTML`, attaching listeners must be repeated after each re-render.
5. User interactions:
   - Add: user types a task and clicks `.add-todo-btn` (or presses Enter). `app.js` collects values and calls `todoContainer.addTodoItem()` which calls `TodoService.addTodo()` to POST to the JSON server. On success `todoContainer` updates its in-memory `todos` array, `app.js` re-renders, and `setupEventListeners()` re-attaches handlers.
   - Edit/Delete/Toggle: similar flows — the `app.js` handler reads `data-id` attributes, calls `todoContainer` methods which call `TodoService` endpoints to update/delete data, updates local state, and triggers a re-render.
6. Concurrency and refresh:
   - `ToDoContainer` uses `ConcurrencyManager` and `RefreshManager` to detect concurrent edits via a `version` field on todos. `RefreshManager` periodically polls the server; when changes are found it calls back and `ToDoContainer` refreshes local todos and updates components.

---

**Files not expanded here**

- `Services/TodoService.js` — contains the actual `fetch`/`axios`/`fetch`-like calls to the JSON server endpoints. It will have `getTodos`, `getUsers`, `getCategories`, `addTodo`, `updateTodo`, `deleteTodo`.
- `Services/ConcurrencyManager.js` and `Services/RefreshManager.js` — implement version caching, conflict detection, and polling logic. They integrate with `ToDoContainer` via events/callbacks.
- `Header`, `Footer`, `User`, `Category`, `Stats` — small components that return HTML strings for their respective UI parts.

If you'd like, I can:

- Expand this document to include the full line-by-line explanation for `TodoService`, `ConcurrencyManager`, `RefreshManager`, and other components.
- Add code snippets from the services into this file and explain each network call and response shape.

---

Generated: explanation for `index.html`, `app.js`, `ToDoContainer.js`, `ToDoList.js`, `AddTodo.js`.
