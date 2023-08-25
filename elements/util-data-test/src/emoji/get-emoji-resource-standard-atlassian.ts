import { EmojiRepository } from '@atlaskit/emoji/resource';
import { EmojiDescription } from '@atlaskit/emoji/types';
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
