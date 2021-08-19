import {
  doc,
  p,
  ul,
  li,
  code_block,
  breakout,
  table,
  tr,
  td,
  tdEmpty,
  layoutSection,
  layoutColumn,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import codeBlockPlugin from '../../';
import layoutPlugin from '../../../layout';
import blockTypePlugin from '../../../block-type';
import basePlugin from '../../../base';
import widthPlugin from '../../../width';
import tablesPlugin from '../../../table';
import breakoutPlugin from '../../../breakout';
import listPlugin from '../../../list';

describe('codeBlock - keymaps', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add(codeBlockPlugin)
        .add(layoutPlugin)
        .add(blockTypePlugin)
        .add(basePlugin)
        .add(listPlugin)
        .add(widthPlugin)
        .add([
          tablesPlugin,
          {
            tableOptions: {},
            breakoutEnabled: true,
            allowContextualMenu: true,
          },
        ])
        .add([breakoutPlugin, { allowBreakoutButton: true }]),
    });

  describe('Enter keypress', () => {
    describe('when enter key is pressed 1 time', () => {
      it('it should not exit code block', () => {
        const { editorView } = editor(doc(code_block()('codeBlock{<>}')));

        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('codeBlock\n')),
        );
      });
    });

    describe('when enter key is pressed 2 times', () => {
      it('should not exit code block', () => {
        const { editorView } = editor(
          doc(breakout({ mode: 'wide' })(code_block()('codeBlock{<>}'))),
        );

        sendKeyToPm(editorView, 'Enter');
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(breakout({ mode: 'wide' })(code_block()('codeBlock\n\n'))),
        );
      });
    });

    describe('when there is an empty paragraph at the end of the document', () => {
      it('it should not exit code block if selection is not at the end', () => {
        const { editorView } = editor(doc(code_block()('{<>}codeBlock\n')));

        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('\ncodeBlock\n')),
        );
      });

      it('it should not exit code block if selection is at the end', () => {
        const { editorView } = editor(doc(code_block()('codeBlock\n{<>}')));

        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(code_block()('codeBlock\n\n')),
        );
      });
    });
  });

  describe('Backspace', () => {
    it('should remove the code block if the cursor is at the beginning of the code block - 1', () => {
      const { editorView } = editor(
        doc(breakout({ mode: 'wide' })(code_block()('{<>}'))),
      );

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(doc(p()));
    });

    it('should remove the code block if the cursor is at the beginning of the code block - 2', () => {
      const { editorView } = editor(doc(p('Hello'), code_block()('{<>}')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(doc(p('Hello')));
    });

    describe('when codeblock is nested inside list item', () => {
      it('should remove the code block if the cursor is at the beginning of the code block - 2', () => {
        const { editorView } = editor(doc(ul(li(code_block()('{<>}Hello')))));

        sendKeyToPm(editorView, 'Backspace');
        expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('Hello')))));
      });
    });

    it('should remove the code block if the cursor is at the beginning of the code block - 2', () => {
      const { editorView } = editor(doc(code_block()('{<>}const x = 10;')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(doc(p('const x = 10;')));
    });

    it('should not remove the code block if selection is not empty ', () => {
      const { editorView } = editor(doc(code_block()('const x = 1{<}0{>};')));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('const x = 1;')),
      );
    });

    it('should remove empty code block if it is inside of a table', () => {
      const TABLE_LOCAL_ID = 'test-table-local-id';
      const { editorView } = editor(
        doc(table({ localId: TABLE_LOCAL_ID })(tr(td()(code_block()('{<>}'))))),
      );

      const expectedDoc = doc(table({ localId: TABLE_LOCAL_ID })(tr(tdEmpty)));

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should remove empty code block if it is inside of a layoutColumn', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(code_block()('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );

      const expectedDoc = doc(
        layoutSection(
          layoutColumn({ width: 50 })(p('')),
          layoutColumn({ width: 50 })(p('')),
        ),
      );

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should remove not nested empty code block', () => {
      const { editorView } = editor(doc(p(), p(), code_block()('{<>}')));

      const expectedDoc = doc(p(), p());

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });

    it('should replace not nested empty code block with paragraph if it is at the beginning of the doc', () => {
      const { editorView } = editor(doc(code_block()('{<>}')));

      const expectedDoc = doc(p());

      sendKeyToPm(editorView, 'Backspace');
      expect(editorView.state.doc).toEqualDocument(expectedDoc);
    });
  });
});
