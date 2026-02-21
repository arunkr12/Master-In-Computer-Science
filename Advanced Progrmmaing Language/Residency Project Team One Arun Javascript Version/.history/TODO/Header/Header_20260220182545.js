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
      <header class="bg-primary text-white py-4">
        <div class="container">
          <h1 class="m-0">${this.title}</h1>
          <p class="m-0 text-white-50">${this.subtitle}</p>
        </div>
      </header>
    `;
  }
}

export default Header;
