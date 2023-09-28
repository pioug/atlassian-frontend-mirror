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
export default function handleProviders(
  providerFactory: ProviderFactory,
  {
    emojiProvider,
    mentionProvider,
    taskDecisionProvider,
    contextIdentifierProvider,
    collabEditProvider,
    activityProvider,
    presenceProvider,
    macroProvider,
    imageUploadProvider,
    mediaProvider,
    autoformattingProvider,
    searchProvider,
    cardProvider,
  }: Providers,
  extensionProvider?: ExtensionProvider,
  quickInsertProvider?: Promise<QuickInsertProvider>,
): void {
  providerFactory.setProvider('emojiProvider', emojiProvider);
  providerFactory.setProvider('mentionProvider', mentionProvider);
  providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
  providerFactory.setProvider(
    'contextIdentifierProvider',
    contextIdentifierProvider,
  );

  providerFactory.setProvider('mediaProvider', mediaProvider);
  providerFactory.setProvider('imageUploadProvider', imageUploadProvider);
  providerFactory.setProvider('collabEditProvider', collabEditProvider);
  providerFactory.setProvider('activityProvider', activityProvider);
  providerFactory.setProvider('searchProvider', searchProvider);
  providerFactory.setProvider('presenceProvider', presenceProvider);
  providerFactory.setProvider('macroProvider', macroProvider);

  if (cardProvider) {
    providerFactory.setProvider('cardProvider', cardProvider);
  }

  providerFactory.setProvider('autoformattingProvider', autoformattingProvider);

  if (extensionProvider) {
    providerFactory.setProvider(
      'extensionProvider',
      Promise.resolve(extensionProvider),
    );
  }

  if (quickInsertProvider) {
    providerFactory.setProvider('quickInsertProvider', quickInsertProvider);
  }
}
