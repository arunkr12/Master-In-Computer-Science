/**
 * ConcurrencyManager - Handles optimistic locking and conflict detection
 * Supports multiple users accessing/editing tasks concurrently
 */
class ConcurrencyManager {
  constructor() {
    this.localCache = new Map(); // Cache local version numbers
    this.conflictListeners = [];
  }

  /**
   * Cache a todo's current version
   */
  cacheVersion(todoId, version) {
    this.localCache.set(todoId, version);
  }

  /**
   * Get cached version number
   */
  getCachedVersion(todoId) {
    return this.localCache.get(todoId);
  }

  /**
   * Detect version conflict
   * Returns true if server version differs from cached version
   */
  isVersionConflict(todoId, serverVersion) {
    const cachedVersion = this.getCachedVersion(todoId);
    if (cachedVersion === undefined) return false;
    return cachedVersion !== serverVersion;
  }

  /**
   * Perform optimistic update with version checking
   * @returns {Promise<Object>} {success: boolean, conflict: boolean, message: string}
   */
  async validateUpdate(todoId, cachedVersion, serverTodo) {
    // Check if version matches
    if (cachedVersion !== serverTodo.version) {
      return {
        success: false,
        conflict: true,
        message: `Conflict detected! Task was modified by ${this.getUserName(serverTodo.lastModifiedBy)} at ${serverTodo.lastModifiedAt}`,
        serverTodo: serverTodo,
      };
    }

    return {
      success: true,
      conflict: false,
      message: "Update allowed",
    };
  }

  /**
   * Merge conflicting changes
   * Uses last-write-wins strategy as default
   */
  resolveConflict(localChanges, remoteChanges) {
    const resolution = {
      merged: true,
      strategy: "last-write-wins",
      resolvedData: {},
    };

    // Last-write-wins: take the most recent changes
    const remoteTime = new Date(remoteChanges.lastModifiedAt).getTime();
    const localTime = new Date(
      localChanges.lastModifiedAt || new Date(),
    ).getTime();

    if (remoteTime > localTime) {
      resolution.resolvedData = remoteChanges;
      resolution.winner = "remote";
    } else {
      resolution.resolvedData = localChanges;
      resolution.winner = "local";
    }

    return resolution;
  }

  /**
   * Register listener for conflict events
   */
  onConflict(callback) {
    this.conflictListeners.push(callback);
  }

  /**
   * Notify conflict listeners
   */
  notifyConflict(conflictInfo) {
    this.conflictListeners.forEach((listener) => listener(conflictInfo));
  }

  /**
   * Helper to get user name (in production, would use user service)
   */
  getUserName(userId) {
    const userMap = {
      1: "Arun",
      2: "Tarak",
      3: "Admin",
    };
    return userMap[userId] || `User ${userId}`;
  }

  /**
   * Create new version for updated todo
   */
  incrementVersion(todo, userId) {
    return {
      ...todo,
      version: (todo.version || 1) + 1,
      lastModifiedBy: userId,
      lastModifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Clear cached version data
   */
  clear() {
    this.localCache.clear();
  }

  /**
   * Remove a cached version for a specific todo (used when records get deleted)
   */
  removeVersion(todoId) {
    this.localCache.delete(todoId);
  }
}

export default ConcurrencyManager;
