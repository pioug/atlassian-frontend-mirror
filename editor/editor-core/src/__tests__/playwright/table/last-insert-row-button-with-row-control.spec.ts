import {
  EditorNodeContainerModel,
  EditorTableModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  td,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
    featureFlags: {
      'table-drag-and-drop': true,
    },
  },
});

test.describe('insert row button when drag and drop is enabled', () => {
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
  // FIXME: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2460797/steps/%7Bfc645828-8b26-4728-8fae-fa40301bdb2c%7D/test-report
  test.skip('should show insert button when hover on the last insert dot on row control', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const firstCellInLastRow = await tableModel.cell(6);
    await firstCellInLastRow.click();

    const lastRow = await tableModel.rowDragControls(2);
    const insertDotInLastRow = lastRow.insertDot.last();

    const dotBoundingBox = await insertDotInLastRow.boundingBox();

    // A second mouse move is required for safari to locate the insertDot element
    await editor.page.mouse.move(dotBoundingBox!.x + 2, dotBoundingBox!.y + 2);
    await editor.page.mouse.move(dotBoundingBox!.x, dotBoundingBox!.y);

    await insertDotInLastRow.hover({
      // eslint-disable-next-line playwright/no-force-option
      force: true,
    });

    await test.step('should show insert button when hover on the last insert dot', async () => {
      await expect(lastRow.isInsertRowButtonVisible()).toBeTruthy();
    });

    await lastRow.clickInsertRowButton();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  });
  // FIXME: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2464107/steps/%7B40214e73-bf74-4b7e-8671-126b78785676%7D/test-report
  test.skip('should show insert button when hover on the last insert dot on row control after content change in table', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    // Select last cell of the second row and type some text
    const cell = await tableModel.cell(5);
    await cell.click();
    await editor.keyboard.type('Hello');

    const firstCellInLastRow = await tableModel.cell(6);
    await firstCellInLastRow.click();
    const lastRow = await tableModel.rowDragControls(2);
    const insertDotInLastRow = lastRow.insertDot.last();

    const dotBoundingBox = await insertDotInLastRow.boundingBox();

    // A second mouse move is required for safari to locate the insertDot element
    await editor.page.mouse.move(dotBoundingBox!.x + 2, dotBoundingBox!.y + 2);
    await editor.page.mouse.move(dotBoundingBox!.x, dotBoundingBox!.y);

    await insertDotInLastRow.hover({
      // eslint-disable-next-line playwright/no-force-option
      force: true,
    });

    await test.step('should show insert button when hover on the insert dot on row control', async () => {
      await expect(lastRow.isInsertRowButtonVisible()).toBeTruthy();
    });

    await lastRow.clickInsertRowButton();

    await expect(editor).toHaveDocument(
      doc(
        table({ localId: 'localId' })(
          tr(thEmpty, thEmpty, thEmpty),
          tr(tdEmpty, tdEmpty, td()(p('Hello'))),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    );
  });
});
