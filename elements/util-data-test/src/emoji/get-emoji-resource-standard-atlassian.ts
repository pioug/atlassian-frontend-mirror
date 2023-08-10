// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiRepository } from '@atlaskit/emoji/resource';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
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
