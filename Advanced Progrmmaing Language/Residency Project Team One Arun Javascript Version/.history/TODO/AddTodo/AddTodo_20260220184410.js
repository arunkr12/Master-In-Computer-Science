class AddTodo {
  constructor(onAdd = null) {
    this.onAdd = onAdd;
    this.inputValue = "";
  }

  render() {
    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px;">
        <div class="card-header bg-gradient p-4" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px 8px 0 0;">
          <h5 class="card-title mb-0 text-white fw-bold">
            ➕ Add New Task
          </h5>
        </div>
        <div class="card-body p-4">
          <div class="mb-3">
            <input type="text" class="form-control add-todo-input shadow-sm" 
                   placeholder="✍️ What's your next task?" 
                   id="newTaskInput"
                   style="border: 2px solid #f5576c; border-radius: 6px; padding: 12px; font-size: 1rem;">
          </div>
          <button class="btn btn-gradient w-100 add-todo-btn fw-bold py-2" 
                  style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 6px; color: white; font-size: 1rem; transition: all 0.3s ease;">
            🚀 Add Task
          </button>
        </div>
      </div>
    `;
  }
}

export default AddTodo;
