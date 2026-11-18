import type { ReactNode } from 'react';

/** Product-owned, cached eligibility for AI emoji generation. */
export type EmojiAICreditStatus =
	| { isBlocked: false }
	| { isBlocked: true; renderCustomContent: () => ReactNode };

/** Synchronous eligibility check for AI emoji generation. */
export type GetAICreditStatus = (context: {
	featureName: 'emojiPicker-createEmoji';
}) => EmojiAICreditStatus;

export const checkEmojiAICreditStatus = (
	getAICreditStatus?: GetAICreditStatus,
): EmojiAICreditStatus => {
	if (!getAICreditStatus) {
		return { isBlocked: false };
	}
	try {
		return getAICreditStatus({ featureName: 'emojiPicker-createEmoji' });
	} catch {
		return { isBlocked: false };
	}
};
