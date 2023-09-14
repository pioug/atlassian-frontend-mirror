import { editorTestCase as test, expect } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('action item', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test('should render active action item', async ({ editor }) => {
    await editor.keyboard.type('[x] ');
    await editor.keyboard.type('active action item');

    await expect(editor).toMatchDocument(
      doc(taskList({})(taskItem({ state: 'DONE' })('active action item'))),
    );
  });

  test('should render not active action item', async ({ editor }) => {
    await editor.keyboard.type('[] ');
    await editor.keyboard.type('not active action item');

    await expect(editor).toMatchDocument(
      doc(taskList({})(taskItem({ state: 'TODO' })('not active action item'))),
    );
  });
});
