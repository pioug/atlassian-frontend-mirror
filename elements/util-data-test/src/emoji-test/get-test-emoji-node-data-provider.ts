import { EmojiNodeDataProvider } from '@atlaskit/editor-plugin-emoji';

import { MockEmojiResource } from '../emoji/mock-emoji-resource';
import { getTestEmojiRepository } from './get-test-emoji-repository';

export function getTestEmojiNodeDataProvider(): EmojiNodeDataProvider {
	return new EmojiNodeDataProvider(new MockEmojiResource(getTestEmojiRepository()) as any);
}
