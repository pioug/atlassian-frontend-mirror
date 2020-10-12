import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';
import { CategoryId } from './categories';

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

  findNearestCategoryAbove(
    startIndex: number,
    list?: VirtualList,
  ): CategoryId | undefined {
    const rows = Array.from(this.rowToCategory.keys()).sort((a, b) => a - b);
    if (rows.length === 0) {
      return;
    }

    // Return first category if list not yet rendered
    // or the top row is above the first category
    if (!list || rows[0] > startIndex) {
      return this.rowToCategory.get(rows[0]);
    }

    let bounds = [0, rows.length - 1];
    let index = Math.floor(rows.length / 2);

    while (rows[index] !== startIndex && bounds[0] < bounds[1]) {
      if (rows[index] > startIndex) {
        bounds[1] = Math.max(index - 1, 0);
      } else {
        bounds[0] = index + 1;
      }
      index = Math.floor((bounds[0] + bounds[1]) / 2);
    }

    const headerRow =
      rows[rows[index] > startIndex ? Math.max(index - 1, 0) : index];

    return this.rowToCategory.get(headerRow);
  }
}
