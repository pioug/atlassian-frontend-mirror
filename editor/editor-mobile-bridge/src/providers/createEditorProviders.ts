import { createCardProvider, createCardClient } from './cardProvider';
import { createEmojiProvider } from './emojiProvider';
import { createMediaProvider } from './mediaProvider';
import { createMentionProvider } from './mentionProvider';
import { createTaskDecisionProvider } from './taskDecisionProvider';

export const createEditorProviders = () => ({
  cardProvider: createCardProvider(),
  cardClient: createCardClient(),
  emojiProvider: createEmojiProvider(),
  mediaProvider: createMediaProvider(),
  mentionProvider: createMentionProvider(),
  taskDecisionProvider: createTaskDecisionProvider(),
});
