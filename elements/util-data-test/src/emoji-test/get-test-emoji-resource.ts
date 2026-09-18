import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { type MockEmojiResourceConfig } from '../emoji/types';
import { getTestEmojiRepository } from './get-test-emoji-repository';

export const getTestEmojiResource = (config?: MockEmojiResourceConfig): Promise<any> =>
	mockEmojiResourceFactory(getTestEmojiRepository(), config);
