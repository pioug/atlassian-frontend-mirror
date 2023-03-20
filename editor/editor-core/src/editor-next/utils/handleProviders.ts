import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { QuickInsertProvider } from '../../plugins/quick-insert/types';
import { EditorProps } from '../../types/editor-props';

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
  props: EditorProps,
  extensionProvider?: ExtensionProvider,
  quickInsertProvider?: Promise<QuickInsertProvider>,
): void {
  const {
    emojiProvider,
    mentionProvider,
    taskDecisionProvider,
    contextIdentifierProvider,
    collabEditProvider,
    activityProvider,
    presenceProvider,
    macroProvider,
    legacyImageUploadProvider,
    media,
    collabEdit,
    autoformattingProvider,
    searchProvider,
    UNSAFE_cards,
    smartLinks,
    linking,
  } = props;

  providerFactory.setProvider('emojiProvider', emojiProvider);
  providerFactory.setProvider('mentionProvider', mentionProvider);
  providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
  providerFactory.setProvider(
    'contextIdentifierProvider',
    contextIdentifierProvider,
  );

  providerFactory.setProvider('mediaProvider', media && media.provider);
  providerFactory.setProvider('imageUploadProvider', legacyImageUploadProvider);
  providerFactory.setProvider(
    'collabEditProvider',
    collabEdit && collabEdit.provider
      ? collabEdit.provider
      : collabEditProvider,
  );
  providerFactory.setProvider('activityProvider', activityProvider);
  providerFactory.setProvider('searchProvider', searchProvider);
  providerFactory.setProvider('presenceProvider', presenceProvider);
  providerFactory.setProvider('macroProvider', macroProvider);

  const cardProvider =
    linking?.smartLinks?.provider ||
    (smartLinks && smartLinks.provider) ||
    (UNSAFE_cards && UNSAFE_cards.provider);
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
