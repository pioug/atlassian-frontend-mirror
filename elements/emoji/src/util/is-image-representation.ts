import type {
	EmojiImageRepresentation,
	EmojiRepresentation,
	EmojiServiceRepresentation,
	ImageRepresentation,
} from '../types';

export const isImageRepresentation = (
	rep: EmojiRepresentation | EmojiServiceRepresentation | EmojiImageRepresentation,
): rep is ImageRepresentation => !!(rep && (rep as ImageRepresentation).imagePath);
