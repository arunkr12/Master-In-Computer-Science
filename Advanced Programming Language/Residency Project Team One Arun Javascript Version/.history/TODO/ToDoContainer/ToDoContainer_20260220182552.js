import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import ToDoList from "../ToDoList/ToDoList.js";
import AddTodo from "../AddTodo/AddTodo.js";
import Stats from "../Stats/Stats.js";

class ToDoContainer {
  constructor() {
    this.header = new Header("TODO App", "Manage all your tasks efficiently");
    this.footer = new Footer(2026, "TODO App");
    this.todoList = new ToDoList();
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
    this.todoList.setTodos(this.todos);
    this.stats.setTodos(this.todos);
  }

  addTodoItem(text) {
    if (text.trim()) {
      const newTodo = {
        id:
          this.todos.length > 0
            ? Math.max(...this.todos.map((t) => t.id)) + 1
            : 1,
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
    const footer = this.footer.render();

    return `
            ${header}
            ${mainContent}
            ${footer}
        `;
  }

  renderMain() {
    const todoListHtml = this.todoList.render();
    const addTodoHtml = this.addTodo.render();
    const statsHtml = this.stats.render();

    return `
            <main class="py-5">
                <div class="container">
                    <div class="row mb-4">
                        <div class="col-md-8">
                            ${todoListHtml}
                        </div>
                        <div class="col-md-4">
                            ${addTodoHtml}
                        </div>
                    </div>
                    ${statsHtml}
                </div>
            </main>
        `;
  }

  toggleTodoItem(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.updateComponents();
    }
    return todo;
  }

  deleteTodoItem(id) {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.updateComponents();
  }

  getTodos() {
    return this.todos;
  }
}

export default ToDoContainer;
