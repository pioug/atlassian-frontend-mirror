import { type EmojiRepository } from '@atlaskit/emoji/resource';
import { MockEmojiResource } from './mock-emoji-resource';
import { type MockEmojiResourceConfig, type PromiseBuilder } from './types';

export const mockEmojiResourceFactory = (
	emojiRepository: EmojiRepository,
	config?: MockEmojiResourceConfig,
	promiseBuilder?: PromiseBuilder<any>,
) => {
	const mockEmojiResource = new MockEmojiResource(emojiRepository, config);
	if (promiseBuilder) {
		return promiseBuilder(mockEmojiResource, 'mockEmojiResourceFactory');
	}
	return Promise.resolve(mockEmojiResource);
};
