import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorActionListModel,
} from '@af/editor-libra';

import { simpleActionListWithShortText } from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('when pressing arrow key to focus checkbox at the simple action list with short text', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: simpleActionListWithShortText,
    editorMountOptions: {
      withTitleFocusHandler: true,
    },
  });

  test('should check second input when press combine ArrowLeft,ArrowRight and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(1);

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('T1'),
          taskItem({ state: 'DONE' })('T2'),
          taskItem({ state: 'DONE' })('T3'),
        ),
      ),
    );
  });

  test('should check first input when press combine ArrowLeft,ArrowRight and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(0);

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowUp');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'DONE' })('T1'),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'DONE' })('T3'),
        ),
      ),
    );
  });

  test('should uncheck last input when press combine ArrowLeft,ArrowRight,ArrowDown and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItem = await actionList.actionItem(2);

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('ArrowLeft');

    await actionItem.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('T1'),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'TODO' })('T3'),
        ),
      ),
    );
  });
});
