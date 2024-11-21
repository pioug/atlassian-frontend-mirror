import { combineProviders } from '../provider-helpers';

import type { ExtensionKey, ExtensionType } from './types/extension-manifest';
import type { ExtensionProvider } from './types/extension-provider';

/**
 * Allow to run methods from the `ExtensionProvider` interface across all providers seamlessly.
 * This handles promise racing and discards rejected promises safely.
 */
export default (
	extensionProviders: (ExtensionProvider | Promise<ExtensionProvider>)[],
): ExtensionProvider => {
	const { invokeSingle, invokeList } = combineProviders<ExtensionProvider>(extensionProviders);

	return {
		getExtensions() {
			return invokeList('getExtensions');
		},

		getExtension(type: ExtensionType, key: ExtensionKey) {
			return invokeSingle('getExtension', [type, key]);
		},

		search(keyword: string) {
			return invokeList('search', [keyword]);
		},

		getAutoConverter() {
			return invokeList('getAutoConverter');
		},
	};
};
