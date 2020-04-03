import {
  getAutoClosingBracketInfo,
  isCursorBeforeClosingBracket,
  isClosingBracket,
} from '../../../ide-ux/bracket-handling';

describe('IDE UX - Bracket handling', () => {
  const forEachBracketPair = (
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
    ].forEach(({ left, right }, i, arr) => {
      const differentBrackets = arr.slice(i - 1)[0];
      return fn(left, right, differentBrackets.left, differentBrackets.right);
    });

  describe('#getAutoClosingBracketInfo', () => {
    forEachBracketPair((left, right, _, differentRight) => {
      describe(`when between a pair of matching brackets '${left}' and '${right}'`, () => {
        it('should set `hasTrailingMatchingBracket` to true', () => {
          expect(
            getAutoClosingBracketInfo(`start ${left}`, `${right} end`),
          ).toEqual({
            left,
            right,
            hasTrailingMatchingBracket: true,
          });
        });
      });

      describe(`when between a pair of non-matching brackets '${left}' and '${differentRight}'`, () => {
        it('should set `hasTrailingMatchingBracket` to false', () => {
          expect(
            getAutoClosingBracketInfo(`start ${left}`, `${differentRight} end`),
          ).toEqual({
            left,
            right,
            hasTrailingMatchingBracket: false,
          });
        });
      });
    });

    describe(`when between no brackets`, () => {
      it('should return an empty result', () => {
        expect(getAutoClosingBracketInfo('start', 'end')).toEqual({
          left: undefined,
          right: undefined,
          hasTrailingMatchingBracket: false,
        });
      });
    });
  });

  describe('#isCursorBeforeClosingBracket', () => {
    forEachBracketPair((_, right) => {
      it(`should return true if afterText starts with a bracket '${right}'`, () => {
        expect(isCursorBeforeClosingBracket(`${right} end`)).toBe(true);
      });
    });
    it('should return false if afterText does not start with a bracket', () => {
      expect(isCursorBeforeClosingBracket('end')).toBe(false);
    });
  });

  describe('#isClosingBracket', () => {
    forEachBracketPair((_, right) => {
      it(`should return true if text is '${right}'`, () => {
        expect(isClosingBracket(right)).toBe(true);
      });
    });
    it('should return false if text is not a bracket', () => {
      expect(isClosingBracket('notABracket')).toBe(false);
    });
  });
});
