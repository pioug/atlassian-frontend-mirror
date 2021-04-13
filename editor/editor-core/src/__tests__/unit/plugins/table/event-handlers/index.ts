import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TablePluginState } from '../../../../../plugins/table/types';
import { whenTableInFocus } from '../../../../../plugins/table/event-handlers';
import { setDragging } from '../../../../../plugins/table/pm-plugins/table-resizing/commands';
import { pluginKey } from '../../../../../plugins/table/pm-plugins/plugin-factory';

describe('event-handlers', () => {
  let editor: any;

  describe('#whenTableInFocus', () => {
    describe('when allowColumnResizing is false', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory<TablePluginState>();
        editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowTables: {
                allowColumnResizing: false,
              },
            },
            pluginKey,
          });
      });

      it('should not return false', () => {
        const { editorView: view } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const fakeHandler = jest.fn();
        // @ts-ignore
        const fakeMouseEvent = jest.fn() as Event;

        const result = whenTableInFocus(fakeHandler);

        expect(result(view, fakeMouseEvent)).not.toBeFalsy();
      });
    });

    describe('when allowColumnResizing is true', () => {
      beforeEach(() => {
        const createEditor = createEditorFactory<TablePluginState>();
        editor = (doc: DocBuilder) =>
          createEditor({
            doc,
            editorProps: {
              allowTables: {
                allowColumnResizing: true,
              },
            },
            pluginKey,
          });
      });

      describe('when dragging exists', () => {
        it('should return false', () => {
          const { editorView: view } = editor(
            doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
          );
          const fakeHandler = jest.fn();
          // @ts-ignore
          const fakeMouseEvent = jest.fn() as Event;

          setDragging({ startX: 0, startWidth: 0 })(view.state, view.dispatch);

          const result = whenTableInFocus(fakeHandler);

          expect(result(view, fakeMouseEvent)).toBeFalsy();
        });
      });

      describe('when dragging is null', () => {
        it('should not return false', () => {
          const { editorView: view } = editor(
            doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
          );
          const fakeHandler = jest.fn();
          // @ts-ignore
          const fakeMouseEvent = jest.fn() as Event;

          setDragging(null)(view.state, view.dispatch);

          const result = whenTableInFocus(fakeHandler);

          expect(result(view, fakeMouseEvent)).not.toBeFalsy();
        });
      });
    });
  });
});
