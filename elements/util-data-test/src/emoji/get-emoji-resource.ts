import { getEmojiRepository } from './get-emoji-repository';
import { mockEmojiResourceFactory } from './mock-emoji-resource-factory';
import { MockEmojiResourceConfig } from './types';

export const getEmojiResource = (config?: MockEmojiResourceConfig) =>
  mockEmojiResourceFactory(getEmojiRepository(), config);
