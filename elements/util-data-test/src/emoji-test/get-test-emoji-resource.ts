import { getTestEmojiRepository } from './get-test-emoji-repository';
import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { type MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResource = (config?: MockEmojiResourceConfig) =>
	mockEmojiResourceFactory(getTestEmojiRepository(), config);
