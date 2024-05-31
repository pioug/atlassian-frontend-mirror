import type { QuickInsertSharedState } from '@atlaskit/editor-common/types';
import { useEffect } from 'react';
import { memoProcessQuickInsertItems } from '@atlaskit/editor-common/quick-insert';
import { toNativeBridge } from '../web-to-native';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { IntlShape } from 'react-intl-next';
import type WebBridgeImpl from '../native-to-web';

/**
 * Allows for extending the quickInsertItems actions with the provided extendedActions.
 * The provided extended action will then be called after the original action is executed.
 * This is useful for mobile communications where we need to talk to the mobile bridge.
 */
const extendQuickInsertAction = (
	quickInsertItems: QuickInsertItem[],
	extendedActions?: Record<string, Function>,
) => {
	if (!extendedActions) {
		return quickInsertItems;
	}
	return quickInsertItems.map((quickInsertItem) => {
		const quickInsertId = quickInsertItem.id;
		if (quickInsertId && extendedActions[quickInsertId]) {
			const originalAction = quickInsertItem.action;
			quickInsertItem.action = (insert, state) => {
				const result = originalAction(insert, state);
				extendedActions[quickInsertId](quickInsertItem);
				return result;
			};
		}
		return quickInsertItem;
	});
};

export const useQuickInsertListener = (
	quickInsertState: QuickInsertSharedState | null | undefined,
	bridge: WebBridgeImpl,
	intl: IntlShape,
) => {
	useEffect(() => {
		if (!quickInsertState) {
			return;
		}

		// Listen for the quick-insert plugin state to initialise and then populate the quick insert items in mobile bridge state
		const defaultItems = [quickInsertState.lazyDefaultItems()];
		const processedItems = memoProcessQuickInsertItems(defaultItems, intl);
		if (processedItems) {
			const extendedActions = {
				hyperlink: (quickInsertItem: QuickInsertItem) => {
					// Call native side for items that have to be handled natively
					toNativeBridge.typeAheadItemSelected(JSON.stringify(quickInsertItem));
				},
			};
			const quickInsertItems = extendQuickInsertAction(processedItems, extendedActions);

			bridge.setQuickInsertItems(quickInsertItems);
		}
	}, [quickInsertState, intl, bridge]);
};
