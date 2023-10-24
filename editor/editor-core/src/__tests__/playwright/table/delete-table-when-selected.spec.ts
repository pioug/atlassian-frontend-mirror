import {
  EditorNodeContainerModel,
  EditorTableModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

import { simpleTable } from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  strong,
  a,
  p,
  em,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowTables: {
      advanced: true,
    },
  },

  adf: simpleTable,
});

test.describe('when the entire table is selected', () => {
  test.describe('and when user types something', () => {
    test('should replace the table', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();

      await editor.keyboard.type('A');

      await expect(editor).toHaveDocument(doc(p('A')));
    });
  });

  test.describe('and when user paste some content', () => {
    test('should replace the table', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();

      await editor.simulatePasteEvent({
        pasteAs: 'text/plain',
        text: 'Content',
      });

      await expect(editor).toHaveDocument(doc(p('Content')));
    });
  });

  test.describe('and when user paste some rich-text content', () => {
    test('should replace the table', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);

      await tableModel.selectTable();

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        text: '',
        html: '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
      });

      await expect(editor).toHaveDocument(
        doc(
          p(
            'this is a link ',
            a({
              href: 'http://www.google.com',
            })('www.google.com'),
          ),
          p('more elements with some ', strong('format')),
          p('some addition', em(' formatting')),
        ),
      );
    });
  });
});
