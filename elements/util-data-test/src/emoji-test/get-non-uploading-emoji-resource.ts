import { getTestEmojiRepository } from './get-test-emoji-repository';
import { mockNonUploadingEmojiResourceFactory } from '../emoji/mock-non-uploading-emoji-resource-factory';
import { type MockEmojiResourceConfig } from '../emoji/types';

export const getNonUploadingEmojiResource = (config?: MockEmojiResourceConfig) =>
	mockNonUploadingEmojiResourceFactory(getTestEmojiRepository(), config);
