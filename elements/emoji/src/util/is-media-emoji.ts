import type { EmojiDescription } from '../types';
import { isMediaRepresentation } from './is-media-representation';

export const isMediaEmoji = (emoji: EmojiDescription): boolean =>
	isMediaRepresentation(emoji.representation);
