import { QuickInsertItem, QuickInsertProvider } from '@atlaskit/editor-core';
import { allowListPayloadType } from '../editor/event-dispatch';
import WebBridgeImpl from '../editor/native-to-web';

export const createQuickInsertProvider = async (
  bridge: WebBridgeImpl,
  allowItemsList: allowListPayloadType,
  isQuickInsertEnabled: boolean,
): Promise<QuickInsertProvider> => ({
  getItems: async () => {
    if (isQuickInsertEnabled) {
      const quickInsertItems = await bridge.quickInsertItems;
      return quickInsertItems.filter(
        ({ id }: QuickInsertItem) => id && allowItemsList.has(id),
      );
    }
    return [];
  },
});
