import { MediaAttributes } from '@atlaskit/adf-schema';
import { TextSelection } from 'prosemirror-state';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
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
import {
  handleMouseOver,
  handleMouseMove,
  handleClick,
} from '../../plugins/table/event-handlers';
import {
  showInsertColumnButton,
  addResizeHandleDecorations,
} from '../../plugins/table/commands';
import {
  handleMouseOut,
  handleMouseDown,
} from '../../plugins/table/event-handlers';
import { pluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { TableCssClassName as ClassName } from '../../plugins/table/types';
import tablePlugin from '../../plugins/table-plugin';
import mediaPlugin from '@atlaskit/editor-core/src/plugins/media';
import floatingToolbarPlugin from '@atlaskit/editor-core/src/plugins/floating-toolbar';
import editorDisabledPlugin from '@atlaskit/editor-core/src/plugins/editor-disabled';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { gridPlugin } from '@atlaskit/editor-plugin-grid';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('table plugin: decorations', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(tablePlugin),
      pluginKey,
    });

  describe('#handleMouseDown', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('should return true & prevent default behaviour for table wrappers: pm-table-contianer', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const tableContainer = document.createElement('div');
      tableContainer.className = 'pm-table-container';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: tableContainer });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(true);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('should return true & prevent default behaviour for table wrappers: pm-table-wrapper', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const tableContainer = document.createElement('div');
      tableContainer.className = 'pm-table-wrapper';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: tableContainer });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(true);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
    });

    it('should return false & not prevent default behaviour for editor content area: ak-editor-content-area', () => {
      const { editorView } = editor(
        doc(table()(tr(td({})(p())), tr(td({})(p())), tr(td({})(p())))),
      );
      const editorContentArea = document.createElement('div');
      editorContentArea.className = 'ak-editor-content-area';
      const event = new MouseEvent('mousedown');
      Object.defineProperty(event, 'target', { value: editorContentArea });
      const preventDefaultSpy = jest.spyOn(
        MouseEvent.prototype,
        'preventDefault',
      );

      expect(handleMouseDown(editorView, event)).toEqual(false);
      expect(preventDefaultSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('#handleMouseOut', () => {
    describe('when the target is a resize handle column', () => {
      it('should return true', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(td()(p('{o}')), tdEmpty))),
        );
        const firstCell = document.createElement('div');
        firstCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);

        const spy = jest
          .spyOn(MouseEvent.prototype, 'target', 'get')
          .mockReturnValue(firstCell);

        const event = new MouseEvent('opa');

        expect(handleMouseOut(editorView, event)).toEqual(true);
        spy.mockRestore();
      });
    });

    describe('when the relatedTarget is a resize handle column too', () => {
      it('should return false', () => {
        const { editorView } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(td()(p('{o}')), tdEmpty))),
        );
        const firstCell = document.createElement('div');
        firstCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);
        const secondCell = document.createElement('div');
        secondCell.classList.add(ClassName.RESIZE_HANDLE_DECORATION);

        const spy = jest
          .spyOn(MouseEvent.prototype, 'target', 'get')
          .mockReturnValue(secondCell);

        const event = new MouseEvent('opa', {
          relatedTarget: firstCell,
        });

        expect(handleMouseOut(editorView, event)).toEqual(false);
        spy.mockRestore();
      });
    });
  });
});

describe('table event handlers', () => {
  const createEditor = createProsemirrorEditorFactory();
  const fakeGetEditorFeatureFlags = () => ({});
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      attachTo: document.body,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add(editorDisabledPlugin)
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(decorationsPlugin)
        .add(widthPlugin)
        .add(gridPlugin)
        .add(tablePlugin)
        .add(floatingToolbarPlugin)
        .add([
          mediaPlugin,
          {
            allowMediaSingle: true,
            allowMediaGroup: true,
          },
        ]),
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

        addResizeHandleDecorations(0, 0)(state, dispatch);

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
