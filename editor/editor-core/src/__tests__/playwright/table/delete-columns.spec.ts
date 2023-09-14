// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import {
  EditorPopupModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  td,
  thEmpty,
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

test.describe('when in full-width mode', () => {
  const simpleTable = doc(
    table({ localId: 'localId' })(
      tr(thEmpty, thEmpty, thEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
      tr(tdEmpty, tdEmpty, tdEmpty),
    ),
  );
  test.use({
    adf: simpleTable(sampleSchema).toJSON(),
  });

  test('should delete the last column through the contextual menu', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    // Switch table to full-width mode
    const tableLayoutModel = await tableModel.layout(editor);
    await tableLayoutModel.toWide();
    await tableLayoutModel.toFullWidth();

    // Select last cell of the first row
    const cell = await tableModel.cell(2);
    await cell.click();
    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteColumn();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId', layout: 'full-width' })(
          tr(thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty),
        ),
      ),
    );
  });
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

  test('when deleting from a cell outside the merged cells should only remove a single column', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const cell = await tableModel.cell(3);
    await cell.click();
    const cellOptions = await cell.options(EditorPopupModel.from(editor));
    await cellOptions.deleteColumn();

    await expect(editor).toHaveDocument(
      // prettier-ignore
      doc(
        table({ localId: 'localId' })(
          tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, td({ colspan: 2 })(p('')), tdEmpty),
          tr(
            td({ colspan: 3 })(p('')),
            tdEmpty,
            tdEmpty,
          ),
          tr(tdEmpty, tdEmpty, tdEmpty, tdEmpty, tdEmpty),
        )
      ),
    );
  });
});
