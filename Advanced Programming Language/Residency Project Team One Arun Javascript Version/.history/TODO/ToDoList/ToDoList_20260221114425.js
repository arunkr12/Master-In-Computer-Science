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
            <button
              class="todo-toggle"
              type="button"
              data-id="${todo.id}"
              title="${todo.completed ? "Mark as not done" : "Finish this task"}"
              aria-label="${todo.completed ? "Mark as not done" : "Finish this task"}"
              style="width: 22px; height: 22px; cursor: pointer; margin-top: 2px; flex-shrink: 0; border: none; background: transparent; padding: 0;"
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' fill='${todo.completed ? "%2334d399" : "%23e2e8f0"}' stroke='${todo.completed ? "%23059669" : "%2394a3b8"}' stroke-width='2'/><path d='M8 12.5l2.5 2.5L16 9.5' stroke='${todo.completed ? "%23ffffff" : "%2394a3b8"}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
                alt="${todo.completed ? "Done" : "Not done"}"
                style="width:22px;height:22px;display:block;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.15));"
              />
            </button>
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
                  <img
                    src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='12' r='10' fill='%23fde047'/><circle cx='12' cy='10' r='4' fill='%23a16207'/><path d='M6 20c1.2-3.2 4-5 6-5s4.8 1.8 6 5' stroke='%23a16207' stroke-width='2' stroke-linecap='round'/></svg>"
                    alt="User"
                    style="width:12px;height:12px;vertical-align:middle;margin-right:0.25rem;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.2));"
                  />
                  ${assignedUser}
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
