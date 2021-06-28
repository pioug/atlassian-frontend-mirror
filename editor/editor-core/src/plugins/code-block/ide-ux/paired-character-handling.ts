import { BRACKET_MAP, BracketMapKey } from './bracket-handling';
import { QUOTE_MAP, QuoteMapKey } from './quote-handling';

type PairedCharacterMapKey = BracketMapKey | QuoteMapKey;

const PAIRED_CHARACTER_MAP = {
  ...BRACKET_MAP,
  ...QUOTE_MAP,
};

export const isCursorBeforeClosingCharacter = (after: string) => {
  return (Object.keys(PAIRED_CHARACTER_MAP) as Array<
    PairedCharacterMapKey
  >).some((leftCharacter) =>
    after.startsWith(PAIRED_CHARACTER_MAP[leftCharacter]),
  );
};

export const isClosingCharacter = (text: string) => {
  return (Object.keys(PAIRED_CHARACTER_MAP) as Array<
    PairedCharacterMapKey
  >).some((leftCharacter) => text === PAIRED_CHARACTER_MAP[leftCharacter]);
};
