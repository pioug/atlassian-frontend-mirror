import { TextSelection } from 'prosemirror-state';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '../../../../plugins/table/types';
import {
  handleMouseOver,
  handleMouseMove,
} from '../../../../plugins/table/event-handlers';
import {
  showInsertColumnButton,
  addResizeHandleDecorations,
} from '../../../../plugins/table/commands';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';

describe('table event handlers', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (doc: DocBuilder) =>
    createEditor({ doc, editorProps: { allowTables: true }, pluginKey });

  describe('#handleMouseOver', () => {
    describe('when insert col/row button is hidden', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const { state } = editorView;
        const cursorPos = 8;
        editorView.dispatch(
          state.tr.setSelection(
            new TextSelection(state.doc.resolve(cursorPos)),
          ),
        );
        const event = {
          target: editorView.dom.querySelector('td'),
        };
        expect(handleMouseOver(editorView, event as MouseEvent)).toEqual(false);
      });
    });

    describe('when insert col/row button is visible', () => {
      it('should call hideInsertColumnOrRowButton when moving to the first cell', () => {
        const { editorView, refs } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );

        showInsertColumnButton(0)(editorView.state, editorView.dispatch);

        const firstCell = editorView.domAtPos(refs['<>']);
        const event = {
          target: firstCell.node,
        };
        expect(handleMouseOver(editorView, event as any)).toEqual(true);
      });
    });
  });

  describe('#handleMouseMove', () => {
    describe('when resize decoration has been set', () => {
      it('should return false', () => {
        const { editorView, refs } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const { state, dispatch } = editorView;

        addResizeHandleDecorations(0)(state, dispatch);

        const firstCell = editorView.domAtPos(refs['<>']);
        const event = {
          target: firstCell.node,
        };
        expect(handleMouseMove(editorView, event as any)).toEqual(false);
      });
    });
  });
});
