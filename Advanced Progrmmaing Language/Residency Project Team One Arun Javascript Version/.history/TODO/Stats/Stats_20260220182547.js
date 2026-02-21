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
    return `
      <div class="alert alert-info" role="alert">
        <strong>Total Tasks:</strong> ${this.getTotalTasks()} | 
        <strong>Completed:</strong> ${this.getCompletedTasks()} | 
        <strong>Pending:</strong> ${this.getPendingTasks()}
      </div>
    `;
  }
}

export default Stats;
