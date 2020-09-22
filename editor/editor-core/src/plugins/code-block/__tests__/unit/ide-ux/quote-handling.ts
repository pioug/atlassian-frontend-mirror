import {
  getAutoClosingQuoteInfo,
  shouldAutoCloseQuote,
} from '../../../ide-ux/quote-handling';

describe('IDE UX - Quote handling', () => {
  const forEachQuotePair = (
    fn: (
      left: string,
      right: string,
      differentLeft: string,
      differentRight: string,
    ) => any,
  ) =>
    [
      { left: "'", right: "'" },
      { left: '"', right: '"' },
      { left: '`', right: '`' },
    ].forEach(({ left, right }, i, arr) => {
      const differentQuotes = arr.slice(i - 1)[0];
      return fn(left, right, differentQuotes.left, differentQuotes.right);
    });

  describe('#getAutoClosingQuoteInfo', () => {
    forEachQuotePair((left, right, _, differentRight) => {
      describe(`when between a pair of matching quotes '${left}' and '${right}'`, () => {
        it('should set `hasTrailingMatchingQuote` to true', () => {
          expect(
            getAutoClosingQuoteInfo(`start ${left}`, `${right} end`),
          ).toEqual({
            left,
            right,
            hasTrailingMatchingQuote: true,
          });
        });
      });

      describe(`when between a pair of non-matching quotes '${left}' and '${differentRight}'`, () => {
        it('should set `hasTrailingMatchingQuote` to false', () => {
          expect(
            getAutoClosingQuoteInfo(`start ${left}`, `${differentRight} end`),
          ).toEqual({
            left,
            right,
            hasTrailingMatchingQuote: false,
          });
        });
      });
    });

    describe(`when between no quotes`, () => {
      it('should return an empty result', () => {
        expect(getAutoClosingQuoteInfo('start', 'end')).toEqual({
          left: undefined,
          right: undefined,
          hasTrailingMatchingQuote: false,
        });
      });
    });
  });

  describe('#shouldAutoCloseQuote', () => {
    it('should return true when directly before a closing bracket', () => {
      expect(shouldAutoCloseQuote(' ', '}')).toBeTruthy();
      expect(shouldAutoCloseQuote(' ', ']')).toBeTruthy();
      expect(shouldAutoCloseQuote(' ', ')')).toBeTruthy();
    });

    it('should return false when directly before a non-whitespace character', () => {
      expect(shouldAutoCloseQuote(' ', 'end')).toBeFalsy();
    });

    it('should return false when directly after a letter or quote', () => {
      expect(shouldAutoCloseQuote('start', ' ')).toBeFalsy();
      expect(shouldAutoCloseQuote('"', ' ')).toBeFalsy();
    });

    it('should return true otherwise', () => {
      expect(shouldAutoCloseQuote('start ', '')).toBeTruthy();
      expect(shouldAutoCloseQuote('', ' end')).toBeTruthy();
    });
  });
});
