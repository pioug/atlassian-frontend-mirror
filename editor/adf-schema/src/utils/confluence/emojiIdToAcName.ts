import type { acNameToEmoji } from './acNameToEmoji';
import { acNameToEmojiMap } from './acNameToEmojiMap';

export function emojiIdToAcName(emojiId: string): never {
	const filterEmojis = (acName: keyof typeof acNameToEmojiMap) =>
		acNameToEmojiMap[acName] ? acNameToEmojiMap[acName][0] === emojiId : false;
	return (Object.keys(acNameToEmojiMap) as Array<keyof typeof acNameToEmoji>).filter(
		filterEmojis,
	)[0];
}
