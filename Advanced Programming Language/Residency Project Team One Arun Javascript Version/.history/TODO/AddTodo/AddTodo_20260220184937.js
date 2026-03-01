class AddTodo {
  constructor(onAdd = null) {
    this.onAdd = onAdd;
    this.inputValue = "";
  }

  render() {
    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px;">
        <div class="card-header bg-gradient p-3" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px 8px 0 0;">
          <h6 class="card-title mb-0 text-white fw-bold" style="font-size: 0.95rem;">
            ➕ Add New Task
          </h6>
        </div>
        <div class="card-body p-3">
          <div class="mb-2">
            <input type="text" class="form-control add-todo-input shadow-sm" 
                   placeholder="✍️ What's your next task?" 
                   id="newTaskInput"
                   style="border: 2px solid #f5576c; border-radius: 6px; padding: 8px; font-size: 0.9rem;">
          </div>
          <button class="btn btn-gradient w-100 add-todo-btn fw-bold" 
                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 6px; color: white; font-size: 0.9rem; padding: 8px; transition: all 0.3s ease;">
            🚀 Add Task
          </button>
        </div>
      </div>
    `;
  }
}

export default AddTodo;
