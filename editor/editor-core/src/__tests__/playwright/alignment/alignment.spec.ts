import {
  editorTestCase as test,
  EditorMainToolbarModel,
  expect,
  EditorNodeContainerModel,
  EditorTableModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  doc,
  p,
  h1,
  table,
  tr,
  th,
  td,
  alignment,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { blockTypeMessages as messages } from '@atlaskit/editor-common/messages';
import { simpleTable } from './alignment.spec.ts-fixtures';

test.describe('alignment: libra test', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTextAlignment: true,
    },
  });

  test('alignment: should be able to add alignment to paragraphs', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await editor.keyboard.type('hello');
    await toolbar.clickAt('Text alignment');
    await toolbar.clickAt('Align right');
    await expect(editor).toHaveDocument(
      doc(alignment({ align: 'end' })(p('hello'))),
    );
  });

  test('alignment: should be able to add alignment to headings', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await editor.keyboard.type('hello');
    await toolbar.clickAt('Text styles');
    await toolbar.clickAt('Heading 1');
    await toolbar.clickAt('Text alignment');
    await toolbar.clickAt('Align right');
    await expect(editor).toHaveDocument(
      doc(alignment({ align: 'end' })(h1('hello'))),
    );
  });

  test('alignment: disabled when inside special nodes', async ({ editor }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt(messages.codeblock.defaultMessage);
    const alignmentMenuItem = await toolbar.menuItemByLabel('Text alignment');
    await expect(alignmentMenuItem).toBeDisabled();
  });

  test.describe('editor disabled', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        disabled: true,
      },
    });
    test('alignment: disabled when editor is disabled', async ({ editor }) => {
      const toolbar = EditorMainToolbarModel.from(editor);
      const alignmentMenuItem = await toolbar.menuItemByLabel('Text alignment');
      await expect(alignmentMenuItem).toBeDisabled();
    });
  });

  test('alignment: should maintain alignment when hit return', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Text alignment');
    await toolbar.clickAt('Align right');
    const firstLine = 'this is right';
    const secondLine = 'this is still right';
    await editor.keyboard.type(firstLine);
    await editor.keyboard.press('Enter');
    await editor.keyboard.type(secondLine);

    await expect(editor).toHaveDocument(
      doc(
        alignment({ align: 'end' })(p('this is right')),
        alignment({ align: 'end' })(p('this is still right')),
      ),
    );
  });

  test.describe('tables', () => {
    test.use({
      adf: simpleTable,
      editorProps: {
        appearance: 'full-page',
        allowTextAlignment: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('alignment: should be able to add alignment to selected cells', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const toolbar = EditorMainToolbarModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const columnControls = await tableModel.columnControls({ index: 0 });
      await columnControls.select();

      await toolbar.clickAt('Text alignment');
      await toolbar.clickAt('Align right');

      await expect(editor).toMatchDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: expect.any(String),
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(alignment({ align: 'end' })(p())),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(alignment({ align: 'end' })(p())),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(alignment({ align: 'end' })(p())),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });
  });
});
