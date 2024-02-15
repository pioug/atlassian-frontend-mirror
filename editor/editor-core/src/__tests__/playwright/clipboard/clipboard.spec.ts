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
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { emptyParagraphUnderneathTable } from './clipboard.spec.ts-fixtures';

test.describe('Clipboard', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    // Loading 2 paragraphs beneath table, as we want to avoid the click being blocked by the button beneath the table.
    adf: emptyParagraphUnderneathTable,
  });

  test('copying table row preserves original table attributes', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);

    const layoutModel = await tableModel.layout(editor);
    await layoutModel.toWide();

    const cell = await tableModel.cell(1);
    await cell.click();

    const rowControlModel = await tableModel.rowControls({ index: 1 });
    await rowControlModel.click();
    await editor.copy();

    await nodes.paragraph.last().click();
    await editor.paste();

    await expect(editor).toMatchDocument(
      doc(
        table({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'wide',
          localId: '2b7ca746-3f15-476d-a6bc-c754b8c14b71',
        })(
          tr(th().any, th().any, th().any),
          tr(td().any, td().any, td().any),
          tr(td().any, td().any, td().any),
        ),
        p(),
        table({
          __autoSize: false,
          isNumberColumnEnabled: false,
          layout: 'wide',
          localId: expect.any(String),
        })(tr(td().any, td().any, td().any)),
      ),
    );
  });
});
