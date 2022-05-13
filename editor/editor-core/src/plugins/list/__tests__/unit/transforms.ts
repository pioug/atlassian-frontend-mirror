import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { Fragment } from 'prosemirror-model';
import { splitIntoParagraphs } from '../../transforms';

describe('transforms', () => {
  describe('splitIntoParagraphs()', () => {
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
