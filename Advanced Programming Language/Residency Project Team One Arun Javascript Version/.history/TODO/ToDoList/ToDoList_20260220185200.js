class ToDoList {
  constructor(todos = []) {
    this.todos = todos;
    this.editingId = null;
    this.editText = "";
  }

  setTodos(todos) {
    this.todos = todos;
  }

  renderTodoRow(todo) {
    const isEditing = this.editingId === todo.id;
    const statusIcon = todo.completed ? "✅" : "📌";

    return `
      <div class="list-group-item d-flex justify-content-between align-items-center p-2 border-0 shadow-sm mb-2" 
           data-todo-id="${todo.id}" 
           style="background: ${todo.completed ? "#f0f9ff" : "#fafbfc"}; border-left: 4px solid ${todo.completed ? "#28a745" : "#667eea"} !important; border-radius: 4px;">
        <div class="flex-grow-1 d-flex align-items-center">
          <input class="form-check-input me-2 todo-checkbox" type="checkbox" 
                 data-id="${todo.id}" 
                 style="width: 18px; height: 18px; cursor: pointer;"
                 ${todo.completed ? "checked" : ""}>
          <span class="todo-text ${todo.completed ? "text-decoration-line-through text-success" : "text-dark fw-500"}" 
                style="cursor: default; font-size: 0.95rem;">
            ${statusIcon} ${todo.text}
          </span>
        </div>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${todo.id}" data-text="${todo.text}" title="Edit" style="border-radius: 4px 0 0 4px; font-size: 0.8rem;">
            ✏️ Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${todo.id}" title="Delete" style="border-radius: 0 4px 4px 0; font-size: 0.8rem;">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const todosHtml = this.todos
      .map((todo) => this.renderTodoRow(todo))
      .join("");

    const completedCount = this.todos.filter((t) => t.completed).length;
    const pendingCount = this.todos.length - completedCount;
    const completionPercentage =
      this.todos.length > 0
        ? Math.round((completedCount / this.todos.length) * 100)
        : 0;

    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px; margin-bottom: 1rem;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0; padding: 1.5rem;">
          <div class="d-flex justify-content-between align-items-center">
            <h5 style="margin: 0; color: white; font-weight: bold; font-size: 1.2rem;">
              📋 Your TODO List (${this.todos.length} tasks)
            </h5>
            <span style="background: white; color: #333; font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: bold;">
              ${completionPercentage}% Done
            </span>
          </div>
        </div>
        <div class="p-3" style="background: #f8f9fa;">
          <div class="row g-2 mb-3">
            <div class="col-4">
              <div class="text-center p-2" style="background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="font-size: 0.9rem; color: #667eea; font-weight: bold;">${this.todos.length}</div>
                <div style="font-size: 0.75rem; color: #666;">Total Tasks</div>
              </div>
            </div>
            <div class="col-4">
              <div class="text-center p-2" style="background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="font-size: 0.9rem; color: #28a745; font-weight: bold;">✅ ${completedCount}</div>
                <div style="font-size: 0.75rem; color: #666;">Completed</div>
              </div>
            </div>
            <div class="col-4">
              <div class="text-center p-2" style="background: white; border-radius: 6px; border: 1px solid #e9ecef;">
                <div style="font-size: 0.9rem; color: #ffc107; font-weight: bold;">⏳ ${pendingCount}</div>
                <div style="font-size: 0.75rem; color: #666;">Pending</div>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 6px; padding: 0; overflow: hidden; min-height: 300px;">
            ${todosHtml || '<div class="text-center text-muted py-5" style="background: #f8f9fa;"><p style="font-size: 0.95rem;">📭 No tasks yet. Add one to get started!</p></div>'}
          </div>
        </div>
      </div>
    `;
  }
}

export default ToDoList;
