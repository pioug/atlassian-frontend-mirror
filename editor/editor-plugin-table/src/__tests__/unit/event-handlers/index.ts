import type { DocBuilder } from '@atlaskit/editor-common/types';
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { whenTableInFocus } from '../../../plugins/table/event-handlers';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { setDragging } from '../../../plugins/table/pm-plugins/table-resizing/commands';
import type { TablePluginState } from '../../../plugins/table/types';

describe('event-handlers', () => {
  let editor: any;

  describe('#whenTableInFocus', () => {
    describe('when allowColumnResizing is false', () => {
      beforeEach(() => {
        const createEditor = createProsemirrorEditorFactory();
        const preset = new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(widthPlugin)
          .add(guidelinePlugin)
          .add(selectionPlugin)
          .add([tablePlugin, { tableOptions: { allowColumnResizing: false } }]);
        editor = (doc: DocBuilder) =>
          createEditor<TablePluginState, PluginKey, typeof preset>({
            doc,
            preset,
            pluginKey,
          });
      });

      it('should not return false', () => {
        const { editorView: view } = editor(
          doc(table()(tr(tdCursor, tdEmpty), tr(tdEmpty, tdEmpty))),
        );
        const fakeHandler = jest.fn();
        fakeHandler.mockReturnValue(true);
        // @ts-ignore
        const fakeMouseEvent = jest.fn() as Event;

        const result = whenTableInFocus(fakeHandler);

        expect(result(view, fakeMouseEvent)).not.toBeFalsy();
      });
    });

    describe('when allowColumnResizing is true', () => {
      beforeEach(() => {
        const createEditor = createProsemirrorEditorFactory();
        const preset = new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(widthPlugin)
          .add(guidelinePlugin)
          .add(selectionPlugin)
          .add([tablePlugin, { tableOptions: { allowColumnResizing: false } }]);
        editor = (doc: DocBuilder) =>
          createEditor<TablePluginState, PluginKey, typeof preset>({
            doc,
            preset,
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
          fakeHandler.mockReturnValue(true);
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
