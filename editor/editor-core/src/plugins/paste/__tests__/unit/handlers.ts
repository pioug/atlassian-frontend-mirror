import { Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import {
  doc,
  p,
  a,
  ul,
  li,
  alignment,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import { toJSON } from '../../../../utils';
import {
  handleParagraphBlockMarks,
  flattenNestedListInSlice,
  insertIntoPanel,
} from '../../handlers';

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
          ),
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
          ),
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
        ),
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
        ),
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

describe('handleRichText', () => {
  describe('pasting into a table', () => {
    it('should flatten nested list on its own', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c{>}')
          )
        )
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        )
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 3,
        openEnd: 3,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should flatten nested list and preserve following contents (single paragraph)', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c')
          ),
        ),
        p('text after list{>}')
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        ),
        p('text after list')
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 1,
        openEnd: 1,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should flatten nested list and preserve following contents (paragraph + separate list)', () => {
      // prettier-ignore
      const pasteContent = doc(
        ul(
          li(
            p('a'),
            '{<}',
            ul(
              li(
                p('b')
              )
            )
          ),
          li(
            p('c')
          ),
        ),
        p('text between lists'),
        ul(
          li(
            p('d'),
          ),
          li(
            p('e{>}')
          ),
        )
      );
      const pasteOriginState = createEditorState(pasteContent);
      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const expectedContent = doc(
        ul(
          li(
            p('b')
          ),
          li(
            p('c')
          )
        ),
        p('text between lists'),
        ul(
          li(
            p('d')
          ),
          li(
            p('e')
          )
        )
      )(defaultSchema);
      const expectedSlice = Slice.fromJSON(defaultSchema, {
        content: toJSON(expectedContent).content,
        openStart: 3,
        openEnd: 3,
      });

      const flattenedSlice = flattenNestedListInSlice(pasteSlice);
      expect(flattenedSlice.eq(expectedSlice)).toBeTruthy();
    });

    it('should copy list inside a panel accordingly', () => {
      // prettier-ignore
      const originalDoc = createEditorState(
        doc(
          panel()(
            ul(
              li(p('{<}a')),
              li(p('b{>}'))
            ),
          ),
        )
      );
      const { tr } = originalDoc;

      // prettier-ignore
      const pasteOriginState = createEditorState(
        doc(
          panel()(
            ul(
              li(p('{<}1')),
              li(p('2{>}'))
            ),
          ),
        )
      );

      const pasteSlice = pasteOriginState.doc.slice(
        pasteOriginState.selection.from,
        pasteOriginState.selection.to,
        // @ts-ignore
        true, // include parents
      );

      // prettier-ignore
      const resultDoc = doc(
        panel()(
          ul(
            li(p('1')),
            li(p('2{<>}'))
          ),
        ),
      )(defaultSchema);

      const { panel: panelNode } = pasteOriginState.schema.nodes;

      insertIntoPanel(tr, pasteSlice, panelNode);
      expect(tr).toEqualDocumentAndSelection(resultDoc);
    });
  });
});
