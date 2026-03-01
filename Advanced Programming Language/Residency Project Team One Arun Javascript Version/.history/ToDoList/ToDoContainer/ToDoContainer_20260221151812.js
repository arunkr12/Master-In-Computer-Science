import Header from "../Header/Header.js";
import Footer from "../Footer/Footer.js";
import ToDoList from "../ToDoList/ToDoList.js";
import AddTodo from "../AddTodo/AddTodo.js";
import Stats from "../Stats/Stats.js";
import User from "../User/User.js";
import Category from "../Category/Category.js";
import TodoService from "../Services/TodoService.js";
import ConcurrencyManager from "../Services/ConcurrencyManager.js";
import RefreshManager from "../Services/RefreshManager.js";

class ToDoContainer {
  constructor() {
    this.header = new Header("ToDoList", "Manage all your tasks efficiently");
    this.footer = new Footer(2026, "ToDoList");
    this.todoList = new ToDoList();
    this.addTodo = new AddTodo();
    this.stats = new Stats();
    this.user = new User();
    this.category = new Category();
    this.todoService = new TodoService();

    // Concurrency management
    this.concurrencyManager = new ConcurrencyManager();
    this.refreshManager = new RefreshManager(this.todoService, 60000); // Refresh every 60 seconds

    this.todos = [];
    this.users = [];
    this.categories = [];
    this.currentUserId = 1;
    this.selectedCategoryId = null;
    this.remoteUpdateNotifications = [];
    this.changeListeners = [];
    this.notificationListeners = [];
  }

  onChange(callback) {
    if (typeof callback === "function") {
      this.changeListeners.push(callback);
    }
  }

  notifyChange() {
    this.changeListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        console.error("Error in change listener:", error);
      }
    });
  }

  onNotification(callback) {
    if (typeof callback === "function") {
      this.notificationListeners.push(callback);
    }
  }

  notifyNotification(notification) {
    this.notificationListeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error("Error in notification listener:", error);
      }
    });
  }

  async initialize() {
    this.users = await this.todoService.getUsers();
    this.categories = await this.todoService.getCategories();
    this.todos = await this.todoService.getTodos();

    // Cache versions for concurrency detection
    this.todos.forEach((todo) => {
      this.concurrencyManager.cacheVersion(todo.id, todo.version);
    });

    this.user.setUsers(this.users);
    this.user.setCurrentUser(this.currentUserId);
    // Provide user info to header so it can show logged-in and selector
    if (this.header && typeof this.header.setUsers === "function") {
      this.header.setUsers(this.users);
      this.header.setCurrentUser(this.currentUserId);
    }
    this.category.setCategories(this.categories);

    // Set up conflict listeners
    this.concurrencyManager.onConflict((conflictInfo) => {
      console.warn("⚠️ Conflict detected:", conflictInfo);
      this.remoteUpdateNotifications.push(conflictInfo);
      this.notifyNotification({
        type: "warning",
        message:
          conflictInfo.message ||
          "Conflict detected. Another user modified this task.",
      });
    });

    // Set up refresh listeners for auto-sync
    this.refreshManager.onUpdate((changes) => {
      console.log("🔄 Remote updates detected, refreshing UI...", changes);
      changes.forEach((change) => {
        this.remoteUpdateNotifications.push({
          type: change.type,
          message: change.description,
          todo: change.todo,
        });
      });
      // Auto-refresh todo list
      this.refreshLocalTodos();
    });

    // Start auto-refresh for concurrent access
    this.refreshManager.startAutoRefresh();

    this.updateComponents();
  }

  /**
   * Refresh local todos from server (for concurrent sync)
   */
  async refreshLocalTodos() {
    try {
      this.todos = await this.todoService.getTodos();
      this.todos.forEach((todo) => {
        this.concurrencyManager.cacheVersion(todo.id, todo.version);
      });
      this.updateComponents();
      this.notifyChange();
    } catch (error) {
      console.error("Error refreshing todos:", error);
    }
  }

  setCurrentUser(userId) {
    this.currentUserId = userId;
    this.user.setCurrentUser(userId);
    this.updateComponents();
  }

  setSelectedCategory(categoryId) {
    this.selectedCategoryId =
      categoryId && categoryId !== 0 ? categoryId : null;
    if (
      this.category &&
      typeof this.category.setCurrentCategory === "function"
    ) {
      this.category.setCurrentCategory(this.selectedCategoryId);
    }
    this.updateComponents();
  }

  updateComponents() {
    // Filter todos for current user
    const userTodos = this.todos.filter((t) => {
      if (t.assignedTo !== this.currentUserId) return false;
      if (this.selectedCategoryId && t.categoryId !== this.selectedCategoryId)
        return false;
      return true;
    });

    this.todoList.setTodos(userTodos);
    this.todoList.setUsers(this.users);
    this.todoList.setCategories(this.categories);

    // keep header user state in sync
    if (this.header && typeof this.header.setUsers === "function") {
      this.header.setUsers(this.users);
      this.header.setCurrentUser(this.currentUserId);
    }

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
        priority: todoData.priority,
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
      // Get current version for conflict detection
      const cachedVersion = this.concurrencyManager.getCachedVersion(id);

      const result = await this.todoService.updateTodo(
        id,
        {
          text: newText.trim(),
        },
        this.currentUserId,
        cachedVersion,
      );

      if (result.success) {
        // Update cache and local state
        this.concurrencyManager.cacheVersion(id, result.todo.version);
        this.concurrencyManager.logChange(
          id,
          "UPDATE",
          this.currentUserId,
          null,
          result.todo,
        );

        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
          todo.text = newText.trim();
          todo.version = result.todo.version;
          todo.lastModifiedAt = result.todo.lastModifiedAt;
          todo.lastModifiedBy = result.todo.lastModifiedBy;
          this.updateComponents();
        }
        return {
          success: true,
          conflict: false,
          todo: result.todo,
        };
      } else if (result.conflict) {
        // Handle version conflict
        const conflictInfo = {
          message: `Conflict! This task was modified by another user.`,
          todo: result.serverTodo,
          suggestRefresh: true,
        };
        return {
          success: false,
          conflict: true,
          conflictInfo: conflictInfo,
          serverTodo: result.serverTodo,
          pendingText: newText.trim(),
        };
      }
    }
    return {
      success: false,
      conflict: false,
      todo: null,
    };
  }

  async forceEditTodoItem(id, newText) {
    if (!newText || !newText.trim()) {
      return {
        success: false,
        conflict: false,
        todo: null,
      };
    }

    const result = await this.todoService.updateTodo(
      id,
      {
        text: newText.trim(),
      },
      this.currentUserId,
      undefined,
      { force: true },
    );

    if (result.success) {
      this.concurrencyManager.cacheVersion(id, result.todo.version);
      this.concurrencyManager.logChange(
        id,
        "OVERRIDE_UPDATE",
        this.currentUserId,
        null,
        result.todo,
      );

      const todo = this.todos.find((t) => t.id === id);
      if (todo) {
        todo.text = newText.trim();
        todo.version = result.todo.version;
        todo.lastModifiedAt = result.todo.lastModifiedAt;
        todo.lastModifiedBy = result.todo.lastModifiedBy;
      }
      this.updateComponents();
      return {
        success: true,
        conflict: false,
        todo: result.todo,
      };
    }

    return {
      success: false,
      conflict: !!result.conflict,
      todo: null,
    };
  }

  async toggleTodoItem(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      // Get current version for conflict detection
      const cachedVersion = this.concurrencyManager.getCachedVersion(id);

      const result = await this.todoService.updateTodo(
        id,
        {
          completed: !todo.completed,
        },
        this.currentUserId,
        cachedVersion,
      );

      if (result.success) {
        // Update cache and local state
        this.concurrencyManager.cacheVersion(id, result.todo.version);
        this.concurrencyManager.logChange(
          id,
          "UPDATE",
          this.currentUserId,
          { completed: todo.completed },
          { completed: result.todo.completed },
        );

        todo.completed = result.todo.completed;
        todo.version = result.todo.version;
        todo.lastModifiedAt = result.todo.lastModifiedAt;
        todo.lastModifiedBy = result.todo.lastModifiedBy;
        this.updateComponents();
        return result.todo;
      } else if (result.conflict) {
        // Handle version conflict
        const conflictInfo = {
          message: `Conflict! This task was modified by another user.`,
          todo: result.serverTodo,
          suggestRefresh: true,
        };
        this.concurrencyManager.notifyConflict(conflictInfo);
        await this.refreshLocalTodos();
        return null;
      }
    }
    return null;
  }

  async deleteTodoItem(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) return false;

    try {
      const success = await this.todoService.deleteTodo(id);
      if (success) {
        // Log deletion in audit trail
        this.concurrencyManager.logChange(
          id,
          "DELETE",
          this.currentUserId,
          todo,
          null,
        );

        this.todos = this.todos.filter((t) => t.id !== id);
        this.updateComponents();
        return true;
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      this.notifyNotification({
        type: "danger",
        message:
          "Failed to delete task. It may have been modified or deleted by another user.",
      });
      await this.refreshLocalTodos();
      return false;
    }
    return false;
  }

  render() {
    // Build the page: header, todo body, and footer.
    const header = this.header.render();
    const bodyContent = this.renderTodoBody();
    const footer = this.footer.render();

    return `
            ${header}
            ${bodyContent}
            ${footer}
        `;
  }

  renderTodoBody() {
    const todoListHtml = this.renderTodoListSection();
    const categoryHtml = this.renderCategorySection();
    const addTodoHtml = this.renderAddTodoSection();
    const statsHtml = this.renderStatsSection();

    return `
          <main id="todo-body" class="py-4">
                <div class="container">
            <div class="row mb-4">
              <div class="col-12">
                <div id="ui-alert-region"></div>
              </div>
            </div>
                    <div class="row mb-4">
                        <div class="col-12">
                            <div id="category-section">${categoryHtml}</div>
                        </div>
                    </div>
                    <div class="row mb-4">
                        <div class="col-md-8">
                            <div id="todo-list-section">${todoListHtml}</div>
                        </div>
                        <div class="col-md-4">
                            <div id="add-todo-section">${addTodoHtml}</div>
                        </div>
                    </div>
                    <div id="stats-section">${statsHtml}</div>
                </div>
            </main>
        `;
  }

  renderCategorySection() {
    return this.category.render();
  }

  renderTodoListSection() {
    return this.todoList.render();
  }

  renderAddTodoSection() {
    return this.addTodo.render();
  }

  renderStatsSection() {
    return this.stats.render();
  }

  getTodos() {
    return this.todos;
  }
}

export default ToDoContainer;
