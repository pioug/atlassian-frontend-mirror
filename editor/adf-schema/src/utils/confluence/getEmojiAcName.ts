import { acNameToEmojiMap } from './acNameToEmojiMap';
import { DEFAULT_EMOJI_ACNAME, DEFAULT_EMOJI_ID } from './emoji';
import { emojiIdToAcName } from './emojiIdToAcName';

function getAcNameFromShortName(shortName: string) {
	return shortName.slice(
		shortName[0] === ':' ? 1 : 0,
		shortName[shortName.length - 1] === ':' ? -1 : shortName.length,
	);
}

export function getEmojiAcName({ id, shortName }: { id: string; shortName: string }): string {
	if (DEFAULT_EMOJI_ID === id) {
		const possibleName = getAcNameFromShortName(shortName);
		if (possibleName in acNameToEmojiMap) {
			return possibleName;
		}
	}

	return emojiIdToAcName(id) || DEFAULT_EMOJI_ACNAME;
}
