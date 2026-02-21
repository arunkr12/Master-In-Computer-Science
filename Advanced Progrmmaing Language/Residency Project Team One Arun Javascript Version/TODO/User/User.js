class User {
  constructor(users = [], currentUserId = 1) {
    this.users = users;
    this.currentUserId = currentUserId;
  }

  setUsers(users) {
    this.users = users;
  }

  setCurrentUser(userId) {
    this.currentUserId = userId;
  }

  getCurrentUser() {
    return this.users.find((u) => u.id === this.currentUserId);
  }

  render() {
    const currentUser = this.getCurrentUser();

    return `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
        <div style="color: white;">
          <small style="font-size: 0.75rem; opacity: 0.9;">LOGGED IN AS</small>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
            <div>
              <strong style="font-size: 1.1rem;">👤 ${currentUser ? currentUser.name : "Unknown"}</strong>
              <p style="font-size: 0.85rem; margin: 0.25rem 0; opacity: 0.9;">${currentUser ? currentUser.email : ""}</p>
            </div>
            <select class="user-selector" style="padding: 0.5rem; border-radius: 4px; border: none; background: white; color: #333; font-weight: bold; cursor: pointer;">
              ${this.users
                .map(
                  (user) => `
                <option value="${user.id}" ${user.id === this.currentUserId ? "selected" : ""}>
                  ${user.name}
                </option>
              `,
                )
                .join("")}
            </select>
          </div>
        </div>
      </div>
    `;
  }
}

export default User;
