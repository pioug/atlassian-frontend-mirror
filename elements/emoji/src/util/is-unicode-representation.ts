import type { EmojiRepresentation, UnicodeRepresentation } from '../types';

export const isUnicodeRepresentation = (rep: EmojiRepresentation): rep is UnicodeRepresentation =>
	!!(rep && (rep as UnicodeRepresentation).unicodeEmoji);
