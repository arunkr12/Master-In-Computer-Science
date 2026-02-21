class DataTable {
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
    
    return `
      <div class="list-group-item d-flex justify-content-between align-items-center" data-todo-id="${todo.id}">
        <div class="flex-grow-1 d-flex align-items-center">
          <input class="form-check-input me-2 todo-checkbox" type="checkbox" 
                 data-id="${todo.id}" 
                 ${todo.completed ? "checked" : ""}>
          <span class="todo-text ${todo.completed ? "text-decoration-line-through text-muted" : ""}">
            ${todo.text}
          </span>
        </div>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-outline-warning edit-btn" data-id="${todo.id}" title="Edit">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button class="btn btn-outline-danger delete-btn" data-id="${todo.id}" title="Delete">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    `;
  }

  render() {
    const todosHtml = this.todos.map((todo) => this.renderTodoRow(todo)).join("");

    return `
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">Your TODO List</h5>
        </div>
        <div class="list-group list-group-flush todo-list">
          ${todosHtml || '<div class="list-group-item text-center text-muted">No tasks yet. Add one to get started!</div>'}
        </div>
      </div>
    `;
  }
}

export default DataTable;
