import { Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { setSelectionTransform } from '@atlaskit/editor-test-helpers/set-selection-transform';
import {
  doc,
  p,
  a,
  alignment,
  panel,
  RefsNode,
} from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { toJSON } from '../../../../utils';
import { handleParagraphBlockMarks } from '../../handlers';

function createEditorState(documentNode: RefsNode) {
  const editorState = EditorState.create({
    doc: documentNode,
  });
  const { tr } = editorState;
  setSelectionTransform(documentNode, tr);
  return editorState.apply(tr);
}

describe('handleParagraphBlockMarks', () => {
  let slice: Slice;

  describe('slice has alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithAlignment = doc(
        alignment({ align: 'end' })(p('hello')), // source
      )(defaultSchema);

      const json = toJSON(paragraphWithAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    describe('destination supports those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            p('{<>}'), // destination
          )(defaultSchema),
        );
      });

      it('should decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(0);
      });

      it('retains alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks[0].type.name).toEqual(
          'alignment',
        );
      });
    });

    describe('destination does not support those marks', () => {
      let state: EditorState;

      beforeEach(() => {
        state = createEditorState(
          doc(
            panel()(p('{<>}')), // destination
          )(defaultSchema),
        );
      });

      it('should not decrement the open depth of the slice', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.openStart).toEqual(1);
      });

      it('drops alignment or indentation marks', () => {
        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.firstChild?.marks.length).toEqual(0);
      });

      it('handles multiple paragraphs', () => {
        const multipleParagraphs = doc(
          p('normal text'),
          alignment({ align: 'end' })(p('hello')),
          p('normal text'),
        )(defaultSchema);

        const json = toJSON(multipleParagraphs);
        slice = Slice.fromJSON(defaultSchema, {
          content: json.content,
          openStart: 1,
          openEnd: 1,
        });

        const expectedFragment = doc(
          p('normal text'),
          p('hello'),
          p('normal text'),
        )(defaultSchema);

        const modifiedSlice = handleParagraphBlockMarks(state, slice);
        expect(modifiedSlice.content.eq(expectedFragment.content)).toBeTruthy();
      });
    });
  });

  describe('slice does not have alignment or indentation marks', () => {
    beforeEach(() => {
      const paragraphWithoutAlignment = doc(
        p(
          a({ href: 'https://hello.atlassian.net' })('hello'), // source
        ),
      )(defaultSchema);

      const json = toJSON(paragraphWithoutAlignment);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });
    });

    it('should not decrement the open depth of the slice', () => {
      const state = createEditorState(
        doc(
          panel()(p('{<>}')), // destination
        )(defaultSchema),
      );

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(1);
    });
  });

  describe('destination already has content', () => {
    let state: EditorState;

    beforeEach(() => {
      state = createEditorState(
        doc(
          alignment({ align: 'center' })(p('pre-existing text {<>}')), // destination
        )(defaultSchema),
      );
    });

    it('pasting a single paragraph should not alter the slice', () => {
      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.eq(slice)).toBeTruthy();
    });

    it('pasting multiple paragraphs should keep source formatting', () => {
      const multipleParagraphs = doc(
        p('normal text'),
        alignment({ align: 'end' })(p('hello')),
        p('normal text'),
      )(defaultSchema);

      const json = toJSON(multipleParagraphs);
      slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      const modifiedSlice = handleParagraphBlockMarks(state, slice);
      expect(modifiedSlice.openStart).toEqual(0);
    });
  });
});
