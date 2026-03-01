class Footer {
  constructor(year = 2026, projectName = "TODO App") {
    this.year = year;
    this.projectName = projectName;
  }

  render() {
    return `
      <footer class="py-4 mt-5">
        <div class="container text-center text-muted">
          <p class="mb-1">&copy; ${this.year} ${this.projectName}. All rights reserved.</p>
          <p class="mb-0">Built As Residency Project</p>
        </div>
      </footer>
    `;
  }
}

export default Footer;
