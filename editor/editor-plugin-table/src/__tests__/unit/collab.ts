import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { removeColumnAt } from '@atlaskit/editor-tables/utils';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../plugins/table-plugin';
import { pluginKey as tablePluginKey } from '../../plugins/table/pm-plugins/plugin-key';
import { setResizeHandlePos } from '../../plugins/table/pm-plugins/table-resizing/commands';
import { PluginConfig } from '../../plugins/table/types';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('Tables with Collab editing', () => {
  const createEditor = createProsemirrorEditorFactory();
  const tableOptions = {
    allowNumberColumn: true,
    allowHeaderRow: true,
    allowHeaderColumn: true,
    permittedLayouts: 'all',
    allowColumnResizing: true,
  } as PluginConfig;

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add([tablePlugin, { tableOptions }]),
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
