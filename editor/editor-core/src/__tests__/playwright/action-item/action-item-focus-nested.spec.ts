import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorActionListModel,
} from '@af/editor-libra';

import { simpleActionListWithShortTextAndNestedItemsList } from './__fixtures__/base-adfs';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  taskItem,
  taskList,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('when pressing arrow key to focus checkbox at the simple action list with short text and nested action list', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: simpleActionListWithShortTextAndNestedItemsList,
    editorMountOptions: {
      withTitleFocusHandler: true,
    },
  });

  test('should check first input inside nested action list when press combine ArrowLeft,ArrowRight and pressing Space', async ({
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
          taskList({})(
            taskItem({ state: 'DONE' })('T1'),
            taskItem({ state: 'TODO' })('T2'),
            taskItem({ state: 'DONE' })('T3'),
          ),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'DONE' })('T3'),
        ),
      ),
    );
  });

  test('should check first input inside nested action list, and check second input inside nested action list, when press combine ArrowLeft,ArrowRight and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItemFirstInsideNestedActionList = await actionList.actionItem(
      1,
    );
    const actionItemSecondInsideNestedActionList = await actionList.actionItem(
      2,
    );

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await actionItemFirstInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowDown');

    await actionItemSecondInsideNestedActionList.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('T1'),
          taskList({})(
            taskItem({ state: 'DONE' })('T1'),
            taskItem({ state: 'DONE' })('T2'),
            taskItem({ state: 'DONE' })('T3'),
          ),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'DONE' })('T3'),
        ),
      ),
    );
  });

  test('should check first input inside nested action list, check second input inside nested action list, uncheck last input inside nested action list, when press combine ArrowLeft,ArrowRight,ArrowDown and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItemFirstInsideNestedActionList = await actionList.actionItem(
      1,
    );
    const actionItemSecondInsideNestedActionList = await actionList.actionItem(
      2,
    );
    const actionItemThirdInsideNestedActionList = await actionList.actionItem(
      3,
    );

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await actionItemFirstInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowDown');

    await actionItemSecondInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowDown');

    await actionItemThirdInsideNestedActionList.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('T1'),
          taskList({})(
            taskItem({ state: 'DONE' })('T1'),
            taskItem({ state: 'DONE' })('T2'),
            taskItem({ state: 'TODO' })('T3'),
          ),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'DONE' })('T3'),
        ),
      ),
    );
  });

  test('should check first input inside nested action list, check second input inside nested action list, uncheck second input inside nested action list, and should goes from nested action list and check last item out of nested list, when press combine ArrowLeft,ArrowRight,ArrowDown and pressing Space', async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const actionList = EditorActionListModel.from(nodes.actionList);
    const actionItemFirstInsideNestedActionList = await actionList.actionItem(
      1,
    );
    const actionItemSecondInsideNestedActionList = await actionList.actionItem(
      2,
    );
    const actionItemThirdInsideNestedActionList = await actionList.actionItem(
      3,
    );
    const actionItemFourthInsideNestedActionList = await actionList.actionItem(
      5,
    );

    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');

    await actionItemFirstInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowDown');

    await actionItemSecondInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowDown');

    await actionItemThirdInsideNestedActionList.toggleState();

    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowRight');
    await editor.keyboard.press('ArrowDown');

    await actionItemFourthInsideNestedActionList.toggleState();

    await expect(editor).toMatchDocument(
      doc(
        taskList({})(
          taskItem({ state: 'TODO' })('T1'),
          taskList({})(
            taskItem({ state: 'DONE' })('T1'),
            taskItem({ state: 'DONE' })('T2'),
            taskItem({ state: 'TODO' })('T3'),
          ),
          taskItem({ state: 'TODO' })('T2'),
          taskItem({ state: 'TODO' })('T3'),
        ),
      ),
    );
  });
});
