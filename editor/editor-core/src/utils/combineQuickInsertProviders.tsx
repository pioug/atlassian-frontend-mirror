import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import { combineProviders } from '@atlaskit/editor-common/provider-helpers';

export function combineQuickInsertProviders(
	quickInsertProviders: Array<QuickInsertProvider | Promise<QuickInsertProvider>>,
): QuickInsertProvider {
	const { invokeList, invokeOptionalList } =
		combineProviders<QuickInsertProvider>(quickInsertProviders);

	return {
		getComponents() {
			return invokeOptionalList('getComponents');
		},
		getItems() {
			return invokeList('getItems');
		},
	};
}
