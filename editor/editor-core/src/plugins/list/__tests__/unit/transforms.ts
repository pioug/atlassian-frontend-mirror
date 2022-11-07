import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Fragment } from 'prosemirror-model';
import { splitIntoParagraphs } from '../../transforms';

describe('transforms', () => {
  describe('splitIntoParagraphs()', () => {
    describe('when the content is invalid for a paragraph', () => {
      it('should do not throw an exception', () => {
        const { panel } = defaultSchema.nodes;
        const emptyPanel = panel.createAndFill();
        const from = Fragment.from([defaultSchema.text('LOL'), emptyPanel!]);

        expect(() => {
          splitIntoParagraphs({
            fragment: from,
            schema: defaultSchema,
          });
        }).not.toThrow();
      });

      it('should do keep the content outside the paragraph', () => {
        const { panel, paragraph } = defaultSchema.nodes;
        const emptyPanel = panel.createAndFill();
        const from = Fragment.from([defaultSchema.text('LOL'), emptyPanel!]);

        // It is inverted because the inner logic of how the mapSlice works
        // We should change this order because it can cause multiple issues
        const expected = Fragment.from([
          panel.createAndFill()!,
          paragraph.createChecked({}, defaultSchema.text('LOL')),
        ]);

        const result = splitIntoParagraphs({
          fragment: from,
          schema: defaultSchema,
        });

        expect(result).toStrictEqual(expected);
      });
    });

    it('should split texts followed by 2 hardBreaks into paragraphs with the texts', () => {
      for (let i = 1; i <= 3; i++) {
        const { paragraph, hardBreak } = defaultSchema.nodes;
        const from = Fragment.from(
          [...Array(i).keys()]
            .map((n) => [
              defaultSchema.text(n.toString()),
              hardBreak.createChecked(),
              hardBreak.createChecked(),
            ])
            .flat(),
        );
        const expected = Fragment.from(
          [...Array(i).keys()].map((n) =>
            paragraph.createChecked({}, defaultSchema.text(n.toString())),
          ),
        );
        const result = splitIntoParagraphs({
          fragment: from,
          schema: defaultSchema,
        });
        expect(result).toStrictEqual(expected);
      }
    });

    // ED-14725 make sure no extra line break is added when pasted from google docs
    it('should split hardBreaks into the same number of empty paragraphs', () => {
      for (let i = 1; i <= 3; i++) {
        const { paragraph, hardBreak } = defaultSchema.nodes;
        const from = Fragment.from(
          [...Array(i).keys()].map(() => hardBreak.createChecked()),
        );
        const expected = Fragment.from(
          [...Array(i).keys()].map(() => paragraph.createChecked()),
        );
        const result = splitIntoParagraphs({
          fragment: from,
          schema: defaultSchema,
        });
        expect(result).toStrictEqual(expected);
      }
    });
  });
});
