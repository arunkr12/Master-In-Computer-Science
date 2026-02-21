class TodoService {
  constructor(apiUrl = "http://localhost:3000") {
    this.apiUrl = apiUrl;
    this.todosEndpoint = `${this.apiUrl}/todos`;
    this.usersEndpoint = `${this.apiUrl}/users`;
    this.categoriesEndpoint = `${this.apiUrl}/categories`;
  }

  // User endpoints
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

  // Get todos by assigned user
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
  async getTodosByCategory(categoryId) {
    try {
      const todos = await this.getTodos();
      return todos.filter((todo) => todo.categoryId === categoryId);
    } catch (error) {
      console.error("Error filtering todos by category:", error);
      return [];
    }
  }

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
        }),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      return await response.json();
    } catch (error) {
      console.error("Error adding todo:", error);
      return null;
    }
  }

  async updateTodo(id, updates) {
    try {
      const response = await fetch(`${this.todosEndpoint}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      return await response.json();
    } catch (error) {
      console.error("Error updating todo:", error);
      return null;
    }
  }

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

  async toggleTodo(id, todos) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      return this.updateTodo(id, { completed: !todo.completed });
    }
    return null;
  }
}

export default TodoService;
