import { calcInsertDraftPositionOnText } from '../../position';
import { InsertDraftPosition } from '../../../types';

describe('Annotations: draft/position', () => {
  describe('#calcInsertDraftPositionOnText', () => {
    const textPosition = {
      start: 5,
      end: 10,
    };

    describe('when the draft position starts before and ends after the text', () => {
      it('should return InsertDraftPosition.AROUND_TEXT', () => {
        const draftPosition = {
          from: 1,
          to: 15,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toEqual(InsertDraftPosition.AROUND_TEXT);
      });
    });

    describe('when the draft position starts before and ends inside the text', () => {
      it('should return InsertDraftPosition.START', () => {
        const draftPosition = {
          from: 1,
          to: textPosition.start + 2,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toEqual(InsertDraftPosition.START);
      });
    });

    describe('when the draft position starts inside and ends after the text', () => {
      it('should return InsertDraftPosition.END', () => {
        const draftPosition = {
          from: textPosition.start + 1,
          to: textPosition.start + textPosition.end + 1,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toEqual(InsertDraftPosition.END);
      });
    });

    describe('when the draft position starts and ends inside of the text', () => {
      it('should return InsertDraftPosition.INSIDE', () => {
        const draftPosition = {
          from: textPosition.start + 1,
          to: textPosition.start + 2,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toEqual(InsertDraftPosition.INSIDE);
      });
    });

    describe('when the draft position starts and ends before of the text', () => {
      it('should return false', () => {
        const draftPosition = {
          from: 1,
          to: 2,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toBe(false);
      });
    });

    describe('when the draft position starts and ends after of the text', () => {
      it('should return false', () => {
        const draftPosition = {
          from: 100,
          to: 150,
        };
        const result = calcInsertDraftPositionOnText(
          textPosition,
          draftPosition,
        );

        expect(result).toBe(false);
      });
    });
  });
});
