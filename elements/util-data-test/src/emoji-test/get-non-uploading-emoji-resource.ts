import { mockNonUploadingEmojiResourceFactory } from '../emoji/mock-non-uploading-emoji-resource-factory';
import { type MockEmojiResourceConfig } from '../emoji/types';
import { getTestEmojiRepository } from './get-test-emoji-repository';

export const getNonUploadingEmojiResource = (config?: MockEmojiResourceConfig): Promise<any> =>
	mockNonUploadingEmojiResourceFactory(getTestEmojiRepository(), config);
