import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  td,
  th,
  tr,
  mention,
  date,
  a,
  status,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { sortByColumn } from '../../../../../plugins/table/commands/sort';
import { uuid } from '@atlaskit/adf-schema';
import { TableSortOrder as SortOrder } from '@atlaskit/adf-schema/steps';

const TABLE_LOCAL_ID = 'test-table-local-id';

describe('Sort Table', () => {
  beforeAll(() => {
    uuid.setStatic(TABLE_LOCAL_ID);
  });

  afterAll(() => {
    uuid.setStatic(false);
  });

  const createEditor = createEditorFactory();
  it('should test a basic table with heading', () => {
    const { editorView } = createEditor({
      editorProps: {
        allowTables: {
          advanced: true,
        },
      },
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
      editorProps: {
        allowTables: {
          advanced: true,
          allowHeaderRow: false,
        },
      },
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
      editorProps: {
        allowTables: {
          allowHeaderRow: false,
        },
      },
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

  describe('mixed content ordering', () => {
    let editorView: EditorView;

    beforeEach(() => {
      ({ editorView } = createEditor({
        editorProps: {
          allowStatus: true,
          allowDate: true,
          allowTables: {
            allowHeaderRow: true,
          },
          mentionProvider: Promise.resolve(mentionResourceProvider),
        },
        doc: doc(
          table()(
            tr(th({})(p('Mixed{<>}'))),
            tr(td({})(p(a({ href: '' })('LinkB')))),
            tr(td({})(p('a1'))),
            tr(
              td({})(
                p(status({ text: 'statusB', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(td({})(p('10'))),
            tr(td({})(p('b1'))),
            tr(td({})(p(mention({ id: 'a', text: 'MentionA' })()))),
            tr(td({})(p('20'))),
            tr(
              td({})(p(date({ timestamp: new Date('2019-01-01').getTime() }))),
            ),
            tr(td({})(p(a({ href: '' })('LinkA')))),
            tr(td({})(p(mention({ id: 'a', text: 'MentionB' })()))),
            tr(
              td({})(
                p(status({ text: 'statusA', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(
              td({})(p(date({ timestamp: new Date('2020-01-01').getTime() }))),
            ),
          ),
        ),
      }));
    });

    it('should test a basic table ascending', () => {
      sortByColumn(0, SortOrder.ASC)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th({})(p('Mixed{<>}'))),
            tr(td({})(p('10'))),
            tr(td({})(p('20'))),
            tr(td({})(p('a1'))),
            tr(td({})(p('b1'))),
            tr(td({})(p(mention({ id: 'a', text: 'MentionA' })()))),
            tr(td({})(p(mention({ id: 'a', text: 'MentionB' })()))),
            tr(
              td({})(p(date({ timestamp: new Date('2019-01-01').getTime() }))),
            ),
            tr(
              td({})(p(date({ timestamp: new Date('2020-01-01').getTime() }))),
            ),
            tr(
              td({})(
                p(status({ text: 'statusA', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(
              td({})(
                p(status({ text: 'statusB', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(td({})(p(a({ href: '' })('LinkA')))),
            tr(td({})(p(a({ href: '' })('LinkB')))),
          ),
        ),
      );
    });

    it('should test a basic table descending', () => {
      sortByColumn(0, SortOrder.DESC)(editorView.state, editorView.dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          table({ localId: TABLE_LOCAL_ID })(
            tr(th({})(p('Mixed{<>}'))),
            tr(td({})(p(a({ href: '' })('LinkB')))),
            tr(td({})(p(a({ href: '' })('LinkA')))),
            tr(
              td({})(
                p(status({ text: 'statusB', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(
              td({})(
                p(status({ text: 'statusA', color: '#FFF', localId: 'a' })),
              ),
            ),
            tr(
              td({})(p(date({ timestamp: new Date('2020-01-01').getTime() }))),
            ),
            tr(
              td({})(p(date({ timestamp: new Date('2019-01-01').getTime() }))),
            ),
            tr(td({})(p(mention({ id: 'a', text: 'MentionB' })()))),
            tr(td({})(p(mention({ id: 'a', text: 'MentionA' })()))),
            tr(td({})(p('b1'))),
            tr(td({})(p('a1'))),
            tr(td({})(p('20'))),
            tr(td({})(p('10'))),
          ),
        ),
      );
    });
  });
});
