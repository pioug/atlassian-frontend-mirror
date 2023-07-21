import { EmojiRepository } from '../../../emoji/src/resource';
import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResourceFromRepository = (
  repo: EmojiRepository,
  config?: MockEmojiResourceConfig,
) => mockEmojiResourceFactory(repo, config);
