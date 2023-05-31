import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { setResizeHandlePos } from '../../../../plugins/table/pm-plugins/table-resizing/commands';
import {
  doc,
  table,
  tr,
  td,
  p,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
} from '@atlaskit/editor-common/analytics';

import tablePlugin from '../../../../plugins/table';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-key';
import { TextSelection, NodeSelection, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import panelPlugin from '@atlaskit/editor-core/src/plugins/panel';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  akEditorFullPageMaxWidth,
  akEditorDefaultLayoutWidth,
} from '@atlaskit/editor-shared-styles/consts';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';

describe('table-resizing/event-handlers', () => {
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };
  let editor: any;
  beforeEach(() => {
    const createEditor = createProsemirrorEditorFactory();
    editor = (doc: DocBuilder) =>
      createEditor({
        doc,
        attachTo: document.body,
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(decorationsPlugin)
          .add([
            tablePlugin,
            {
              tableOptions: { allowColumnResizing: true },
              editorAnalyticsAPI: editorAnalyticsAPIFake,
            },
          ])
          .add(widthPlugin)
          .add(panelPlugin),
        pluginKey,
      });
  });

  describe('#handleMouseDown', () => {
    it('should dispatch analytics event on last column resizing attempt', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      resizeColumn(view, 12, 150, 250);

      expect(editorAnalyticsAPIFake.attachAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: TABLE_ACTION.ATTEMPTED_TABLE_WIDTH_CHANGE,
          actionSubject: ACTION_SUBJECT.TABLE,
          actionSubjectId: null,
          eventType: EVENT_TYPE.UI,
          attributes: expect.objectContaining({
            delta: 100,
            position: 'right',
            type: 'table-border',
          }),
        }),
      );
    });

    it('should shrink last column until table is no longer overflowing', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      // Increase column to overflow
      resizeColumn(view, 7, 50, 500);

      expect(getTotalTableWidth(view.state as EditorState)).toBeGreaterThan(
        akEditorFullPageMaxWidth,
      );

      resizeColumn(view, 12, 3000, 700);

      // No matter how large we try to resize the result should equal the width (within 1 pt)
      expect(getTotalTableWidth(view.state as EditorState)).toBeLessThanOrEqual(
        akEditorDefaultLayoutWidth,
      );
      expect(
        getTotalTableWidth(view.state as EditorState),
      ).toBeGreaterThanOrEqual(akEditorFullPageMaxWidth - 1);
    });

    it('should not resize the last column to grow', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      // Increase column to overflow
      resizeColumn(view, 7, 50, 500);

      const overflowingTableWidth = getTotalTableWidth(
        view.state as EditorState,
      );
      expect(overflowingTableWidth).toBeGreaterThan(akEditorFullPageMaxWidth);

      resizeColumn(view, 12, 400, 3000);

      // Width should be unchanged
      expect(getTotalTableWidth(view.state as EditorState)).toBe(
        overflowingTableWidth,
      );
    });

    it('should restore text selection after replacing the table', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      const currentSelection = view.state.tr.selection;
      expect(currentSelection instanceof TextSelection).toBeTruthy();
      expect(currentSelection.$cursor.pos).toBe(15);

      resizeColumn(view, 12, 150, 250);

      expect(currentSelection instanceof TextSelection).toBeTruthy();
      expect(currentSelection.$cursor.pos).toBe(15);
    });

    it('should restore node selection after replacing the table', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(panel()(p(''))), td()(p('2')), td()(p('3'))))),
      );
      const _tr = view.state.tr.setSelection(
        NodeSelection.create(view.state.tr.doc, 3),
      );
      view.dispatch(_tr);
      expect(view.state.tr.selection.node.type.name).toBe('panel');

      resizeColumn(view, 13, 150, 250);

      expect(view.state.tr.selection.node.type.name).toBe('panel');
    });
  });
});

function getTotalTableWidth(state: EditorState) {
  let totalWidth = 0;
  state.doc.descendants((node) => {
    if (node.type.name === 'tableCell') {
      totalWidth += node.attrs.colwidth[0];
      return false;
    }
    return true;
  });
  return totalWidth;
}

function resizeColumn(
  view: EditorView,
  pos: number,
  start: number,
  end: number,
) {
  setResizeHandlePos(pos)(view.state, view.dispatch);

  const firstmousedownEvent = new MouseEvent('mousedown', {
    clientX: start,
  });

  view.dom.dispatchEvent(firstmousedownEvent);

  const firstmouseupEvent = new MouseEvent('mouseup', {
    clientX: end,
  });
  window.dispatchEvent(firstmouseupEvent);
}
