import {
  getAutoClosingBracketInfo,
  shouldAutoCloseBracket,
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

  describe('#shouldAutoCloseBracket', () => {
    it('should return true when directly before a closing bracket', () => {
      expect(shouldAutoCloseBracket(' ', '}')).toBeTruthy();
      expect(shouldAutoCloseBracket(' ', ']')).toBeTruthy();
      expect(shouldAutoCloseBracket(' ', ')')).toBeTruthy();
    });

    it('should return false when directly before a non-whitespace character', () => {
      expect(shouldAutoCloseBracket(' ', 'end')).toBeFalsy();
    });

    it('should return true otherwise', () => {
      expect(shouldAutoCloseBracket('start ', '')).toBeTruthy();
      expect(shouldAutoCloseBracket('', ' end')).toBeTruthy();
    });
  });
});
