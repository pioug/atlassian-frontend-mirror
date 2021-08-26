import Fuse from 'fuse.js';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { dedupe } from '../../utils';
import { QuickInsertPluginState, QuickInsertPluginOptions } from './types';

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

export const searchQuickInsertItems = (
  quickInsertState: QuickInsertPluginState,
  options?: QuickInsertPluginOptions,
) => (query?: string, category?: string): QuickInsertItem[] => {
  const defaultItems =
    options && options.disableDefaultItems
      ? []
      : quickInsertState.lazyDefaultItems();
  const providedItems = quickInsertState.providedItems;

  const items = providedItems
    ? dedupe([...defaultItems, ...providedItems], (item) => item.title)
    : defaultItems;

  return find(
    query || '',
    category === 'all' || !category
      ? items
      : items.filter(
          (item) => item.categories && item.categories.includes(category),
        ),
  );
};

export const getFeaturedQuickInsertItems = (
  { providedItems, lazyDefaultItems }: QuickInsertPluginState,
  options?: QuickInsertPluginOptions,
) => (): QuickInsertItem[] => {
  const defaultItems =
    options && options.disableDefaultItems ? [] : lazyDefaultItems();

  const items = providedItems
    ? dedupe([...defaultItems, ...providedItems], (item) => item.title)
    : defaultItems;

  return items.filter((item) => item.featured);
};
