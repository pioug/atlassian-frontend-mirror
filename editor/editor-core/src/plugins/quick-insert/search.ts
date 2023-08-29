import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertSearchOptions } from '@atlaskit/editor-common/types';
import { dedupe } from '@atlaskit/editor-common/utils';
import { find } from '@atlaskit/editor-common/quick-insert';

type GetQuickInsertSuggestions = (
  searchOptions: QuickInsertSearchOptions,
  lazyDefaultItems?: () => QuickInsertItem[],
  providedItems?: QuickInsertItem[],
) => QuickInsertItem[];

export const getQuickInsertSuggestions: GetQuickInsertSuggestions = (
  searchOptions,
  lazyDefaultItems = () => [],
  providedItems,
) => {
  const { query, category, disableDefaultItems, featuredItems } = searchOptions;
  const defaultItems = disableDefaultItems ? [] : lazyDefaultItems();

  const items = providedItems
    ? dedupe([...defaultItems, ...providedItems], (item) => item.title)
    : defaultItems;

  if (featuredItems) {
    return items.filter((item) => item.featured);
  }

  return find(
    query || '',
    category === 'all' || !category
      ? items
      : items.filter(
          (item) => item.categories && item.categories.includes(category),
        ),
  );
};
