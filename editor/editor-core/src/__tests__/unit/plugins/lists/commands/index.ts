import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';

import {
  doc,
  ol,
  li,
  p,
  hardBreak,
  date,
  panel,
  ul,
  expand,
  breakout,
  layoutColumn,
  layoutSection,
  strong,
  code_block,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  enterKeyCommand,
  backspaceKeyCommand,
  toggleList,
} from '../../../../../plugins/lists/commands';
import { GapCursorSelection } from '../../../../../plugins/gap-cursor';
import { INPUT_METHOD } from '../../../../../plugins/analytics';
import { sendKeyToPm } from '../../../../../../../editor-test-helpers/src';

describe('lists plugin -> commands', () => {
  const createEditor = createEditorFactory();

  describe('enterKeyCommand', () => {
    it('should not outdent a list when list item has visible content', () => {
      const timestamp = Date.now();
      const { editorView } = createEditor({
        doc: doc(
          ol(li(p('text')), li(p('{<>}', hardBreak(), date({ timestamp })))),
        ),
        editorProps: { allowDate: true },
      });
      enterKeyCommand(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          ol(
            li(p('text')),
            li(p('')),
            li(p('', hardBreak(), date({ timestamp }))),
          ),
        ),
      );
    });
  });

  describe('backspaceKeyCommand', () => {
    describe('when cursor is inside nested node', () => {
      it('should not outdent a list', () => {
        const { editorView } = createEditor({
          doc: doc(ol(li(code_block()('{<>}text')))),
        });

        backspaceKeyCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(code_block()('text')))),
        );
      });
    });

    describe('when GapCursor is inside a listItem and before the nested codeBlock', () => {
      it('should outdent a list', () => {
        const { editorView } = createEditor({
          doc: doc(ol(li(code_block()('{<>}text')))),
        });

        // enable gap cursor
        sendKeyToPm(editorView, 'ArrowLeft');
        expect(editorView.state.selection instanceof GapCursorSelection).toBe(
          true,
        );

        backspaceKeyCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(doc(code_block()('text')));
      });
    });

    describe('when GapCursor is before a codeBlock and after a list', () => {
      it('should join codeBlock with the list', () => {
        const { editorView } = createEditor({
          doc: doc(ol(li(p('text'))), code_block()('{<>}code')),
        });

        // enable gap cursor
        sendKeyToPm(editorView, 'ArrowLeft');
        expect(editorView.state.selection instanceof GapCursorSelection).toBe(
          true,
        );

        backspaceKeyCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(code_block()('code')))),
        );
      });
    });
  });

  describe('toggleList', () => {
    it('should be able to toggle ol to ul inside a panel', () => {
      const { editorView } = createEditor({
        doc: doc(panel()(ol(li(p('text{<>}'))))),
        editorProps: {
          allowPanel: true,
        },
      });

      toggleList(
        editorView.state,
        editorView.dispatch,
        editorView,
        'bulletList',
        INPUT_METHOD.TOOLBAR,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(ul(li(p('text{<>}'))))),
      );
    });

    it('should be able to toggle ul to ol inside a panel', () => {
      const { editorView } = createEditor({
        doc: doc(panel()(ul(li(p('text{<>}'))))),
        editorProps: {
          allowPanel: true,
        },
      });

      toggleList(
        editorView.state,
        editorView.dispatch,
        editorView,
        'orderedList',
        INPUT_METHOD.TOOLBAR,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(panel()(ol(li(p('text{<>}'))))),
      );
    });

    it('should keep breakout marks where they are valid on expands', () => {
      const { editorView } = createEditor({
        doc: doc(breakout({ mode: 'wide' })(expand()(p('{<>}')))),
        editorProps: {
          allowExpand: true,
          allowBreakout: true,
          appearance: 'full-page',
        },
      });

      const { state, dispatch } = editorView;

      toggleList(
        state,
        dispatch,
        editorView,
        'bulletList',
        INPUT_METHOD.TOOLBAR,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc('{expandPos}', breakout({ mode: 'wide' })(expand()(ul(li(p()))))),
      );
    });

    it('should keep breakout marks where they are valid on layouts', () => {
      const { editorView } = createEditor({
        doc: doc(
          breakout({ mode: 'wide' })(
            layoutSection(
              layoutColumn({ width: 50 })(p('{<>}')),
              layoutColumn({ width: 50 })(p()),
            ),
          ),
        ),
        editorProps: {
          allowLayouts: true,
          allowBreakout: true,
          appearance: 'full-page',
        },
      });

      const { state, dispatch } = editorView;

      toggleList(
        state,
        dispatch,
        editorView,
        'bulletList',
        INPUT_METHOD.TOOLBAR,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          breakout({ mode: 'wide' })(
            layoutSection(
              layoutColumn({ width: 50 })(ul(li(p()))),
              layoutColumn({ width: 50 })(p()),
            ),
          ),
        ),
      );
    });
  });

  describe('Copy Paste', () => {
    it('should not create list item when text with marks is pasted', () => {
      const text = `<b>Marked Text</b> 1. item`;
      const { editorView } = createEditor({
        doc: doc(p('{<>}')),
      });

      dispatchPasteEvent(editorView, { html: text });
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('Marked Text'), ' 1. item')),
      );
    });
  });
});
