import Fuse from 'fuse.js';
import memoizeOne from 'memoize-one';
import type { IntlShape } from 'react-intl-next';

import type { QuickInsertItem } from '../provider-factory';
import type { QuickInsertHandler } from '../types';

const processQuickInsertItems = (
  items: Array<QuickInsertHandler | QuickInsertItem>,
  intl: IntlShape,
) => {
  return items.reduce(
    (
      acc: Array<QuickInsertItem>,
      item: QuickInsertHandler | QuickInsertItem,
    ) => {
      if (typeof item === 'function') {
        const quickInsertItems = item(intl);
        return acc.concat(quickInsertItems);
      }
      return acc.concat(item);
    },
    [],
  );
};

export const memoProcessQuickInsertItems: typeof processQuickInsertItems =
  memoizeOne(processQuickInsertItems);

const options = {
  threshold: 0.3,
  keys: [
    { name: 'title', weight: 0.57 },
    { name: 'priority', weight: 0.3 },
    { name: 'keywords', weight: 0.08 },
    { name: 'description', weight: 0.04 },
    { name: 'keyshortcut', weight: 0.01 },
  ],
};

export function find(
  query: string,
  items: QuickInsertItem[],
): QuickInsertItem[] {
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

  return fuse.search(query).map((result) => result.item);
}
