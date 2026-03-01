class Footer {
  constructor(year = 2026, projectName = "ToDoList") {
    this.year = year;
    this.projectName = projectName;
  }

  render() {
    return `
      <footer class="py-5 mt-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-top: 3px solid #667eea;">
        <div class="container">
          <div class="row text-center">
            <div class="col-md-12">
              <p class="mb-2 fw-bold" style="font-size: 1.1rem;">💼 ${this.projectName}</p>
              <p class="mb-1 opacity-75">&copy; ${this.year} - All rights reserved</p>
              <p class="mb-0 opacity-75">✨ Built as Advanced Programming Residency Project</p>
              <p class="mt-3 opacity-75" style="font-size: 0.9rem;">
                Powered by: HTML5 • JavaScript • Bootstrap • Tailwind • JSON Server
              </p>
            </div>
          </div>
          <hr class="my-3 opacity-25">
          <div class="text-center opacity-75">
            <small>Team: Arun & Tarak | University Of Cumberland</small>
          </div>
        </div>
      </footer>
    `;
  }
}

export default Footer;
