import { EmojiRepository } from '../../../emoji/src/resource';
import { EmojiDescription } from '../../../emoji/src/types';
import { getAtlassianEmojis } from './get-atlassian-emojis';
import { getStandardEmojis } from './get-standard-emojis';
import { mockEmojiResourceFactory } from './mock-emoji-resource-factory';
import { MockEmojiResourceConfig } from './types';

export const getEmojiResourceWithStandardAndAtlassianEmojis = (
  config?: MockEmojiResourceConfig,
) => {
  const standardEmojis: EmojiDescription[] = getStandardEmojis();
  const atlassianEmojis: EmojiDescription[] = getAtlassianEmojis();

  return mockEmojiResourceFactory(
    new EmojiRepository([...standardEmojis, ...atlassianEmojis]),
    config,
  );
};
