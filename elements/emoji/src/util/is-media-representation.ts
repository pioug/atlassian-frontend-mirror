import type {
	EmojiImageRepresentation,
	EmojiRepresentation,
	MediaApiRepresentation,
} from '../types';

export const isMediaRepresentation = (
	rep: EmojiRepresentation | EmojiImageRepresentation,
): rep is MediaApiRepresentation => !!(rep && (rep as MediaApiRepresentation).mediaPath);
