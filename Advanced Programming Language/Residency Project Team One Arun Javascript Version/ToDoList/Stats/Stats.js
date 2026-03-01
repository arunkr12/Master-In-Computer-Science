class Stats {
  constructor(todos = []) {
    this.todos = todos;
  }

  setTodos(todos) {
    this.todos = todos;
  }

  getTotalTasks() {
    return this.todos.length;
  }

  getCompletedTasks() {
    return this.todos.filter((t) => t.completed).length;
  }

  getPendingTasks() {
    return this.getTotalTasks() - this.getCompletedTasks();
  }

  render() {
    const total = this.getTotalTasks();
    const completed = this.getCompletedTasks();
    const pending = this.getPendingTasks();
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return `
      <div class="row mt-4">
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm border-0 text-center p-4" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea;">
            <div class="text-primary fw-bold" style="font-size: 2.5rem;">📊 ${total}</div>
            <div class="text-muted fw-500">Total Tasks</div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm border-0 text-center p-4" style="background: linear-gradient(135deg, #28a74515 0%, #20c99715 100%); border-left: 4px solid #28a745;">
            <div class="text-success fw-bold" style="font-size: 2.5rem;">✅ ${completed}</div>
            <div class="text-muted fw-500">Completed</div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card shadow-sm border-0 text-center p-4" style="background: linear-gradient(135deg, #ffc10715 0%, #ff650715 100%); border-left: 4px solid #ff6b6b;">
            <div class="text-warning fw-bold" style="font-size: 2.5rem;">⏳ ${pending}</div>
            <div class="text-muted fw-500">Pending</div>
          </div>
        </div>
      </div>
      <div class="progress mt-3" style="height: 25px; border-radius: 8px;">
        <div class="progress-bar bg-success fw-bold" role="progressbar" 
             style="width: ${percentage}%; border-radius: 8px;" 
             aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
          ${percentage}% Complete
        </div>
      </div>
    `;
  }
}

export default Stats;
