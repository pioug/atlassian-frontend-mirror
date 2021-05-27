import { getTestEmojiRepository } from '../emoji-test/get-test-emoji-repository';
import { mockNonUploadingEmojiResourceFactory } from '../emoji/mock-non-uploading-emoji-resource-factory';
import { MockEmojiResourceConfig } from '../emoji/types';

export const getNonUploadingEmojiResource = (
  config?: MockEmojiResourceConfig,
) => mockNonUploadingEmojiResourceFactory(getTestEmojiRepository(), config);
