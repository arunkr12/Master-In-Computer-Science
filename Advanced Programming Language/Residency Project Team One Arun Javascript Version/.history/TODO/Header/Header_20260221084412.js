class Header {
  constructor(
    title = "TODO App",
    subtitle = "Manage all your tasks efficiently",
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.users = [];
    this.currentUserId = 1;
  }

  setUsers(users) {
    this.users = users || [];
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
      <header class="bg-gradient-primary text-white py-3 shadow-lg" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div class="container">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem;">
            <div style="display:flex; align-items:center; gap:0.75rem; flex:0 0 360px;">
              <div style="font-size:0.75rem; color: rgba(255,255,255,0.95);">LOGGED IN AS</div>
              <div style="font-weight:700; font-size:1rem;">👤 ${currentUser ? currentUser.name : "Unknown"}</div>
            </div>

            <div style="flex:1 1 auto; text-align:center;">
              <div style="font-size:0.85rem; opacity:0.95; margin-bottom:0.25rem;">📝 ${this.subtitle}</div>
              <h1 class="m-0 fw-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px; font-size: 1.6rem;">
                ✨ ${this.title} ✨
              </h1>
            </div>

            <div style="display:flex; align-items:center; justify-content:flex-end; flex:0 0 360px;">
              <select class="user-selector" style="padding: 0.35rem 0.6rem; border-radius: 6px; border: none; background: white; color: #333; font-weight: bold; cursor: pointer; min-width:160px;">
                ${this.users
                  .map(
                    (user) => `
                      <option value="${user.id}" ${user.id === this.currentUserId ? "selected" : ""}>${user.name}</option>
                    `,
                  )
                  .join("")}
              </select>
            </div>
          </div>
        </div>
      </header>
    `;
  }
}

export default Header;
