import type { EmojiRepresentation } from '../types';
import { dataURLPrefix } from './constants';
import { isImageRepresentation } from './is-image-representation';

export const hasDataURLImage = (rep: EmojiRepresentation): boolean =>
	isImageRepresentation(rep) && rep.imagePath.indexOf(dataURLPrefix) === 0;
