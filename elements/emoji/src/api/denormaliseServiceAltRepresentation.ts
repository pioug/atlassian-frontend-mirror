import { type AltRepresentations, type EmojiMeta, type EmojiRepresentation } from '../types';
import { denormaliseServiceRepresentation } from './denormaliseServiceRepresentation';
import { getAltRepresentation } from './getAltRepresentation';

export const denormaliseServiceAltRepresentation = (
	altReps?: AltRepresentations,
	meta?: EmojiMeta,
): EmojiRepresentation => {
	return !altReps || Object.keys(altReps).length === 0
		? undefined
		: denormaliseServiceRepresentation(getAltRepresentation(altReps), meta);
};
