// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { EmojiRepository } from '@atlaskit/emoji/resource';
import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResourceFromRepository = (
  repo: EmojiRepository,
  config?: MockEmojiResourceConfig,
) => mockEmojiResourceFactory(repo, config);
