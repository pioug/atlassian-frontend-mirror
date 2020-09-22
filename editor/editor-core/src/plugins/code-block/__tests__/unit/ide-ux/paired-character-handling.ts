import {
  isCursorBeforeClosingCharacter,
  isClosingCharacter,
} from '../../../ide-ux/paired-character-handling';

describe('IDE UX - Paired character handling', () => {
  const forEachCharacterPair = (
    fn: (
      left: string,
      right: string,
      differentLeft: string,
      differentRight: string,
    ) => any,
  ) =>
    [
      { left: '{', right: '}' },
      { left: '[', right: ']' },
      { left: '(', right: ')' },
      { left: "'", right: "'" },
      { left: '"', right: '"' },
      { left: '`', right: '`' },
    ].forEach(({ left, right }, i, arr) => {
      const pairedCharacters = arr.slice(i - 1)[0];
      return fn(left, right, pairedCharacters.left, pairedCharacters.right);
    });

  describe('#isCursorBeforeClosingCharacter', () => {
    forEachCharacterPair((_, right) => {
      it(`should return true if afterText starts with '${right}'`, () => {
        expect(isCursorBeforeClosingCharacter(`${right} end`)).toBe(true);
      });
    });
    it('should return false if afterText does not start with a bracket or quote', () => {
      expect(isCursorBeforeClosingCharacter('end')).toBe(false);
    });
  });

  describe('#isClosingCharacter', () => {
    forEachCharacterPair((_, right) => {
      it(`should return true if text is '${right}'`, () => {
        expect(isClosingCharacter(right)).toBe(true);
      });
    });
    it('should return false if text is not a bracket or quote', () => {
      expect(isClosingCharacter('notABracket')).toBe(false);
    });
  });
});
