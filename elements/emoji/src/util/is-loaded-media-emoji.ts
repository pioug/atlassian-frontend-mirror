import type { EmojiDescription } from '../types';
import { customCategory } from './constants';
import { hasDataURLImage } from './has-data-url-image';

export const isLoadedMediaEmoji = (emoji: EmojiDescription): boolean =>
	emoji.category === customCategory && hasDataURLImage(emoji.representation);
