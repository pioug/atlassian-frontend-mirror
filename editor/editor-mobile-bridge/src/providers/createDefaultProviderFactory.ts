import { ProviderFactory } from '@atlaskit/editor-common';
import { createEditorProviders } from './createEditorProviders';
import mockEmojiProvider from './mockEmojiProvider';

export function createDefaultProviderFactory() {
  const {
    mediaProvider,
    mentionProvider,
    cardProvider,
    taskDecisionProvider,
  } = createEditorProviders();

  return ProviderFactory.create({
    mediaProvider,
    mentionProvider,
    cardProvider,
    emojiProvider: Promise.resolve(mockEmojiProvider),
    taskDecisionProvider,
  });
}
