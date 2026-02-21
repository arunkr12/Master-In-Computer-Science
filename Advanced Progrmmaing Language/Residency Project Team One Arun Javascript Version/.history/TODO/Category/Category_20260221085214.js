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
                ${(() => {
                  const activeAll = this.currentCategoryId == null;
                  const allStyle = `background: #e9ecef; color: #333; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: none; cursor: pointer; ${
                    activeAll
                      ? 'box-shadow: 0 6px 18px rgba(0,0,0,0.14); transform: translateY(-2px); outline: 2px solid rgba(0,0,0,0.06);'
                      : ''
                  }`;
                  const allBtn = `<button class="category-btn" data-id="0" aria-pressed="${activeAll ? 'true' : 'false'}" style="${allStyle}">All</button>`;

                  const catBtns = this.categories
                    .map((cat) => {
                      const active = this.currentCategoryId === cat.id;
                      const activeStyle = active
                        ? 'box-shadow: 0 8px 24px rgba(0,0,0,0.16); transform: translateY(-2px); outline: 2px solid rgba(255,255,255,0.12); font-weight: 800;'
                        : '';
                      return `
                        <button class="category-btn" data-id="${cat.id}" aria-pressed="${active ? 'true' : 'false'}" style="background: ${cat.color}; color: white; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; display: inline-flex; align-items: center; gap: 0.3rem; border: none; cursor: pointer; ${activeStyle}">
                          ${cat.name}
                        </button>
                      `;
                    })
                    .join("");

                  return allBtn + catBtns;
                })()}
        </div>
      </div>
    `;
  }
}

export default Category;
