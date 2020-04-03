import {
  isWhiteSpace,
  isClose,
  getDirection,
  getGroupStartIndices,
  createSpansForCharacters,
  createSpansForGroups,
  calculateTotalLength,
  putInternalPositions,
} from '../../cursorPositions';

describe('MediaEditor cursor positions', () => {
  const getBoundingClientRectMethod = 'getBoundingClientRect';

  describe('isWhiteSpace', () => {
    it('should return true for space', () => {
      expect(isWhiteSpace(' ')).toBe(true);
    });

    it('should return true for tab character', () => {
      expect(isWhiteSpace('\t')).toBe(true);
    });

    it('should return false for letter character', () => {
      expect(isWhiteSpace('a')).toBe(false);
    });
  });

  describe('isClose', () => {
    it('should return true for same values', () => {
      expect(isClose(4.5, 4.5)).toBe(true);
    });

    it('should return true for values that are closer that 1 screen unit', () => {
      expect(isClose(5.1, 5.75)).toBe(true);
    });

    it('should return false for values that differ in 1 screen unit', () => {
      expect(isClose(5, 6)).toBe(false);
    });

    it('should return false for values that differ in more thatn 1 unit', () => {
      expect(isClose(-1, 1)).toBe(false);
    });
  });

  describe('getDirection', () => {
    let first: HTMLSpanElement;
    let second: HTMLSpanElement;

    beforeEach(() => {
      first = document.createElement('span');
      second = document.createElement('span');
    });

    it('should return undefined for index below zero', () => {
      expect(getDirection(-1, [first, second])).toBeUndefined();
    });

    it('should return undefined for index larger than length', () => {
      expect(getDirection(4, [first, second])).toBeUndefined();
    });

    it('should return undefined for index equal to length', () => {
      expect(getDirection(2, [first, second])).toBeUndefined();
    });

    it('should return undefined for index equal to 0', () => {
      expect(getDirection(0, [first, second])).toBeUndefined();
    });

    it('should return ltr if previous character is to the left and close', () => {
      jest
        .spyOn(first, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 10, right: 12.3 } as DOMRect));
      jest
        .spyOn(second, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 12.4, right: 20 } as DOMRect));

      expect(getDirection(1, [first, second])).toBe('ltr');
    });

    it('should return undefined if previous character is to the left but far', () => {
      jest
        .spyOn(first, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 10, right: 11.3 } as DOMRect));
      jest
        .spyOn(second, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 12.4, right: 20 } as DOMRect));

      expect(getDirection(1, [first, second])).toBeUndefined();
    });

    it('should return rtl if previous character is to the right and close', () => {
      jest
        .spyOn(first, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 30, right: 32.3 } as DOMRect));
      jest
        .spyOn(second, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 21.5, right: 29.4 } as DOMRect));

      expect(getDirection(1, [first, second])).toBe('rtl');
    });

    it('should return undefined if previous character is to the right but far', () => {
      jest
        .spyOn(first, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 30, right: 32.3 } as DOMRect));
      jest
        .spyOn(second, getBoundingClientRectMethod)
        .mockImplementation(() => ({ left: 21.5, right: 23.4 } as DOMRect));

      expect(getDirection(1, [first, second])).toBeUndefined();
    });
  });

  describe('getGroupStartIndices', () => {
    it('should return empty array for empty array of groups', () => {
      const inds = getGroupStartIndices([]);

      expect(inds).toEqual([]);
    });

    it('should return zero for one group', () => {
      const inds = getGroupStartIndices([{ text: ['a'] }]);

      expect(inds).toEqual([0]);
    });

    it('should return correct indices for multiple groups', () => {
      const inds = getGroupStartIndices([
        { text: ['a', 'b'] },
        { text: ['c', 'd', 'e', 'f'] },
        { text: ['g', 'h', 'i'] },
        { text: ['k'] },
      ]);

      expect(inds).toEqual([0, 2, 6, 9]);
    });
  });

  describe('createSpansForCharacters', () => {
    let parentSpan: HTMLSpanElement;

    beforeEach(() => {
      parentSpan = document.createElement('span');
    });

    it('should return empty array for empty text', () => {
      const spans = createSpansForCharacters([], parentSpan);

      expect(spans).toEqual([]);
    });

    it('should return spans for each character in text', () => {
      const spans = createSpansForCharacters(['a', 'b', 'c', 'd'], parentSpan);

      expect(spans[0].innerText).toBe('a');
      expect(spans[1].innerText).toBe('b');
      expect(spans[2].innerText).toBe('c');
      expect(spans[3].innerText).toBe('d');
      expect(spans.every(span => span.parentElement === parentSpan)).toBe(true);
    });
  });

  describe('createSpansForGroups', () => {
    let parentSpan: HTMLSpanElement;

    beforeEach(() => {
      parentSpan = document.createElement('span');
    });

    it('should return empty array for empty array of groups', () => {
      const spans = createSpansForGroups([], parentSpan);

      expect(spans).toEqual([]);
    });

    it('should return spans for each group', () => {
      const spans = createSpansForGroups(
        [{ text: ['a', 'b', 'c', 'd'] }, { text: ['e'] }, { text: ['f', 'g'] }],
        parentSpan,
      );

      expect(spans[0].innerText).toBe('abcd');
      expect(spans[1].innerText).toBe('e');
      expect(spans[2].innerText).toBe('fg');
      expect(spans.every(span => span.parentElement === parentSpan)).toBe(true);
    });
  });

  describe('calculateTotalLength', () => {
    it('should return 0 for empty group array', () => {
      expect(calculateTotalLength([])).toBe(0);
    });

    it('should return length of group for one group', () => {
      expect(
        calculateTotalLength([
          { text: [], direction: 'ltr', startIndex: 0, xmin: -1, xmax: 4 },
        ]),
      ).toBe(5);
    });

    it('should return total length of groups', () => {
      expect(
        calculateTotalLength([
          { text: [], direction: 'ltr', startIndex: 0, xmin: -1, xmax: 4 },
          { text: [], direction: 'rtl', startIndex: 0, xmin: 4, xmax: 25 },
          { text: [], direction: 'ltr', startIndex: 0, xmin: 25, xmax: 34 },
          { text: [], direction: 'rtl', startIndex: 0, xmin: 34, xmax: 48 },
        ]),
      ).toBe(49);
    });
  });

  describe('putInternalPositions', () => {
    const identicalPos = (pos: number) => pos;
    let span: HTMLSpanElement;

    beforeEach(() => {
      span = document.createElement('span');
    });

    it('should do nothing if the text is empty', () => {
      const cursorPositions = [-10, -10, -10];
      putInternalPositions(
        [],
        span,
        cursorPositions,
        0,
        identicalPos,
        identicalPos,
      );

      expect(cursorPositions).toEqual([-10, -10, -10]);
    });

    it('should do nothing if the text contains one character', () => {
      const cursorPositions = [-10, -10, -10];
      putInternalPositions(
        ['a'],
        span,
        cursorPositions,
        0,
        identicalPos,
        identicalPos,
      );

      expect(cursorPositions).toEqual([-10, -10, -10]);
    });

    it('should add one position if the text contains two characters', () => {
      const cursorPositions = [-10, -10, -10];
      putInternalPositions(
        ['a', 'b'],
        span,
        cursorPositions,
        0,
        pos => pos + 15,
        identicalPos,
      );

      expect(cursorPositions).toEqual([-10, 15, -10]);
    });

    it('should add multiple positions if the the text contains multiple characters', () => {
      const cursorPositions = [-10, -10, -10, -10, -10, -10, -10];

      let callCount = 0;
      jest.spyOn(span, getBoundingClientRectMethod).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return { left: 10, right: 20 } as DOMRect;
        }
        if (callCount === 2) {
          return { left: 10, right: 30 } as DOMRect;
        }
        if (callCount === 3) {
          return { left: 10, right: 40 } as DOMRect;
        }
        if (callCount === 4) {
          return { left: 10, right: 50 } as DOMRect;
        }
        if (callCount === 5) {
          return { left: 10, right: 60 } as DOMRect;
        }

        return {} as DOMRect;
      });

      putInternalPositions(
        ['a', 'b', 'c', 'd', 'e', 'f'],
        span,
        cursorPositions,
        0,
        pos => pos + 15,
        identicalPos,
      );

      expect(cursorPositions).toEqual([-10, 25, 35, 45, 55, 65, -10]);
    });

    it('should add multiple positions if the the text contains multiple characters and apply limiter', () => {
      const cursorPositions = [-10, -10, -10, -10, -10, -10, -10];

      let callCount = 0;
      jest.spyOn(span, getBoundingClientRectMethod).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return { left: 10, right: 20 } as DOMRect;
        }
        if (callCount === 2) {
          return { left: 10, right: 30 } as DOMRect;
        }
        if (callCount === 3) {
          return { left: 10, right: 40 } as DOMRect;
        }
        if (callCount === 4) {
          return { left: 10, right: 50 } as DOMRect;
        }
        if (callCount === 5) {
          return { left: 10, right: 60 } as DOMRect;
        }
        return {} as DOMRect;
      });

      putInternalPositions(
        ['a', 'b', 'c', 'd', 'e', 'f'],
        span,
        cursorPositions,
        0,
        pos => pos + 15,
        pos => Math.min(pos, 53),
      );

      expect(cursorPositions).toEqual([-10, 25, 35, 45, 53, 53, -10]);
    });
  });
});
