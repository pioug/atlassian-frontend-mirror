import { DeferredValue } from '../utils';
import { QuickInsertItem, QuickInsertProvider } from '@atlaskit/editor-core';
import { allowListPayloadType } from '../editor/event-dispatch';

export const createQuickInsertProvider = async (
  deferredQuickInsertItems: DeferredValue<QuickInsertItem[]>,
  allowItemsList: allowListPayloadType,
  isQuickInsertEnabled: boolean,
): Promise<QuickInsertProvider> => ({
  getItems: async () => {
    if (isQuickInsertEnabled) {
      const quickInsertItems = await deferredQuickInsertItems;
      return quickInsertItems.filter(
        ({ id }: QuickInsertItem) => id && allowItemsList.has(id),
      );
    }
    return [];
  },
});
