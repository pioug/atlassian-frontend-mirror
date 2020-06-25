import { createCardProvider, createCardClient } from './cardProvider';
import { createEmojiProvider } from './emojiProvider';
import { createMediaProvider } from './mediaProvider';
import { createMentionProvider } from './mentionProvider';
import { createTaskDecisionProvider } from './taskDecisionProvider';
import { FetchProxy } from '../utils/fetch-proxy';

export const createEditorProviders = (fetchProxy: FetchProxy) => ({
  cardProvider: createCardProvider(),
  cardClient: createCardClient(),
  emojiProvider: createEmojiProvider(fetchProxy),
  mediaProvider: createMediaProvider(),
  mentionProvider: createMentionProvider(),
  taskDecisionProvider: createTaskDecisionProvider(),
});
