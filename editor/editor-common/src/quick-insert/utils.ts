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

/**
 * This function is used to find and sort QuickInsertItems based on a given query string.
 *
 * @export
 * @param {string} query - The query string to be used in the search.
 * @param {QuickInsertItem[]} items - An array of QuickInsertItems to be searched.
 * @returns {QuickInsertItem[]} - Returns a sorted array of QuickInsertItems based on the priority. If the query string is empty, it will return the array sorted by priority. If a query string is provided, it will return an array of QuickInsertItems that match the query string, sorted by relevance to the query.
 */
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
