import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import type {
	ProviderFactory,
	Providers,
	QuickInsertProvider,
} from '@atlaskit/editor-common/provider-factory';

/**
 *
 * Utility to set all the providers on a provider factory
 *
 * @param providerFactory
 * @param props
 * @param extensionProvider
 * @param quickInsertProvider
 */
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
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
