class TodoService {
  constructor(apiUrl = "http://localhost:3000") {
    this.apiUrl = apiUrl;
    this.todosEndpoint = `${this.apiUrl}/todos`;
  }

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

  async addTodo(text) {
    try {
      const response = await fetch(this.todosEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          completed: false,
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
