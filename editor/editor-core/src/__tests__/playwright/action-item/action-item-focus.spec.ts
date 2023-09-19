import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorActionListModel,
} from '@af/editor-libra';

import { simpleActionList } from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('when pressing arrow key to focus checkbox at the simple list', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: simpleActionList,
  });

  test('should check first input when press ArrowLeft and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(0);

    await editor.keyboard.press('ArrowLeft');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'DONE' })('Task item 1'),
          taskItem({ state: 'TODO' })('Task item 2'),
          taskItem({ state: 'DONE' })('Task item 3'),
        ),
      ),
    );
  });

  test('should check second input when press ArrowDown and pressing Space to check item', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(1);

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowDown');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('Task item 1'),
          taskItem({ state: 'DONE' })('Task item 2'),
          taskItem({ state: 'DONE' })('Task item 3'),
        ),
      ),
    );
  });

  test('should uncheck last input when press combine actions with ArrowLeft,ArrowRight,ArrowDown and pressing Space to check item', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(2);

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowUp');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('Task item 1'),
          taskItem({ state: 'TODO' })('Task item 2'),
          taskItem({ state: 'TODO' })('Task item 3'),
        ),
      ),
    );
  });
});
