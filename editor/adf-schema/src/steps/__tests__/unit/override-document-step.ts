import { StepMap } from '@atlaskit/editor-prosemirror/transform';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/editor-test-helpers/schema';
import { OverrideDocumentStep } from '../../override-document-step';

describe('Override Document Step', () => {
  const currentDocument = doc(p('Hello World'));
  const nextDocument: PMNode = doc(
    p('Hey, I am the next document'),
    p('How are you doing?'),
  )(defaultSchema);

  describe('when using the Override Document Step in a transaction', () => {
    it('should succesfully override a document when the step is applied', () => {
      const state = createEditorState(currentDocument);
      const tr = state.tr;

      tr.step(
        new OverrideDocumentStep({
          nextDocument,
        }),
      );

      expect(tr.doc).toEqualDocument(nextDocument);
      expect(tr.docs[0]).toEqualDocument(currentDocument(defaultSchema));
    });

    describe('when the inverted step is applied', () => {
      it('should bring the old document back', () => {
        const state = createEditorState(currentDocument);
        const tr = state.tr;

        const step = new OverrideDocumentStep({
          nextDocument,
        });
        const stepInverted = step.invert(tr.doc);

        tr.step(step);
        tr.step(stepInverted);

        expect(tr.doc).toEqualDocument(currentDocument(defaultSchema));
        expect(tr.docs[1]).toEqualDocument(nextDocument);
        expect(tr.docs[0]).toEqualDocument(currentDocument(defaultSchema));
      });
    });

    describe('when mapping the selection position', () => {
      const smallDocument = doc(
        p('Hello {<>}{cursor}World{nextCursorPosition}'),
      );
      const bigDocument = doc(
        p('Hey, I am the next document'),
        p('How are you{<>}{cursor} doing?{nextCursorPosition}'),
      );

      describe('and when replacing a small document with a big one ', () => {
        it('should proper map the positions', () => {
          const state = createEditorState(smallDocument);
          const nextDocument = bigDocument(defaultSchema);

          expect(state.selection.from).toEqual(
            smallDocument(defaultSchema).refs.cursor,
          );

          const tr = state.tr;

          tr.step(
            new OverrideDocumentStep({
              nextDocument,
            }),
          );

          const nextCursorPosition = nextDocument.refs.nextCursorPosition;

          expect(tr.selection.from).toEqual(nextCursorPosition);
        });
      });

      describe('and when replacing a big document with a small one ', () => {
        it('should proper map the positions', () => {
          const state = createEditorState(bigDocument);
          const nextDocument = smallDocument(defaultSchema);

          expect(state.selection.from).toEqual(
            bigDocument(defaultSchema).refs.cursor,
          );

          const tr = state.tr;

          tr.step(
            new OverrideDocumentStep({
              nextDocument,
            }),
          );

          const nextCursorPosition = nextDocument.refs.nextCursorPosition;

          expect(tr.selection.from).toEqual(nextCursorPosition);
        });
      });
    });
  });

  describe('when using the Override Document Step functions', () => {
    it('should succesfully return the StepResult of nextDocument', () => {
      const step = new OverrideDocumentStep({
        nextDocument,
      });

      const result = step.apply(currentDocument(defaultSchema));

      expect(result.failed).toBeFalsy();
      expect(nextDocument).toStrictEqual(result.doc);
    });

    it('should succesfully get StepMap', () => {
      const step = new OverrideDocumentStep({
        nextDocument,
      });

      const oldSize = currentDocument(defaultSchema).content.size;
      const nextDocumentSize = nextDocument.content.size;

      const result = step.apply(currentDocument(defaultSchema));

      expect(result.failed).toBeFalsy();
      expect(step.getMap()).toStrictEqual(
        new StepMap([0, oldSize, nextDocumentSize]),
      );
    });

    it('should return new mapped step', () => {
      const step = new OverrideDocumentStep({
        nextDocument,
      });

      const mappedStep = step.map();

      expect(mappedStep).toEqual(step);
    });

    it('should return new inverted step', () => {
      const step = new OverrideDocumentStep({
        nextDocument,
      });

      const invertedStep = step.invert(currentDocument(defaultSchema));

      expect(invertedStep.inverted).toEqual(true);
    });

    it('should serialize and de-serialize OverrideDocumentStep', () => {
      const step = new OverrideDocumentStep({
        nextDocument,
      });

      const deserializedStep = OverrideDocumentStep.fromJSON(
        defaultSchema,
        step.toJSON(),
      );

      const stepAppliedResult = step.apply(currentDocument(defaultSchema));
      const deserializedStepAppliedResult = deserializedStep.apply(
        currentDocument(defaultSchema),
      );

      expect(stepAppliedResult.doc).toEqualDocument(
        deserializedStepAppliedResult.doc,
      );
    });
  });
});
