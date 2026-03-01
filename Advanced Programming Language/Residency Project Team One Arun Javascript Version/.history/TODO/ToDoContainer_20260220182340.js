import Header from "./Header.js";
import Footer from "./Footer.js";
import DataTable from "./DataTable.js";
import AddTodo from "./AddTodo.js";
import Stats from "./Stats.js";

class ToDoContainer {
  constructor() {
    this.header = new Header("TODO App", "Manage all your tasks efficiently");
    this.footer = new Footer(2026, "TODO App");
    this.dataTable = new DataTable();
    this.addTodo = new AddTodo();
    this.stats = new Stats();
    
    this.todos = [
      { id: 1, text: "Learn JavaScript", completed: false },
      { id: 2, text: "Build a TODO App", completed: true },
      { id: 3, text: "Master Bootstrap & Tailwind", completed: false },
    ];
    
    this.updateComponents();
  }

  updateComponents() {
    this.dataTable.setTodos(this.todos);
    this.stats.setTodos(this.todos);
  }

  addTodoItem(text) {
    if (text.trim()) {
      const newTodo = {
        id: this.todos.length > 0 ? Math.max(...this.todos.map((t) => t.id)) + 1 : 1,
        text: text.trim(),
        completed: false,
      };
      this.todos.push(newTodo);
      this.updateComponents();
      return newTodo;
    }
    return null;
  }

  editTodoItem(id, newText) {
    if (newText.trim()) {
      const todo = this.todos.find((t) => t.id === id);
      if (todo) {
        todo.text = newText.trim();
        this.updateComponents();
        return todo;
      }
    }
    return null;
  }

  render() {
    const header = this.header.render();
    const mainContent = this.renderMain();
    const footer = this.renderFooter();

    return `
            ${header}
            ${mainContent}
            ${footer}
        `;
  }

  renderMain() {
    const todosHtml = this.todos
      .map(
        (todo) => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <input class="form-check-input me-2" type="checkbox" ${todo.completed ? "checked" : ""}>
                    <span class="${todo.completed ? "text-decoration-line-through text-muted" : ""}">${todo.text}</span>
                </div>
                <button class="btn btn-sm btn-danger">Delete</button>
            </div>
        `,
      )
      .join("");

    return `
            <main class="py-5">
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-md-8">
                            <div class="card">
                                <div class="card-header">
                                    <h5 class="mb-0">Your TODO List</h5>
                                </div>
                                <div class="list-group list-group-flush">
                                    ${todosHtml}
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">Add New Task</h5>
                                    <div class="mb-3">
                                        <input type="text" class="form-control" placeholder="Enter a new task">
                                    </div>
                                    <button class="btn btn-primary w-100">Add Task</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <strong>Total Tasks:</strong> ${this.todos.length} | 
                        <strong>Completed:</strong> ${this.todos.filter((t) => t.completed).length}
                    </div>
                </div>
            </main>
        `;
  }

  renderFooter() {
    return `
            <footer class="py-4 mt-5">
                <div class="container text-center text-muted">
                    <p class="mb-1">&copy; 2026 TODO App. All rights reserved.</p>
                    <p class="mb-0">Built As Residency Project</p>
                </div>
            </footer>
        `;
  }
}

export default ToDoContainer;
