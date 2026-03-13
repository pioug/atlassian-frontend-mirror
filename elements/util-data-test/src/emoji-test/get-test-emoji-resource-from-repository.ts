import { type EmojiRepository } from '@atlaskit/emoji/resource';
import { mockEmojiResourceFactory } from '../emoji/mock-emoji-resource-factory';
import { type MockEmojiResourceConfig } from '../emoji/types';

export const getTestEmojiResourceFromRepository = (
	repo: EmojiRepository,
	config?: MockEmojiResourceConfig,
): Promise<any> => mockEmojiResourceFactory(repo, config);
