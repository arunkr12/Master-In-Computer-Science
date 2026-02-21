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
      <div class="list-group-item d-flex justify-content-between align-items-center p-3 border-0 shadow-sm mb-2" 
           data-todo-id="${todo.id}" 
           style="background: ${todo.completed ? "#f0f9ff" : "#fafbfc"}; border-left: 4px solid ${todo.completed ? "#28a745" : "#667eea"} !important; border-radius: 4px;">
        <div class="flex-grow-1 d-flex align-items-center">
          <input class="form-check-input me-3 todo-checkbox" type="checkbox" 
                 data-id="${todo.id}" 
                 style="width: 20px; height: 20px; cursor: pointer;"
                 ${todo.completed ? "checked" : ""}>
          <span class="todo-text fs-5 ${todo.completed ? "text-decoration-line-through text-success" : "text-dark fw-500"}" 
                style="cursor: default;">
            ${statusIcon} ${todo.text}
          </span>
        </div>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-sm btn-outline-warning edit-btn" data-id="${todo.id}" title="Edit" style="border-radius: 4px 0 0 4px;">
            ✏️ Edit
          </button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${todo.id}" title="Delete" style="border-radius: 0 4px 4px 0;">
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

    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px;">
        <div class="card-header bg-gradient p-4" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
          <h5 class="mb-0 text-white fw-bold">
            📋 Your TODO List (${this.todos.length} tasks)
          </h5>
        </div>
        <div class="p-3" style="min-height: 300px; background: #f8f9fa; border-radius: 0 0 8px 8px;">
          ${todosHtml || '<div class="text-center text-muted py-5"><p class="fs-5">📭 No tasks yet. Add one to get started!</p></div>'}
        </div>
      </div>
    `;
  }
}

export default ToDoList;
