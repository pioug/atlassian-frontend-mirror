import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import { setResizeHandlePos } from '../../../../../../plugins/table/pm-plugins/table-resizing/commands';
import {
  doc,
  table,
  tr,
  td,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  TABLE_ACTION,
} from '../../../../../analytics';

import { TablePluginState } from '../../../../types';
import { pluginKey } from '../../../../pm-plugins/plugin-factory';

import * as analytics from '../../../../../analytics/utils';

describe('table-resizing/event-handlers', () => {
  let editor: any;
  beforeEach(() => {
    const createEditor = createEditorFactory<TablePluginState>();
    editor = (doc: any) =>
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

  describe('#handleMouseDown', () => {
    it('should dispatch analytics event on last column resizing attempt', async () => {
      const analyticsFn = jest.spyOn(analytics, 'addAnalytics');

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

      expect(analyticsFn).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          action: TABLE_ACTION.ATTEMPTED_TABLE_WIDTH_CHANGE,
          actionSubject: ACTION_SUBJECT.TABLE,
          actionSubjectId: null,
          eventType: EVENT_TYPE.UI,
          attributes: expect.objectContaining({
            delta: 100,
            nodeLocation: 'tableCell',
            position: 'right',
            selectionPosition: 'end',
            selectionType: 'cursor',
            type: 'table-border',
          }),
        }),
      );
    });
  });
});
