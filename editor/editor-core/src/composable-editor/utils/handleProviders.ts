import type { ExtensionProvider } from '@atlaskit/editor-common/extensions/extension-provider';
import type ProviderFactory from '@atlaskit/editor-common/provider-factory/provider-factory';
import type { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory/quick-insert-provider';
import type { Providers } from '@atlaskit/editor-common/provider-factory/types';

/**
 *
 * Utility to set all the providers on a provider factory
 *
 * @param providerFactory
 * @param props
 * @param extensionProvider
 * @param quickInsertProvider
 */
export default function handleProviders(
	providerFactory: ProviderFactory,
	{
		mentionProvider,
		contextIdentifierProvider,
		collabEditProvider,
		activityProvider,
		presenceProvider,
		macroProvider,
		imageUploadProvider,
		searchProvider,
	}: Providers,
	extensionProvider?: ExtensionProvider,
	quickInsertProvider?: Promise<QuickInsertProvider>,
): void {
	providerFactory.setProvider('mentionProvider', mentionProvider);
	providerFactory.setProvider('contextIdentifierProvider', contextIdentifierProvider);
	providerFactory.setProvider('imageUploadProvider', imageUploadProvider);
	providerFactory.setProvider('collabEditProvider', collabEditProvider);
	providerFactory.setProvider('activityProvider', activityProvider);
	providerFactory.setProvider('searchProvider', searchProvider);
	providerFactory.setProvider('presenceProvider', presenceProvider);
	providerFactory.setProvider('macroProvider', macroProvider);

	if (extensionProvider) {
		providerFactory.setProvider('extensionProvider', Promise.resolve(extensionProvider));
	}

	if (quickInsertProvider) {
		providerFactory.setProvider('quickInsertProvider', quickInsertProvider);
	}
}
