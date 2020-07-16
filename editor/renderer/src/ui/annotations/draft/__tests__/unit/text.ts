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
    describe('when the offset is at the begin of the string', () => {
      it('should split the text in two pieces', () => {
        const offset = {
          startOffset: 0,
          endOffset: 6,
        };
        const result = splitText(text, offset);

        expect(result).toEqual(['Martin', ' Luther King']);
      });
    });

    describe('when the offset is at the end of the string', () => {
      it('should split the text in two piecs', () => {
        const offset = {
          startOffset: 7,
          endOffset: 18,
        };
        const result = splitText(text, offset);

        expect(result).toEqual(['Martin ', 'Luther King']);
      });
    });

    describe('when the offset is on the middle of the string', () => {
      it('should split the text in three pieces', () => {
        const offset = {
          startOffset: 7,
          endOffset: 13,
        };
        const result = splitText(text, offset);

        expect(result).toEqual(['Martin ', 'Luther', ' King']);
      });
    });

    describe('when the offset is invalid', () => {
      it('should return null', () => {
        const offset = {
          startOffset: 50,
          endOffset: 13,
        };
        const result = splitText(text, offset);

        expect(result).toBeNull();
      });
    });

    describe('when the endOffset is big than text size', () => {
      it('should return null', () => {
        const offset = {
          startOffset: 0,
          endOffset: 19,
        };
        const result = splitText(text, offset);

        expect(result).toBeNull();
      });
    });
  });
});
