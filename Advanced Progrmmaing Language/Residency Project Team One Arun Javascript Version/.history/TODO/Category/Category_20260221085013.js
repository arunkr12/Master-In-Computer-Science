class Category {
  constructor(categories = []) {
    this.categories = categories;
    this.currentCategoryId = null;
  }

  setCategories(categories) {
    this.categories = categories;
  }

  setCurrentCategory(categoryId) {
    this.currentCategoryId = categoryId;
  }

  getCategoryById(id) {
    return this.categories.find((c) => c.id === id);
  }

  getCategoryColor(categoryId) {
    const category = this.getCategoryById(categoryId);
    return category ? category.color : "#999";
  }

  render() {
    return `
      <div style="margin-bottom: 1rem;">
        <h6 style="color: #333; font-weight: bold; margin-bottom: 0.75rem; font-size: 0.95rem;">📂 Task Categories</h6>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="category-btn" data-id="0" style="background: #e9ecef; color: #333; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: none; cursor: pointer;">All</button>
          ${this.categories
            .map(
              (cat) => {
                const active = this.currentCategoryId === cat.id ? 'box-shadow: 0 0 0 3px rgba(0,0,0,0.05); opacity: 0.95; transform: translateY(-1px);' : '';
                return `
            <button class="category-btn" data-id="${cat.id}" style="background: ${cat.color}; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; display: inline-flex; align-items: center; gap: 0.3rem; border: none; cursor: pointer; ${active}">
              ${cat.name}
            </button>
          `;
              },
            )
            .join("")}
        </div>
      </div>
    `;
  }
}

export default Category;
