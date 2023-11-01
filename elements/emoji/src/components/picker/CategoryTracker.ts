import type { CategoryId } from './categories';

/**
 * Mapping between CategoryId and row
 *
 * Tracks which category is visible based on
 * scrollTop, and virtual rows.
 */
export default class CategoryTracker {
  private categoryToRow!: Map<CategoryId, number>;
  private rowToCategory!: Map<number, CategoryId>;

  constructor() {
    this.reset();
  }

  reset() {
    this.categoryToRow = new Map();
    this.rowToCategory = new Map();
  }

  add(category: CategoryId, row: number) {
    if (!this.categoryToRow.has(category)) {
      this.categoryToRow.set(category, row);
      this.rowToCategory.set(row, category);
    }
  }

  getRow(category: CategoryId): number | undefined {
    return this.categoryToRow.get(category);
  }

  getFirstCategory() {
    return this.rowToCategory.get(0);
  }
}
