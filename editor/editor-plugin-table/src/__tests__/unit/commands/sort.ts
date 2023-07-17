import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { sortByColumn } from '../../../plugins/table/commands/sort';
import { uuid } from '@atlaskit/adf-schema';
import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';
import tablePlugin from '../../../plugins/table-plugin';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('Sort Table', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createProsemirrorEditorFactory();
  it('should test a basic table with heading', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add([tablePlugin, { tableOptions: { allowHeaderRow: true } }]),
      doc: doc(
        table()(
          tr(th({})(p('Number{<>}'))),
          tr(td({})(p('10{<>}'))),
          tr(td({})(p('0'))),
          tr(td({})(p('5'))),
        ),
      ),
    });
    sortByColumn(0)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(th({})(p('Number'))),
          tr(td({})(p('10'))),
          tr(td({})(p('5'))),
          tr(td({})(p('0'))),
        ),
      ),
    );
  });

  it('should test a basic table descending', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add([tablePlugin, { tableOptions: { allowHeaderRow: true } }]),
      doc: doc(
        table()(tr(td({})(p('2{<>}'))), tr(td({})(p('5'))), tr(td({})(p('4')))),
      ),
    });
    sortByColumn(0)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td({})(p('5'))),
          tr(td({})(p('4'))),
          tr(td({})(p('2'))),
        ),
      ),
    );
  });

  it('should test a basic table ascending', () => {
    const { editorView } = createEditor({
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add([tablePlugin, { tableOptions: { allowHeaderRow: true } }]),
      doc: doc(
        table()(tr(td({})(p('2{<>}'))), tr(td({})(p('5'))), tr(td({})(p('4')))),
      ),
    });
    sortByColumn(0, SortOrder.ASC)(editorView.state, editorView.dispatch);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        table({ localId: TABLE_LOCAL_ID })(
          tr(td({})(p('2'))),
          tr(td({})(p('4'))),
          tr(td({})(p('5'))),
        ),
      ),
    );
  });
});
