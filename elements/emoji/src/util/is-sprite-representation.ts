import type { EmojiRepresentation, SpriteRepresentation } from '../types';

export const isSpriteRepresentation = (rep: EmojiRepresentation): rep is SpriteRepresentation =>
	!!(rep && (rep as SpriteRepresentation).sprite);
