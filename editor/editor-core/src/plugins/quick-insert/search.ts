import Fuse from 'fuse.js';
import { QuickInsertItem } from '@atlaskit/editor-common/src/provider-factory/quick-insert-provider';

const options = {
  threshold: 0.3,
  keys: [
    // Weights must sum to <= 1.0
    { name: 'title', weight: 0.5 },
    { name: 'priority', weight: 0.3 },
    { name: 'keywords', weight: 0.15 },
    { name: 'description', weight: 0.04 },
    { name: 'keyshortcut', weight: 0.01 },
  ],
};

export function find(query: string, items: QuickInsertItem[]) {
  const fuse = new Fuse(items, options);
  if (query === '') {
    // Copy and sort list by priority
    return items
      .slice(0)
      .sort(
        (a, b) =>
          (a.priority || Number.POSITIVE_INFINITY) -
          (b.priority || Number.POSITIVE_INFINITY),
      );
  }

  return fuse.search(query);
}
