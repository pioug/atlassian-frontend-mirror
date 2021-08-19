import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  h1,
  tr,
  td,
  th,
  strong,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  TablePluginState,
  PluginConfig,
} from '../../../../plugins/table/types';
import { uuid } from '@atlaskit/adf-schema';
import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';
import { sortByColumn } from '../../../../plugins/table/commands';
import { pluginKey as tablePluginKey } from '../../../../plugins/table/pm-plugins/plugin-factory';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('table plugin', () => {
  beforeEach(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory<TablePluginState>();

  const editor = (doc: DocBuilder) => {
    const tableOptions = {
      allowNumberColumn: true,
      allowHeaderRow: true,
      allowHeaderColumn: true,
      allowBackgroundColor: true,
      permittedLayouts: 'all',
      allowColumnSorting: true,
    } as PluginConfig;
    return createEditor({
      doc,
      editorProps: {
        allowTables: tableOptions,
      },
      pluginKey: tablePluginKey,
    });
  };

  describe('TableView', () => {
    describe('Sort Columns in given order', () => {
      it('sorts the given column in ascending order', () => {
        const { editorView } = editor(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({})(p(strong('1'))),
                th({})(p(strong('2'))),
                th({})(p(strong('3'))),
                th({})(p(strong('4'))),
                th({})(p(strong('5'))),
              ),
              tr(
                td({})(p('c')),
                td({})(p('c')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
              ),
              tr(
                td({})(p('b')),
                td({})(p()),
                td({})(p('d')),
                td({})(p()),
                td({})(p('c')),
              ),
              tr(
                td({})(p()),
                td({})(p('z')),
                td({})(p()),
                td({})(p()),
                td({})(p('f')),
              ),
              tr(
                td({})(p('2')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('1')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('a')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
            ),
          ),
        );

        const sortByColumnCommand = sortByColumn(0, SortOrder.ASC);

        sortByColumnCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: TABLE_LOCAL_ID,
            })(
              tr(
                th({})(p(strong('1'))),
                th({})(p(strong('2'))),
                th({})(p(strong('3'))),
                th({})(p(strong('4'))),
                th({})(p(strong('5'))),
              ),
              tr(
                td({})(p('1')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('2')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('a')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('b')),
                td({})(p()),
                td({})(p('d')),
                td({})(p()),
                td({})(p('c')),
              ),
              tr(
                td({})(p('c')),
                td({})(p('c')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
              ),
              tr(
                td({})(p()),
                td({})(p('z')),
                td({})(p()),
                td({})(p()),
                td({})(p('f')),
              ),
            ),
          ),
        );
      });
      it('sorts the given column in descending order', () => {
        const { editorView } = editor(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({})(p(strong('1'))),
                th({})(p(strong('2'))),
                th({})(p(strong('3'))),
                th({})(p(strong('4'))),
                th({})(p(strong('5'))),
              ),
              tr(
                td({})(p('c')),
                td({})(p('c')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
              ),
              tr(
                td({})(p('b')),
                td({})(p()),
                td({})(p('d')),
                td({})(p()),
                td({})(p('c')),
              ),
              tr(
                td({})(p()),
                td({})(p('z')),
                td({})(p()),
                td({})(p()),
                td({})(p('f')),
              ),
              tr(
                td({})(p('2')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('1')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('a')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
            ),
          ),
        );

        const sortByColumnCommand = sortByColumn(0, SortOrder.DESC);

        sortByColumnCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: TABLE_LOCAL_ID,
            })(
              tr(
                th({})(p(strong('1'))),
                th({})(p(strong('2'))),
                th({})(p(strong('3'))),
                th({})(p(strong('4'))),
                th({})(p(strong('5'))),
              ),
              tr(
                td({})(p('c')),
                td({})(p('c')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
              ),
              tr(
                td({})(p('b')),
                td({})(p()),
                td({})(p('d')),
                td({})(p()),
                td({})(p('c')),
              ),
              tr(
                td({})(p('a')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('2')),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p('1')),
                td({})(p()),
                td({})(p('c')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p()),
                td({})(p('z')),
                td({})(p()),
                td({})(p()),
                td({})(p('f')),
              ),
            ),
          ),
        );
      });
      it('sorts the given column with header text in ascending order', () => {
        const { editorView } = editor(
          doc(
            table({ isNumberColumnEnabled: false, layout: 'default' })(
              tr(
                th({})(h1(strong('asdasdasd'))),
                th({})(p(strong('asdasd'))),
                th({})(p(strong('sdfsdf'))),
                th({})(p('sdfsdfsdf')),
                th({})(p(strong('asdasda'))),
              ),
              tr(
                td({})(h1(strong('c'))),
                td({})(p('cda')),
                td({})(p()),
                td({})(p('cz')),
                td({})(p()),
              ),
              tr(
                td({})(h1(strong('b'))),
                td({})(p()),
                td({})(p('dfsf')),
                td({})(p()),
                td({})(p('cvsd')),
              ),
              tr(
                td({})(p(strong('a'))),
                td({})(p('zc')),
                td({})(p()),
                td({})(p()),
                td({})(p('fsdf')),
              ),
              tr(
                td({})(p(strong('2'))),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p(strong('1'))),
                td({})(p()),
                td({})(p('cxzcz')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p('sdfs')),
                td({})(p()),
              ),
            ),
          ),
        );

        const sortByColumnCommand = sortByColumn(0, SortOrder.ASC);

        sortByColumnCommand(editorView.state, editorView.dispatch);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: TABLE_LOCAL_ID,
            })(
              tr(
                th({})(h1(strong('asdasdasd'))),
                th({})(p(strong('asdasd'))),
                th({})(p(strong('sdfsdf'))),
                th({})(p('sdfsdfsdf')),
                th({})(p(strong('asdasda'))),
              ),
              tr(
                td({})(p(strong('1'))),
                td({})(p()),
                td({})(p('cxzcz')),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p(strong('2'))),
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p()),
              ),
              tr(
                td({})(p(strong('a'))),
                td({})(p('zc')),
                td({})(p()),
                td({})(p()),
                td({})(p('fsdf')),
              ),
              tr(
                td({})(h1(strong('b'))),
                td({})(p()),
                td({})(p('dfsf')),
                td({})(p()),
                td({})(p('cvsd')),
              ),
              tr(
                td({})(h1(strong('c'))),
                td({})(p('cda')),
                td({})(p()),
                td({})(p('cz')),
                td({})(p()),
              ),
              tr(
                td({})(p()),
                td({})(p()),
                td({})(p()),
                td({})(p('sdfs')),
                td({})(p()),
              ),
            ),
          ),
        );
      });
    });
  });
});
