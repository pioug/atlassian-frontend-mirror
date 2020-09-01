import { splitText, calcTextSplitOffset } from '../../text';

describe('Annotations: draft/text', () => {
  const text = 'Martin Luther King';

  describe('#calcTextSplitOffset', () => {
    describe('when the draft position starts and ends at the text position', () => {
      it('should return the offset of the entire text', () => {
        const draftPosition = {
          from: 1,
          to: 1 + text.length,
        };
        const textPosition = {
          start: 1,
          end: 1 + text.length,
        };
        const result = calcTextSplitOffset(draftPosition, textPosition, text);

        expect(result).toEqual({
          startOffset: 0,
          endOffset: 18,
        });
      });
    });

    describe('when the draft position starts before the text position', () => {
      it('should return the relative offset', () => {
        const draftPosition = {
          from: 1,
          to: 10,
        };
        const textPosition = {
          start: 5,
          end: 5 + text.length,
        };
        const result = calcTextSplitOffset(draftPosition, textPosition, text);

        expect(result).toEqual({
          startOffset: 0,
          endOffset: 5,
        });
      });
    });

    describe('when the draft position stars inside the text position', () => {
      it('should return the relative offset', () => {
        const draftPosition = {
          from: 10,
          to: 20 + text.length,
        };
        const textPosition = {
          start: 5,
          end: 5 + text.length,
        };
        const result = calcTextSplitOffset(draftPosition, textPosition, text);

        expect(result).toEqual({
          startOffset: 5,
          endOffset: 18,
        });
      });
    });

    describe('when the draft position stars and ends inside the text position', () => {
      it('should return the relative offset', () => {
        const draftPosition = {
          from: 7,
          to: 12,
        };
        const textPosition = {
          start: 5,
          end: 5 + text.length,
        };
        const result = calcTextSplitOffset(draftPosition, textPosition, text);

        expect(result).toEqual({
          startOffset: 2,
          endOffset: 7,
        });
      });
    });
  });

  describe('#splitText', () => {
    [
      {
        name: 'splits the text in two pieces if offset is at the beginning',
        offset: { startOffset: 0, endOffset: 6 },
        expected: ['Martin', ' Luther King'],
      },
      {
        name: 'splits the text in two pieces if offset is at the end',
        offset: { startOffset: 7, endOffset: 18 },
        expected: ['Martin ', 'Luther King'],
      },
      {
        name: 'splits the text in three pieces if offset is in the middle',
        offset: { startOffset: 7, endOffset: 13 },
        expected: ['Martin ', 'Luther', ' King'],
      },
      {
        name: 'returns null when the startOffset is nigger than endOffset',
        offset: { startOffset: 50, endOffset: 13 },
        expected: null,
      },
      {
        name: 'returns null when endOffset is bigger than text size',
        offset: { startOffset: 0, endOffset: 19 },
        expected: null,
      },
      {
        name: 'returns null when the endOffset is same as startOffset',
        offset: { startOffset: 0, endOffset: 0 },
        expected: null,
      },
    ].forEach(({ name, offset, expected }) => {
      it(name, () => expect(splitText(text, offset)).toEqual(expected));
    });
  });
});
