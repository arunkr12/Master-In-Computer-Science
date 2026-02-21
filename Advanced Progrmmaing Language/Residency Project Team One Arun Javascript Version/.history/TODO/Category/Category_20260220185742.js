class Category {
  constructor(categories = []) {
    this.categories = categories;
  }

  setCategories(categories) {
    this.categories = categories;
  }

  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  }

  getCategoryColor(categoryId) {
    const category = this.getCategoryById(categoryId);
    return category ? category.color : '#999';
  }

  render() {
    return `
      <div style="margin-bottom: 1rem;">
        <h6 style="color: #333; font-weight: bold; margin-bottom: 0.75rem; font-size: 0.95rem;">📂 Task Categories</h6>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          ${this.categories.map(cat => `
            <span style="background: ${cat.color}; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; display: inline-flex; align-items: center; gap: 0.3rem;">
              ${cat.name}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }
}

export default Category;
