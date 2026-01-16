import type { BracketMapKey } from './bracket-handling';
import { BRACKET_MAP } from './bracket-handling';
import type { QuoteMapKey } from './quote-handling';
import { QUOTE_MAP } from './quote-handling';

type PairedCharacterMapKey = BracketMapKey | QuoteMapKey;

const PAIRED_CHARACTER_MAP = {
	...BRACKET_MAP,
	...QUOTE_MAP,
};

export const isCursorBeforeClosingCharacter = (after: string): boolean => {
	return (Object.keys(PAIRED_CHARACTER_MAP) as Array<PairedCharacterMapKey>).some((leftCharacter) =>
		after.startsWith(PAIRED_CHARACTER_MAP[leftCharacter]),
	);
};

export const isClosingCharacter = (text: string): boolean => {
	return (Object.keys(PAIRED_CHARACTER_MAP) as Array<PairedCharacterMapKey>).some(
		(leftCharacter) => text === PAIRED_CHARACTER_MAP[leftCharacter],
	);
};
