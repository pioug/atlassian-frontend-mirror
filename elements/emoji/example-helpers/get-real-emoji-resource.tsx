import { EmojiResource } from '../src/resource';
import { getEmojiConfig } from './get-emoji-config';

// get emojiProvider
export function getRealEmojiResource(): any {
	const resource = new EmojiResource(getEmojiConfig());
	return resource;
}
