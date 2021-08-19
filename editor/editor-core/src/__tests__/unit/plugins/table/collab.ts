import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tr,
  td,
  th,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { removeColumnAt } from '@atlaskit/editor-tables/utils';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../plugins/table/types';

import { setResizeHandlePos } from '../../../../plugins/table/pm-plugins/table-resizing/commands';
import { pluginKey as tablePluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';
const TABLE_LOCAL_ID = 'test-table-local-id';

describe('Tables with Collab editing', () => {
  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      permittedLayouts: 'all',
      allowColumnResizing: true,
    } as PluginConfig;
    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };

  it('applies colwidths to cells and sets autosize to false', () => {
    const { editorView: view } = editor(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(th()(p('{<>}1')), th()(p('2')), th()(p('3'))),
          tr(td()(p('4')), td()(p('5')), td()(p('6'))),
          tr(td()(p('7')), td()(p('8')), td()(p('9'))),
        ),
      ),
    );

    // Trigger table resizing mouse down handlers.
    setResizeHandlePos(2)(view.state, view.dispatch);
    const mousedownEvent = new MouseEvent('mousedown', { clientX: 50 });
    view.dom.dispatchEvent(mousedownEvent);

    // Simulate collab change, delete col.
    const documentChangeTr = removeColumnAt(1)(view.state.tr);
    view.updateState(view.state.apply(documentChangeTr));

    // Trigger table resizing finish handlers
    const mouseupEvent = new MouseEvent('mouseup', { clientX: 150 });
    window.dispatchEvent(mouseupEvent);

    expect(view.state.doc).toEqualDocument(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(th()(p('1')), th()(p('3'))),
          tr(td()(p('4')), td()(p('6'))),
          tr(td()(p('7')), td()(p('9'))),
        ),
      ),
    );
  });
});
