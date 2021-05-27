import { getTestEmojiRepository } from './get-test-emoji-repository';
import { mockNonUploadingEmojiResourceFactory } from '../emoji/mock-non-uploading-emoji-resource-factory';
import { MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResourceNonUploading = (
  config?: MockEmojiResourceConfig,
) => mockNonUploadingEmojiResourceFactory(getTestEmojiRepository(), config);
