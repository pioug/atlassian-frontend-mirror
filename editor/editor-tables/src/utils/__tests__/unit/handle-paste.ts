import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('handle paste', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        allowTables: {
          allowColumnResizing: true,
        },
      },
    });
  };

  describe('paste table cells with resized column widths', () => {
    const htmlTableCellsWithResizedColumnWidths = `
      <meta charset='utf-8'>
      <table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="test" data-pm-slice="1 1 []">
      <tbody>
      <tr>
      <td data-colwidth="51" class="pm-table-cell-content-wrap"><p>A</p></td>
      <td data-colwidth="58" class="pm-table-cell-content-wrap"><p>B</p></td>
      <td data-colwidth="650" class="pm-table-cell-content-wrap"><p>C</p></td>
      </tr>
      </tbody>
      </table>`;

    describe('into empty part of the document', () => {
      it('should keep the column widths of the copied table', () => {
        const { editorView } = editor(doc(p('{<>}')));

        dispatchPasteEvent(editorView, {
          html: htmlTableCellsWithResizedColumnWidths,
        });

        const expectedResult = doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'test',
          })(
            tr(
              td({ colwidth: [51] })(p('A')),
              td({ colwidth: [58] })(p('B')),
              td({ colwidth: [650] })(p('C')),
            ),
          ),
        );

        expect(editorView.state.doc).toEqualDocument(expectedResult);
      });
    });

    describe('into an existing table', () => {
      it('should keep the column widths of the destination table', () => {
        const { editorView } = editor(
          doc(
            table({
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: 'test',
            })(
              tr(td({})(p('{<>}')), td({})(p()), td({})(p())),
              tr(td({})(p()), td({})(p()), td({})(p())),
              tr(td({})(p()), td({})(p()), td({})(p())),
            ),
          ),
        );

        dispatchPasteEvent(editorView, {
          html: htmlTableCellsWithResizedColumnWidths,
        });

        const expectedResult = doc(
          table({
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'test',
          })(
            tr(
              td({ colwidth: undefined })(p('A')),
              td({})(p('B')),
              td({})(p('C')),
            ),
            tr(td({ colwidth: undefined })(p()), td({})(p()), td({})(p())),
            tr(td({ colwidth: undefined })(p()), td({})(p()), td({})(p())),
          ),
        );

        expect(editorView.state.doc).toEqualDocument(expectedResult);
      });
    });
  });
});
