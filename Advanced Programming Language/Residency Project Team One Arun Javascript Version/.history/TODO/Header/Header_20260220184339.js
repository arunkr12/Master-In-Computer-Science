class Header {
  constructor(
    title = "TODO App",
    subtitle = "Manage all your tasks efficiently",
  ) {
    this.title = title;
    this.subtitle = subtitle;
  }

  render() {
    return `
      <header class="bg-gradient-primary text-white py-5 shadow-lg" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div class="container">
          <div class="text-center">
            <h1 class="m-0 display-4 fw-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 1px;">
              ✨ ${this.title} ✨
            </h1>
            <p class="m-0 mt-2 lead text-white" style="font-size: 1.2rem; opacity: 0.95;">
              📝 ${this.subtitle}
            </p>
          </div>
        </div>
      </header>
    `;
  }
}

export default Header;
