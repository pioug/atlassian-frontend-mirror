import { expect } from '@af/integration-testing';
import {
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  strong,
  doc,
  table,
  tr,
  td,
  p,
  th,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },
});

test('should apply strong mark to any text inside an empty table header', async ({
  editor,
}) => {
  const toolbar = EditorMainToolbarModel.from(editor);
  const nodes = EditorNodeContainerModel.from(editor);
  const tableModel = EditorTableModel.from(nodes.table);

  await toolbar.clickAt('Table');

  const cell = await tableModel.cell(0);

  await cell.click();

  await editor.keyboard.type('this has a strong mark');

  await expect(editor).toMatchDocument(
    doc(
      table()(
        tr(th()(p(strong('this has a strong mark'))), th().any, th().any),
        tr(td().any, td().any, td().any),
        tr(td().any, td().any, td().any),
      ),
    ),
  );
});
