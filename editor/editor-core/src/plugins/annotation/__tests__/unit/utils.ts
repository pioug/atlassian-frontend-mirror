import {
  annotation,
  doc,
  em,
  p,
  strike,
} from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import {
  surroundingMarks,
  getAllAnnotations,
  addDraftDecoration,
} from '../../utils';
import { Decoration } from 'prosemirror-view';
import { DraftDecorationClassName } from '../../types';
import { Y75, Y200 } from '@atlaskit/theme/colors';

describe('annotation', () => {
  describe('surroundingMarks', () => {
    it('works for nodes on both sides, all marks', () => {
      const testDoc = doc(p(em('hello'), 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.em.create()],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes on both sides, after marks only', () => {
      const testDoc = doc(p('hello', 'al{<>}ex', strike('world')))(
        defaultSchema,
      );

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after', () => {
      const testDoc = doc(p('al{<>}ex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only after, start of node', () => {
      const testDoc = doc(p('{<>}alex', strike('world')))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [],
        [defaultSchema.marks.strike.create()],
      ]);
    });

    it('works for nodes only before', () => {
      const testDoc = doc(p(strike('world'), 'al{<>}ex'))(defaultSchema);

      expect(surroundingMarks(testDoc.resolve(testDoc.refs['<>']))).toEqual([
        [defaultSchema.marks.strike.create()],
        [],
      ]);
    });
  });

  describe('getAllAnnotations', () => {
    it('flat annotations', () => {
      const testDoc = doc(
        p(
          'text',
          annotation({
            annotationType: 'inlineComment',
            id: 'alpaca',
          })('text-alpaca'),
        ),
        p(
          'text',
          annotation({
            annotationType: 'inlineComment',
            id: 'baboon',
          })('text-baboon'),
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca', 'baboon']);
    });

    it('nested annotations', () => {
      const testDoc = doc(
        p(
          'before',
          annotation({
            annotationType: 'inlineComment',
            id: 'alpaca',
          })(
            'text-alpaca',
            annotation({ annotationType: 'inlineComment', id: 'baboon' })(
              'text-baboon',
            ),
            'text-alpaca-after',
          ),
          'after',
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca', 'baboon']);
    });

    it('duplicate annotations', () => {
      const testDoc = doc(
        p(
          'text',
          annotation({
            annotationType: 'inlineComment',
            id: 'alpaca',
          })('text-alpaca'),
        ),
        p(
          'text',
          annotation({
            annotationType: 'inlineComment',
            id: 'alpaca',
          })('text-alpaca'),
        ),
      )(defaultSchema);

      const annotations = getAllAnnotations(testDoc);
      expect(annotations).toEqual(['alpaca']);
    });
  });

  describe('addDraftDecoration', () => {
    it('creates a prosemirror decoration with correct styles', () => {
      const decoration = addDraftDecoration(0, 5);
      expect(decoration).toBeInstanceOf(Decoration);
      expect(decoration.from).toBe(0);
      expect(decoration.to).toBe(5);
      expect((decoration as any).type.attrs).toEqual({
        class: DraftDecorationClassName,
        style: `background-color: ${Y75}; border-bottom: 2px solid ${Y200};`,
      });
    });
  });
});
