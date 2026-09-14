import { getRealEmojiResource } from './get-real-emoji-resource';

// get promise emojiProvider for dataProviders in editor/renderer
export function getRealEmojiProvider(): any {
	const resource = getRealEmojiResource();
	return resource.getEmojiProvider();
}
