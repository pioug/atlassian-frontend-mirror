import type { EmojiServiceRepresentation, SpriteServiceRepresentation } from '../types';

export const isSpriteServiceRepresentation = (
	rep: EmojiServiceRepresentation,
): rep is SpriteServiceRepresentation => !!(rep && (rep as SpriteServiceRepresentation).spriteRef);
