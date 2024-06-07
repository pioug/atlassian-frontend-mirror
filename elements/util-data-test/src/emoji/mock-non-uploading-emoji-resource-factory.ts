import { type EmojiRepository } from '@atlaskit/emoji/resource';
import { MockNonUploadingEmojiResource } from './mock-non-uploading-emoji-resource';
import { type MockEmojiResourceConfig, type PromiseBuilder } from './types';

export const mockNonUploadingEmojiResourceFactory = (
	emojiRepository: EmojiRepository,
	config?: MockEmojiResourceConfig,
	promiseBuilder?: PromiseBuilder<any>,
) => {
	const mockEmojiResource = new MockNonUploadingEmojiResource(emojiRepository, config);
	if (promiseBuilder) {
		return promiseBuilder(mockEmojiResource, 'mockNonUploadingEmojiResourceFactory');
	}
	return Promise.resolve(mockEmojiResource);
};
