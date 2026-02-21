import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import ToDoList from "../ToDoList/ToDoList.js";
import AddTodo from "../AddTodo/AddTodo.js";
import Stats from "../Stats/Stats.js";
import User from "../User/User.js";
import Category from "../Category/Category.js";
import TodoService from "../Services/TodoService.js";

class ToDoContainer {
  constructor() {
    this.header = new Header("TODO App", "Manage all your tasks efficiently");
    this.footer = new Footer(2026, "TODO App");
    this.todoList = new ToDoList();
    this.addTodo = new AddTodo();
    this.stats = new Stats();
    this.user = new User();
    this.category = new Category();
    this.todoService = new TodoService();

    this.todos = [];
    this.users = [];
    this.categories = [];
    this.currentUserId = 1;
  }

  async initialize() {
    this.users = await this.todoService.getUsers();
    this.categories = await this.todoService.getCategories();
    this.todos = await this.todoService.getTodos();
    
    this.user.setUsers(this.users);
    this.user.setCurrentUser(this.currentUserId);
    this.category.setCategories(this.categories);
    
    this.updateComponents();
  }

  setCurrentUser(userId) {
    this.currentUserId = userId;
    this.user.setCurrentUser(userId);
    this.updateComponents();
  }

  updateComponents() {
    // Filter todos for current user
    const userTodos = this.todos.filter(t => t.assignedTo === this.currentUserId);
    
    this.todoList.setTodos(userTodos);
    this.todoList.setUsers(this.users);
    this.todoList.setCategories(this.categories);
    
    this.stats.setTodos(userTodos);
    
    this.addTodo.setUsers(this.users);
    this.addTodo.setCategories(this.categories);
  }

  async addTodoItem(todoData) {
    if (todoData.text.trim()) {
      const newTodo = await this.todoService.addTodo({
        text: todoData.text,
        createdBy: this.currentUserId,
        assignedTo: todoData.assignedTo || this.currentUserId,
        categoryId: todoData.categoryId,
        dueDate: todoData.dueDate,
        priority: todoData.priority
      });
      if (newTodo) {
        this.todos.push(newTodo);
        this.updateComponents();
        return newTodo;
      }
    }
    return null;
  }

  async editTodoItem(id, newText) {
    if (newText.trim()) {
      const updated = await this.todoService.updateTodo(id, {
        text: newText.trim(),
      });
      if (updated) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
          todo.text = newText.trim();
          this.updateComponents();
        }
        return updated;
      }
    }
    return null;
  }

  async toggleTodoItem(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      const updated = await this.todoService.updateTodo(id, {
        completed: !todo.completed,
      });
      if (updated) {
        todo.completed = updated.completed;
        this.updateComponents();
      }
      return updated;
    }
    return null;
  }

  async deleteTodoItem(id) {
    const success = await this.todoService.deleteTodo(id);
    if (success) {
      this.todos = this.todos.filter((t) => t.id !== id);
      this.updateComponents();
      return true;
    }
    return false;
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

  getTodos() {
    return this.todos;
  }
}

export default ToDoContainer;
