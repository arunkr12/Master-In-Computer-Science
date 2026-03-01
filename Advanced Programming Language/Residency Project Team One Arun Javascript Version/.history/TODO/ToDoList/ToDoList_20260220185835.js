class ToDoList {
  constructor(todos = [], users = [], categories = []) {
    this.todos = todos;
    this.users = users;
    this.categories = categories;
    this.editingId = null;
    this.editText = "";
  }

  setTodos(todos) {
    this.todos = todos;
  }

  setUsers(users) {
    this.users = users;
  }

  setCategories(categories) {
    this.categories = categories;
  }

  getUserName(userId) {
    const user = this.users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  }

  getCategoryInfo(categoryId) {
    const category = this.categories.find((c) => c.id === categoryId);
    return category
      ? { name: category.name, color: category.color }
      : { name: "N/A", color: "#999" };
  }

  renderTodoRow(todo) {
    const statusIcon = todo.completed ? "✅" : "📌";
    const category = this.getCategoryInfo(todo.categoryId);
    const assignedUser = this.getUserName(todo.assignedTo);
    const priorityIcon =
      todo.priority === "high"
        ? "🔴"
        : todo.priority === "medium"
          ? "🟡"
          : "🟢";

    return `
      <div class="list-group-item p-2 border-0 shadow-sm mb-2" 
           data-todo-id="${todo.id}" 
           style="background: ${todo.completed ? "#f0f9ff" : "#fafbfc"}; border-left: 4px solid ${todo.completed ? "#28a745" : category.color} !important; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
          <div style="display: flex; align-items: flex-start; gap: 0.5rem; flex: 1;">
            <input class="todo-checkbox" type="checkbox" 
                   data-id="${todo.id}" 
                   style="width: 18px; height: 18px; cursor: pointer; margin-top: 2px; flex-shrink: 0;"
                   ${todo.completed ? "checked" : ""}>
            <div style="flex: 1;">
              <span class="todo-text ${todo.completed ? "text-decoration-line-through text-success" : "text-dark fw-500"}" 
                    style="cursor: default; font-size: 0.95rem; display: block;">
                ${statusIcon} ${todo.text}
              </span>
              <div style="font-size: 0.75rem; color: #666; margin-top: 0.3rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span style="background: ${category.color}; color: white; padding: 0.2rem 0.5rem; border-radius: 3px; font-weight: bold;">
                  ${category.name}
                </span>
                <span style="background: #e9ecef; color: #333; padding: 0.2rem 0.5rem; border-radius: 3px;">
                  👤 ${assignedUser}
                </span>
                <span>${priorityIcon} ${todo.priority}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 0.3rem; flex-shrink: 0;">
            <button class="edit-btn" data-id="${todo.id}" data-text="${todo.text}" title="Edit" 
                    style="background: #ffc107; color: white; border: none; padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: bold;">
              ✏️
            </button>
            <button class="delete-btn" data-id="${todo.id}" title="Delete" 
                    style="background: #dc3545; color: white; border: none; padding: 0.4rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: bold;">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const todosHtml = this.todos
      .map((todo) => this.renderTodoRow(todo))
      .join("");

    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px; margin-bottom: 1rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0; padding: 1.5rem;">
          <h5 style="margin: 0; color: white; font-weight: bold; font-size: 1.2rem;">
            📋 Your TODO List (${this.todos.length} tasks)
          </h5>
        </div>
        <div style="background: white; border-radius: 0 0 8px 8px; padding: 1rem; overflow-y: auto; min-height: 300px; max-height: 500px;">
          ${todosHtml || '<div style="text-align: center; color: #999; padding: 2rem;"><p style="font-size: 0.95rem;">📭 No tasks yet. Add one to get started!</p></div>'}
        </div>
      </div>
    `;
  }
}

export default ToDoList;
