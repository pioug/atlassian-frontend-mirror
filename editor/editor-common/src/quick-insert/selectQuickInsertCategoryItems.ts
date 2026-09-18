import type { RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

import { quickInsertProviderMenuItemKey } from './getQuickInsertProviderMenuItemKey';

const DEFAULT_ITEM_LIMIT = 30;
const ECOSYSTEM_ITEM_LIMIT = 10;
export type QuickInsertCategoryItemSelectionPolicy = (
	items: RegisterMenuItem[],
) => RegisterMenuItem[];

const isEcosystemQuickInsertItem = (item: RegisterMenuItem): boolean =>
	quickInsertProviderMenuItemKey.isEcosystem(item.key);

/**
 * Keeps the initial native and ecosystem results while ensuring ecosystem registrations
 * remain discoverable beyond the default category item limit.
 */
export const selectQuickInsertCategoryItems: QuickInsertCategoryItemSelectionPolicy = (items) => {
	let ecosystemItemCount = 0;

	return items.filter((item, index) => {
		const isEcosystemItem = isEcosystemQuickInsertItem(item);
		if (isEcosystemItem) {
			ecosystemItemCount++;
		}

		return (
			index < DEFAULT_ITEM_LIMIT || (isEcosystemItem && ecosystemItemCount <= ECOSYSTEM_ITEM_LIMIT)
		);
	});
};
