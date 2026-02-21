/**
 * RefreshManager - Handles auto-refresh polling for concurrent user support
 * Detects when other users modify tasks and notifies UI
 */
class RefreshManager {
  constructor(todoService, intervalMs = 5000) {
    this.todoService = todoService;
    this.intervalMs = intervalMs;
    this.refreshIntervalId = null;
    this.lastFetch = null;
    this.updateListeners = [];
    this.isRunning = false;
    this.pendingUpdates = [];
  }

  /**
   * Start auto-refresh polling
   */
  startAutoRefresh() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`🔄 Auto-refresh started (interval: ${this.intervalMs}ms)`);
    
    // Initial fetch
    this.checkForUpdates();
    
    // Set up interval
    this.refreshIntervalId = setInterval(() => {
      this.checkForUpdates();
    }, this.intervalMs);
  }

  /**
   * Stop auto-refresh polling
   */
  stopAutoRefresh() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
      this.refreshIntervalId = null;
      this.isRunning = false;
      console.log("⏹️ Auto-refresh stopped");
    }
  }

  /**
   * Check for updates on server
   */
  async checkForUpdates() {
    try {
      const todos = await this.todoService.getTodos();
      
      if (this.lastFetch === null) {
        // First fetch
        this.lastFetch = todos;
        return;
      }

      // Compare todos and detect changes
      const changes = this.detectChanges(this.lastFetch, todos);
      
      if (changes.length > 0) {
        console.log(`📢 ${changes.length} update(s) detected from other users`);
        this.notifyUpdates(changes);
        this.lastFetch = todos;
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  }

  /**
   * Detect changes between two todo arrays
   */
  detectChanges(previousTodos, currentTodos) {
    const changes = [];
    const todoMap = new Map(currentTodos.map(t => [t.id, t]));
    const prevMap = new Map(previousTodos.map(t => [t.id, t]));

    // Check for modified todos
    for (const [id, todo] of todoMap) {
      const prevTodo = prevMap.get(id);
      
      if (!prevTodo) {
        // New todo added
        changes.push({
          type: 'ADDED',
          todo: todo,
          description: `✨ New task added by ${this.getUserName(todo.createdBy)}: "${todo.text}"`
        });
      } else if (this.isTodoModified(prevTodo, todo)) {
        // Todo was modified
        const modifiedFields = this.getModifiedFields(prevTodo, todo);
        changes.push({
          type: 'MODIFIED',
          todo: todo,
          prevTodo: prevTodo,
          modifiedFields: modifiedFields,
          description: `✏️ Task updated by ${this.getUserName(todo.lastModifiedBy)}: "${todo.text}" (${modifiedFields.join(', ')})`
        });
      }
    }

    // Check for deleted todos
    for (const [id, todo] of prevMap) {
      if (!todoMap.has(id)) {
        changes.push({
          type: 'DELETED',
          todo: todo,
          description: `🗑️ Task deleted: "${todo.text}"`
        });
      }
    }

    return changes;
  }

  /**
   * Check if a todo was modified
   */
  isTodoModified(prev, current) {
    return (
      prev.text !== current.text ||
      prev.completed !== current.completed ||
      prev.assignedTo !== current.assignedTo ||
      prev.categoryId !== current.categoryId ||
      prev.priority !== current.priority ||
      prev.version !== current.version
    );
  }

  /**
   * Get which fields were modified
   */
  getModifiedFields(prev, current) {
    const fields = [];
    
    if (prev.text !== current.text) fields.push('text');
    if (prev.completed !== current.completed) fields.push('status');
    if (prev.assignedTo !== current.assignedTo) fields.push('assignee');
    if (prev.categoryId !== current.categoryId) fields.push('category');
    if (prev.priority !== current.priority) fields.push('priority');
    
    return fields;
  }

  /**
   * Register listener for update events
   */
  onUpdate(callback) {
    this.updateListeners.push(callback);
  }

  /**
   * Notify all listeners of updates
   */
  notifyUpdates(changes) {
    this.pendingUpdates.push(...changes);
    this.updateListeners.forEach(listener => listener(changes));
  }

  /**
   * Get pending updates
   */
  getPendingUpdates() {
    return this.pendingUpdates;
  }

  /**
   * Clear pending updates after UI refresh
   */
  clearPendingUpdates() {
    this.pendingUpdates = [];
  }

  /**
   * Helper to get user name
   */
  getUserName(userId) {
    const userMap = {
      1: "Arun",
      2: "Tarak",
      3: "Admin"
    };
    return userMap[userId] || `User ${userId}`;
  }

  /**
   * Get auto-refresh status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      interval: this.intervalMs,
      pendingUpdates: this.pendingUpdates.length
    };
  }
}

export default RefreshManager;
