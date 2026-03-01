class AddTodo {
  constructor(users = [], categories = []) {
    this.users = users;
    this.categories = categories;
    this.inputValue = "";
  }

  setUsers(users) {
    this.users = users;
  }

  setCategories(categories) {
    this.categories = categories;
  }

  render() {
    return `
      <div class="card shadow-lg border-0" style="border-radius: 8px;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 8px 8px 0 0; padding: 1rem;">
          <h6 style="color: white; font-weight: bold; margin: 0; font-size: 0.95rem;">
            ➕ Add New Task
          </h6>
        </div>
        <div style="padding: 1rem; background: white; border-radius: 0 0 8px 8px;">
          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; color: #666; font-weight: bold; display: block; margin-bottom: 0.3rem;">Task Title</label>
            <input type="text" class="add-todo-input" 
                   placeholder="✍️ What's your next task?" 
                   id="newTaskInput"
                   style="width: 100%; border: 2px solid #f5576c; border-radius: 6px; padding: 8px; font-size: 0.9rem; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; color: #666; font-weight: bold; display: block; margin-bottom: 0.3rem;">Assign To</label>
            <select class="task-assigned-to" style="width: 100%; border: 2px solid #667eea; border-radius: 6px; padding: 8px; font-size: 0.9rem; box-sizing: border-box;">
              ${this.users
                .map(
                  (user) => `
                <option value="${user.id}">👤 ${user.name}</option>
              `,
                )
                .join("")}
            </select>
          </div>

          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; color: #666; font-weight: bold; display: block; margin-bottom: 0.3rem;">Category</label>
            <select class="task-category" style="width: 100%; border: 2px solid #764ba2; border-radius: 6px; padding: 8px; font-size: 0.9rem; box-sizing: border-box;">
              ${this.categories
                .map(
                  (cat) => `
                <option value="${cat.id}" style="border-left: 4px solid ${cat.color};">📂 ${cat.name}</option>
              `,
                )
                .join("")}
            </select>
          </div>

          <div style="margin-bottom: 0.75rem;">
            <label style="font-size: 0.75rem; color: #666; font-weight: bold; display: block; margin-bottom: 0.3rem;">Priority</label>
            <select class="task-priority" style="width: 100%; border: 2px solid #ffc107; border-radius: 6px; padding: 8px; font-size: 0.9rem; box-sizing: border-box;">
              <option value="low">🟢 Low</option>
              <option value="medium" selected>🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <button class="add-todo-btn" 
                  style="width: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 6px; color: white; font-weight: bold; font-size: 0.9rem; padding: 10px; cursor: pointer; transition: all 0.3s ease;">
            🚀 Add Task
          </button>
        </div>
      </div>
    `;
  }
}

export default AddTodo;
