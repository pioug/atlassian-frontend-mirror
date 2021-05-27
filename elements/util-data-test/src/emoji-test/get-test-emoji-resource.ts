import { getTestEmojiRepository } from './get-test-emoji-repository';
import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResource = (config?: MockEmojiResourceConfig) =>
  mockEmojiResourceFactory(getTestEmojiRepository(), config);
