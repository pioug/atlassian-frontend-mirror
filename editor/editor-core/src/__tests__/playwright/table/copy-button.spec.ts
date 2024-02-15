import {
  EditorFloatingToolbarModel,
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

import { copyTableAdf } from './copy-button.spec.ts-fixtures';

test.describe('table: copy button', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTables: {
        advanced: true,
      },
    },
    adf: copyTableAdf,
  });

  test('should copy the table and its content', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const tableModel = EditorTableModel.from(nodes.table);
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      tableModel,
    );
    await floatingToolbarModel.copy();
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.paste();
    await expect(editor).toMatchDocument(
      doc(
        table({})(
          tr(th()(p('1')), th()(p('2')), th()(p('3'))),
          tr(td()(p('4')), td()(p('5')), td()(p('6'))),
          tr(td()(p('7')), td()(p('8')), td()(p('9'))),
        ),
        table({})(
          tr(th()(p('1')), th()(p('2')), th()(p('3'))),
          tr(td()(p('4')), td()(p('5')), td()(p('6'))),
          tr(td()(p('7')), td()(p('8')), td()(p('9'))),
        ),
      ),
    );
  });
});
