import {
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorActionListModel,
  EditorDecisionListModel,
  expect,
} from '@af/editor-libra';

test.describe('Task Items: feat TypeAhead', () => {
  const adf = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'taskList',
        attrs: {
          localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
        },
        content: [
          {
            type: 'taskItem',
            attrs: {
              localId: '9ff03d47-b975-474e-8370-d3624cd5cce1',
              state: 'TODO',
            },
            content: [],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello ',
          },
        ],
      },
    ],
  };

  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf,
  });

  test.describe('when the cursor is inside an empty task item', () => {
    test('it should show the placeholder', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const actionList = EditorActionListModel.from(nodes.actionList);
      const actionItem = await actionList.actionItem(0);

      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await expect(actionItem.placeholder).toBeVisible();
    });

    test.describe('when type ahead opens', () => {
      test('it should hide the placeholder', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const actionList = EditorActionListModel.from(nodes.actionList);
        const actionItem = await actionList.actionItem(0);

        await editor.selection.set({
          anchor: 2,
          head: 2,
        });
        await editor.typeAhead.search('');

        await expect(actionItem.placeholder).toBeHidden();
      });
    });
  });

  test.describe('when the cursor is not inside a task item', () => {
    test('it should show the placeholder', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const actionList = EditorActionListModel.from(nodes.actionList);
      const actionItem = await actionList.actionItem(0);

      await editor.selection.set({
        anchor: 11,
        head: 11,
      });

      await expect(actionItem.placeholder).toBeVisible();
    });

    test.describe('when type ahead opens', () => {
      test('it should not hide the placeholder', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const actionList = EditorActionListModel.from(nodes.actionList);
        const actionItem = await actionList.actionItem(0);

        await editor.selection.set({
          anchor: 11,
          head: 11,
        });
        await editor.typeAhead.search('');

        await expect(actionItem.placeholder).toBeVisible();
      });
    });
  });
});

test.describe('Decisions Items: feat TypeAhead', () => {
  const adf = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'decisionList',
        attrs: {
          localId: 'd4367ae3-5f11-4ff6-9a1d-e019f0c58218',
        },
        content: [
          {
            type: 'decisionItem',
            attrs: {
              localId: '9ff03d47-b975-474e-8370-d3624cd5cce1',
              state: 'DECIDED',
            },
            content: [],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Hello ',
          },
        ],
      },
    ],
  };
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf,
  });

  test.describe('when the cursor is inside an empty decision item', () => {
    test('it should show the placeholder', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const decisionList = EditorDecisionListModel.from(nodes.decisionList);
      const item = await decisionList.decisionItem(0);

      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await expect(item.placeholder).toBeVisible();
    });

    test.describe('when type ahead opens', () => {
      test('it should hide the placeholder', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const decisionList = EditorDecisionListModel.from(nodes.decisionList);
        const item = await decisionList.decisionItem(0);

        await editor.selection.set({
          anchor: 2,
          head: 2,
        });
        await editor.typeAhead.search('');

        await expect(item.placeholder).toBeHidden();
      });
    });
  });

  test.describe('when the cursor is not inside a decision item', () => {
    test('it should show the placeholder', async ({ editor }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const decisionList = EditorDecisionListModel.from(nodes.decisionList);
      const item = await decisionList.decisionItem(0);

      await editor.selection.set({
        anchor: 11,
        head: 11,
      });

      await expect(item.placeholder).toBeVisible();
    });

    test.describe('when type ahead opens', () => {
      test('it should not hide the placeholder', async ({ editor }) => {
        const nodes = EditorNodeContainerModel.from(editor);
        const decisionList = EditorDecisionListModel.from(nodes.decisionList);
        const item = await decisionList.decisionItem(0);

        await editor.selection.set({
          anchor: 11,
          head: 11,
        });
        await editor.typeAhead.search('');

        await expect(item.placeholder).toBeVisible();
      });
    });
  });
});
