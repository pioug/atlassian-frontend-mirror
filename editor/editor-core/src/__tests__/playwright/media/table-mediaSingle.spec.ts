import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  EditorTableModel,
  expect,
  fixTest,
} from '@af/editor-libra';
import {
  doc,
  table,
  tr,
  td,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { table3x3 } from './table-mediaSingle.spec.ts-fixtures/adf-table3x3';

test.describe('Media tables', () => {
  test.describe('Full Page', () => {
    test.use({
      adf: table3x3,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      },
    });

    test('can insert into table', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-19014',
        reason: 'flaky test maybe due to not accurately waiting on upload',
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(3);
      await cell.click();

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
      });

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr.any,
            tr(td()(mediaSingle().any, p()), td().any, td().any),
            tr.any,
          ),
        ),
      );
    });
  });

  test.describe('Comment', () => {
    test.use({
      adf: table3x3,
      editorProps: {
        appearance: 'comment',
        allowTables: {
          advanced: true,
        },
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
        },
      },
    });

    test('can insert into table', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      const cell = await tableModel.cell(3);
      await cell.click();

      await EditorUploadMediaModel.from(editor).upload({
        actionToTriggerUpload: async () => {
          await editor.typeAhead.searchAndInsert('Image');
        },
      });

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr.any,
            tr(
              td()(mediaSingle({ layout: 'align-start' }).any, p()),
              td().any,
              td().any,
            ),
            tr.any,
          ),
          p(),
        ),
      );
    });
  });
});
