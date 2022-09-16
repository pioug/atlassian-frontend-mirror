import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { setResizeHandlePos } from '../../../../../../plugins/table/pm-plugins/table-resizing/commands';
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

import tablePlugin from '../../../../../table';
import { pluginKey } from '../../../../pm-plugins/plugin-key';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import panelPlugin from '@atlaskit/editor-core/src/plugins/panel';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';

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
          .add([
            tablePlugin,
            {
              tableOptions: { allowColumnResizing: true },
              editorAnalyticsAPI: editorAnalyticsAPIFake,
            },
          ])
          .add(panelPlugin),
        pluginKey,
      });
  });

  describe('#handleMouseDown', () => {
    it('should dispatch analytics event on last column resizing attempt', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      setResizeHandlePos(12)(view.state, view.dispatch);

      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
      });

      view.dom.dispatchEvent(mousedownEvent);

      const mouseupEvent = new MouseEvent('mouseup', {
        clientX: 250,
      });
      window.dispatchEvent(mouseupEvent);

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

    it('should restore text selection after replacing the table', async () => {
      const { editorView: view } = editor(
        doc(table()(tr(td()(p('1')), td()(p('2')), td()(p('3{<>}'))))),
      );

      const currentSelection = view.state.tr.selection;
      expect(currentSelection instanceof TextSelection).toBeTruthy();
      expect(currentSelection.$cursor.pos).toBe(15);

      setResizeHandlePos(12)(view.state, view.dispatch);
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
      });
      view.dom.dispatchEvent(mousedownEvent);
      const mouseupEvent = new MouseEvent('mouseup', {
        clientX: 250,
      });
      window.dispatchEvent(mouseupEvent);

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

      setResizeHandlePos(13)(view.state, view.dispatch);
      const mousedownEvent = new MouseEvent('mousedown', {
        clientX: 150,
      });
      view.dom.dispatchEvent(mousedownEvent);
      const mouseupEvent = new MouseEvent('mouseup', {
        clientX: 250,
      });
      window.dispatchEvent(mouseupEvent);

      expect(view.state.tr.selection.node.type.name).toBe('panel');
    });
  });
});
