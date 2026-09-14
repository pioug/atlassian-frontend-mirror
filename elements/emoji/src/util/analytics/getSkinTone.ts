import { skinTones } from './skinTones';

export const getSkinTone: any = (emojiId?: string) => {
	if (!emojiId) {
		return {};
	}
	for (const { id, skinToneModifier } of skinTones) {
		if (emojiId.indexOf(id) !== -1) {
			return { skinToneModifier, baseEmojiId: emojiId.replace(id, '') };
		}
	}

	return {};
};
