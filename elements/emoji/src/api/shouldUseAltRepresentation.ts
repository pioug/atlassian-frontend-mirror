import { type EmojiDescription } from '../types';
import { getPixelRatio } from './getPixelRatio';

const getHeight = (fitToHeight: number): number =>
	getPixelRatio() > 1 ? fitToHeight * 2 : fitToHeight;

export const shouldUseAltRepresentation = (
	emoji: EmojiDescription,
	fitToHeight?: number,
): boolean =>
	!!(
		fitToHeight &&
		emoji.altRepresentation &&
		emoji.representation &&
		'height' in emoji.representation &&
		getHeight(fitToHeight) > emoji.representation.height
	);
