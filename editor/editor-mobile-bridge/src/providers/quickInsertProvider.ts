import { DeferredValue } from '../utils';
import {
  QuickInsertItem,
  QuickInsertProvider,
  QuickInsertItemId,
} from '@atlaskit/editor-core';
import { getEnableQuickInsertValue } from '../query-param-reader';

const whitelist: QuickInsertItemId[] = [
  'blockquote',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'codeblock',
  'unorderedList',
  'orderedList',
  'rule',
  'mention',
  'emoji',
  'action',
  'decision',
  'infopanel',
  'notepanel',
  'successpanel',
  'warningpanel',
  'errorpanel',
  'layout',
];

export const createQuickInsertProvider = async (
  deferredQuickInsertItems: DeferredValue<QuickInsertItem[]>,
): Promise<QuickInsertProvider> => ({
  getItems: async () => {
    if (getEnableQuickInsertValue()) {
      const quickInsertItems = await deferredQuickInsertItems;
      return quickInsertItems.filter(
        ({ id }: QuickInsertItem) => id && whitelist.includes(id),
      );
    }

    return [];
  },
});
