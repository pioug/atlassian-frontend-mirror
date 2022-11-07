import { MediaAttributes } from '@atlaskit/adf-schema';
import { TextSelection } from 'prosemirror-state';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  td,
  tr,
  tdEmpty,
  thEmpty,
  tdCursor,
  DocBuilder,
  media,
  mediaGroup,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '@atlaskit/editor-plugin-table/types';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import {
  handleMouseOver,
  handleMouseMove,
  handleClick,
} from '@atlaskit/editor-plugin-table/src/plugins/table/event-handlers';
import {
  showInsertColumnButton,
  addResizeHandleDecorations,
} from '@atlaskit/editor-plugin-table/commands';
import { pluginKey } from '@atlaskit/editor-plugin-table/plugin-key';

describe('table event handlers', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const fakeGetEditorFeatureFlags = () => ({});
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        allowTables: true,
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      },
      pluginKey,
    });

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
        expect(
          handleMouseMove(fakeGetEditorFeatureFlags)(editorView, event as any),
        ).toEqual(false);
      });
    });
  });

  describe('#handleClick', () => {
    describe('clicking on media group node', () => {
      describe('when on last cell of middle row', () => {
        describe('when last element is media group node', () => {
          it('should insert a new paragraph node', () => {
            const testCollectionName = 'media-plugin-mock-collection-random-id';
            const fileId = 'random-id';
            const mediaAttrs: MediaAttributes = {
              id: fileId,
              type: 'file',
              collection: testCollectionName,
            };
            const tableAttrs = { localId: 'table' };

            const { editorView } = editor(
              doc(
                table(tableAttrs)(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(tdEmpty, tdEmpty, td()(mediaGroup(media(mediaAttrs)()))),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );

            const firstCell = editorView.domAtPos(27);
            const event = {
              target: firstCell.node,
            };
            expect(handleClick(editorView, event as any)).toEqual(true);

            expect(editorView.state.doc).toEqualDocument(
              doc(
                table(tableAttrs)(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(
                    tdEmpty,
                    tdEmpty,
                    td()(mediaGroup(media(mediaAttrs)()), p()),
                  ),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
          });
        });

        describe('when last element is not media group node', () => {
          it('should not insert a new paragraph node', () => {
            const testCollectionName = 'media-plugin-mock-collection-random-id';
            const fileId = 'random-id';
            const mediaAttrs: MediaAttributes = {
              id: fileId,
              type: 'file',
              collection: testCollectionName,
            };
            const tableAttrs = { localId: 'table' };

            const { editorView } = editor(
              doc(
                table(tableAttrs)(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(
                    tdEmpty,
                    tdEmpty,
                    td()(mediaGroup(media(mediaAttrs)()), p()),
                  ),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );

            const firstCell = editorView.domAtPos(27);
            const event = {
              target: firstCell.node,
            };
            expect(handleClick(editorView, event as any)).toEqual(true);

            expect(editorView.state.doc).toEqualDocument(
              doc(
                table(tableAttrs)(
                  tr(thEmpty, thEmpty, thEmpty),
                  tr(
                    tdEmpty,
                    tdEmpty,
                    td()(mediaGroup(media(mediaAttrs)()), p()),
                  ),
                  tr(tdEmpty, tdEmpty, tdEmpty),
                ),
              ),
            );
          });
        });
      });
    });
  });
});
