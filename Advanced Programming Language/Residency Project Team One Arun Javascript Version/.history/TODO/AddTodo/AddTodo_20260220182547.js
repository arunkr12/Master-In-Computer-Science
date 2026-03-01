class AddTodo {
  constructor(onAdd = null) {
    this.onAdd = onAdd;
    this.inputValue = "";
  }

  render() {
    return `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title mb-3">Add New Task</h5>
          <div class="mb-3">
            <input type="text" class="form-control add-todo-input" 
                   placeholder="Enter a new task" 
                   id="newTaskInput">
          </div>
          <button class="btn btn-primary w-100 add-todo-btn">Add Task</button>
        </div>
      </div>
    `;
  }
}

export default AddTodo;
