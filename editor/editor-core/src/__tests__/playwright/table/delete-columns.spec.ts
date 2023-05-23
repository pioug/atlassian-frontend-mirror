import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';

import {
  doc,
  table,
  tr,
  td,
  tdEmpty,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});

test.describe('when table has merged cells', () => {
  const tableWithMergedCells = doc(
    table({ localId: 'localId' })(
      tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, td({ colspan: 3 })(p(''))),
      tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty),
    ),
  );
  test.use({
    adf: tableWithMergedCells(sampleSchema).toJSON(),
  });

  test('Should delete merged columns from contextual menu', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const cell = await tableModel.cell(5);
    await cell.click();
    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteColumn();

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        table({ localId: 'localId' })(
          tr(tdEmpty),
          tr(tdEmpty),
          tr(tdEmpty),
        )
      ),
    );
  });
});

test.describe('when table has multiple merged cells across other columns', () => {
  const tableWithMergedCells = doc(
    table({ localId: 'localId' })(
      tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, td({ colspan: 3 })(p('')), tdEmpty),
      tr(td({ colspan: 3 })(p('')), tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty),
    ),
  );

  test.use({
    adf: tableWithMergedCells(sampleSchema).toJSON(),
  });

  test('Should delete merged columns and decrement colspan of the spanning cell', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const cell = await tableModel.cell(8);
    await cell.click();
    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteColumn();

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        table({ localId: 'localId' })(
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(
            td({ colspan: 2 })(p('')),
            tdEmpty,
          ),
          tr(tdEmpty, tdEmpty, tdEmpty),
        )
      ),
    );
  });
});
