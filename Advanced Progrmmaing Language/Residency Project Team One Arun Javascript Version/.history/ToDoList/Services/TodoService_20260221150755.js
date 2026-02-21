import {
  API_BASE_URL,
  TODOS_ENDPOINT,
  USERS_ENDPOINT,
  CATEGORIES_ENDPOINT,
} from "../Constants/Constants.js";

/**
 * TodoService: Handles all HTTP requests to the JSON Server REST API.
 * Provides CRUD operations for todos, users, and categories.
 * Implements optimistic concurrency control using version tracking.
 */
class TodoService {
  /**
   * Constructor: Initializes the API endpoints using centralized constants.
   * All endpoint URLs are imported from constants.js for easy configuration.
   */
  constructor() {
    this.apiUrl = API_BASE_URL;
    this.todosEndpoint = TODOS_ENDPOINT;
    this.usersEndpoint = USERS_ENDPOINT;
    this.categoriesEndpoint = CATEGORIES_ENDPOINT;
  }

  // User endpoints
  /**
   * Fetches all users from the server.
   * @returns {Promise<Array>} Array of user objects or empty array on error
   */
  async getUsers() {
    try {
      const response = await fetch(this.usersEndpoint);
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  // Category endpoints
  /**
   * Fetches all categories from the server.
   * @returns {Promise<Array>} Array of category objects or empty array on error
   */
  async getCategories() {
    try {
      const response = await fetch(this.categoriesEndpoint);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // Todo endpoints
  /**
   * Fetches all todos from the server.
   * @returns {Promise<Array>} Array of todo objects or empty array on error
   */
  async getTodos() {
    try {
      const response = await fetch(this.todosEndpoint);
      if (!response.ok) throw new Error("Failed to fetch todos");
      return await response.json();
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }

  // Get specific todo by ID (for concurrency checking)
  /**
   * Fetches a single todo by its ID (used for concurrency version checking).
   * @param {number} id - The todo ID
   * @returns {Promise<Object|null>} Todo object or null on error
   */
  async getTodoById(id) {
    try {
      const response = await fetch(`${this.todosEndpoint}/${id}`);
      if (!response.ok) throw new Error("Failed to fetch todo");
      return await response.json();
    } catch (error) {
      console.error("Error fetching todo:", error);
      return null;
    }
  }

  // Get todos by assigned user
  /**
   * Filters all todos to return only those assigned to a specific user.
   * @param {number} userId - The user ID to filter by
   * @returns {Promise<Array>} Array of todos assigned to the user or empty array on error
   */
  async getTodosByUser(userId) {
    try {
      const todos = await this.getTodos();
      return todos.filter((todo) => todo.assignedTo === userId);
    } catch (error) {
      console.error("Error filtering todos by user:", error);
      return [];
    }
  }

  // Get todos by category
  /**
   * Filters all todos to return only those in a specific category.
   * @param {number} categoryId - The category ID to filter by
   * @returns {Promise<Array>} Array of todos in the category or empty array on error
   */
  async getTodosByCategory(categoryId) {
    try {
      const todos = await this.getTodos();
      return todos.filter((todo) => todo.categoryId === categoryId);
    } catch (error) {
      console.error("Error filtering todos by category:", error);
      return [];
    }
  }

  /**
   * Creates a new todo item on the server.
   * Initializes version to 1, sets timestamps, and default values.
   * @param {Object} todoData - Contains text, createdBy, assignedTo, categoryId, dueDate, priority
   * @returns {Promise<Object|null>} The created todo object or null on error
   */
  async addTodo(todoData) {
    try {
      const response = await fetch(this.todosEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: todoData.text.trim(),
          completed: false,
          createdBy: todoData.createdBy,
          assignedTo: todoData.assignedTo,
          categoryId: todoData.categoryId,
          dueDate: todoData.dueDate || null,
          priority: todoData.priority || "medium",
          version: 1,
          lastModifiedBy: todoData.createdBy,
          lastModifiedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      return await response.json();
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }

  /**
   * Updates an existing todo on the server with optimistic concurrency control.
   * Fetches current server version, increments version, updates lastModifiedBy/At.
   * @param {number} id - The todo ID to update
   * @param {Object} updates - Fields to update (e.g., {text: "...", completed: true})
   * @param {number} userId - ID of the user making the update
   * @param {number} [expectedVersion] - Local cached version expected by client
   * @returns {Promise<Object>} {success, todo, conflict} - conflict=true if version mismatch detected
   */
  async updateTodo(id, updates, userId, expectedVersion = undefined) {
    try {
      // Check current server version first (optimistic locking)
      const serverTodo = await this.getTodoById(id);
      if (!serverTodo) throw new Error("Todo not found");

      // Detect conflict if client is editing a stale version
      if (
        expectedVersion !== undefined &&
        expectedVersion !== null &&
        serverTodo.version !== expectedVersion
      ) {
        return {
          success: false,
          conflict: true,
          error: "Version conflict detected",
          serverTodo: serverTodo,
        };
      }

      // Add version tracking
      const updateWithVersion = {
        ...updates,
        version: (serverTodo.version || 1) + 1,
        lastModifiedBy: userId,
        lastModifiedAt: new Date().toISOString(),
      };

      const response = await fetch(`${this.todosEndpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateWithVersion),
      });

      if (!response.ok) throw new Error("Failed to update todo");

      const updatedTodo = await response.json();

      // Return with conflict detection info
      return {
        success: true,
        todo: updatedTodo,
        conflict: false,
      };
    } catch (error) {
      console.error("Error updating todo:", error);
      return {
        success: false,
        conflict: true,
        error: error.message,
      };
    }
  }

  // Detect if a todo has been modified remotely
  /**
   * Compares local cached version with server version to detect concurrent edits.
   * @param {number} id - The todo ID
   * @param {number} localVersion - The version number cached locally
   * @returns {Promise<Object|null>} {hasChanged, serverVersion, localVersion, lastModifiedBy, lastModifiedAt, serverTodo}
   */
  async detectRemoteChanges(id, localVersion) {
    try {
      const serverTodo = await this.getTodoById(id);
      if (!serverTodo) return null;

      return {
        hasChanged: serverTodo.version !== localVersion,
        serverVersion: serverTodo.version,
        localVersion: localVersion,
        lastModifiedBy: serverTodo.lastModifiedBy,
        lastModifiedAt: serverTodo.lastModifiedAt,
        serverTodo: serverTodo,
      };
    } catch (error) {
      console.error("Error detecting remote changes:", error);
      return null;
    }
  }

  /**
   * Deletes a todo from the server.
   * @param {number} id - The todo ID to delete
   * @returns {Promise<boolean>} true on success, false on error
   */
  async deleteTodo(id) {
    try {
      const response = await fetch(`${this.todosEndpoint}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo");
      return true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return false;
    }
  }

  /**
   * Toggles the completed status of a todo (finds it in the provided todos array and calls updateTodo).
   * @param {number} id - The todo ID
   * @param {Array} todos - Array of todos to search in
   * @param {number} userId - ID of the user making the toggle
   * @returns {Promise<Object|null>} Updated todo or null if not found
   */
  async toggleTodo(id, todos, userId) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      return this.updateTodo(id, { completed: !todo.completed }, userId);
    }
    return null;
  }
}

export default TodoService;
