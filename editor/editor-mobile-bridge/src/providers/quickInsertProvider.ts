import { DeferredValue } from '../utils';
import { QuickInsertItem, QuickInsertProvider } from '@atlaskit/editor-core';
import { getEnableQuickInsertValue } from '../query-param-reader';
import { allowListPayloadType } from '../editor/event-dispatch';

export const createQuickInsertProvider = async (
  deferredQuickInsertItems: DeferredValue<QuickInsertItem[]>,
  allowItemsList: allowListPayloadType,
): Promise<QuickInsertProvider> => ({
  getItems: async () => {
    if (getEnableQuickInsertValue()) {
      const quickInsertItems = await deferredQuickInsertItems;
      return quickInsertItems.filter(
        ({ id }: QuickInsertItem) => id && allowItemsList.has(id),
      );
    }
    return [];
  },
});
