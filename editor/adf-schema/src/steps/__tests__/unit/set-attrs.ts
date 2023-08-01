import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { doc, panel, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { SetAttrsStep } from '../../set-attrs';

describe('SetAttrs Step', () => {
  const originalDocument = doc(
    // prettier-ignore
    panel({ type: 'info' })(
      p('lol'),
    ),
  )(defaultSchema);

  describe('when the step is applied in document', () => {
    it('should apply the attributes at the node', () => {
      const step = new SetAttrsStep(0, { type: 'error' });

      const result = step.apply(originalDocument);
      expect(result.doc).toEqualDocument(
        doc(panel({ type: 'error' })(p('lol'))),
      );
    });

    it('should generate a revertable step adding the previous attribute', () => {
      const step = new SetAttrsStep(0, { type: 'error' });

      const revertStep = step.invert(originalDocument);
      const result = revertStep.apply(originalDocument);

      expect(result.doc).toEqualDocument(
        doc(panel({ type: 'info' })(p('lol'))),
      );
    });
  });

  describe('when the node position changes', () => {
    it('should map its internal positions', () => {
      const transformer = new Transform(originalDocument);

      const step = new SetAttrsStep(0, { type: 'error' });

      transformer.insert(0, defaultSchema.text('X'));

      step.map(transformer.mapping);

      const result = step.apply(transformer.doc);

      expect(result.doc).toEqualDocument(
        // prettier-ignore
        doc(

          p('X'),
          panel({ type: 'error' })(
            p('lol'),
          ),
        ),
      );
    });
  });

  describe('when the target is a text node', () => {
    it('should return an invalid step', () => {
      const invalidDocument = doc(p('lol'))(defaultSchema);

      const step = new SetAttrsStep(1, { type: 'error' });

      const result = step.apply(invalidDocument);

      expect(result.failed).toBeTruthy();
    });
  });
});
