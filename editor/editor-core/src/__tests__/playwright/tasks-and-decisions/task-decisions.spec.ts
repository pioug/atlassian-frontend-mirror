import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorTableModel,
  EditorMainToolbarModel,
  fixTest,
  BROWSERS,
} from '@af/editor-libra';
import {
  decisionAdf,
  taskListTableAdf,
  decisionListInTableAdf,
  dateInTaskAdf,
  paragraphWithDecisionList,
  paragraphWithDecisionListWithoutContent,
} from './task-decisions.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tr,
  taskItem,
  taskList,
  decisionItem,
  decisionList,
  hardBreak,
  td,
  p,
  a,
  em,
  strong,
  mention,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('task and decisions: keyboard stuff', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTasksAndDecisions: true,
      allowTables: {},
      allowNestedTasks: true,
    },
  });

  test.describe('with content', () => {
    test.use({
      adf: paragraphWithDecisionList,
    });

    test('arrow-up-from-decision-node.ts: pressing arrow up in decision node should move cursor into paragraph above', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 12, head: 12 });

      await editor.keyboard.press('ArrowUp');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });
    });
  });

  test.describe('without content', () => {
    test.use({
      adf: paragraphWithDecisionListWithoutContent,
    });

    test('arrow-up-from-decision-node.ts: pressing arrow up in decision node should move cursor into paragraph above without content', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20855',
        reason:
          'FIXME: This test was automatically skipped due to failure on 12/11/2023: https://product-fabric.atlassian.net/browse/ED-20855',
        browsers: [BROWSERS.firefox],
      });

      await editor.selection.set({ anchor: 4, head: 4 });

      await editor.keyboard.press('ArrowUp');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 1,
      });
    });
  });

  test.describe('with date in tasks', () => {
    test.use({
      adf: dateInTaskAdf,
    });

    test('Pressing up arrow key moves cursor to previous taskItem', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 21, head: 21 });

      await editor.keyboard.press('ArrowUp');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 17,
        head: 17,
      });
    });
  });

  test.describe('task list inside table', () => {
    test.use({
      adf: taskListTableAdf,
    });

    test('keymap.ts: tabbing from the first taskItem in a tableCell should go to the next cell', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.taskItem.first().click();

      await editor.keyboard.press('Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 62,
        head: 66,
      });
    });

    test('keymap.ts: shift+tab from the first taskItem in a tableCell should go to the previous cell', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.taskItem.first().click();

      await editor.keyboard.press('Shift+Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 18,
        head: 22,
      });
    });

    test('keymap.ts: tab and shift+tab respectively indent and unident subsequent actionItems in a table', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.taskItem.nth(1).click();

      await editor.keyboard.press('Tab');

      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr.any,
            tr(
              td().any,
              td()(
                taskList()(
                  taskItem()('Action item 1'),
                  taskList()(taskItem()('Action item 2')),
                ),
                p(),
              ),
              td().any,
            ),
            tr.any,
          ),
        ),
      );
      await editor.keyboard.press('Shift+Tab');
      await expect(editor).toMatchDocument(
        doc(
          table()(
            tr.any,
            tr(
              td().any,
              td()(
                taskList()(
                  taskItem()('Action item 1'),
                  taskItem()('Action item 2'),
                ),
                p(),
              ),
              td().any,
            ),
            tr.any,
          ),
        ),
      );
    });

    test('keymap.ts: can tab back and forth through a table cell containing a taskList', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorTableModel.from(nodes.table.first());

      const cell = await model.cell(3);
      await cell.click();

      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 62,
        head: 66,
      });

      await editor.keyboard.press('Shift+Tab');
      await editor.keyboard.press('Shift+Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 18,
        head: 22,
      });
    });
  });

  test.describe('decision list inside table', () => {
    test.use({
      adf: decisionListInTableAdf,
    });

    test('keymap.ts: tabbing from any decisionItem in a tableCell should go to the next cell', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20771',
        reason:
          'FIXME: This test was automatically skipped due to failure on 07/11/2023: https://product-fabric.atlassian.net/browse/ED-20771',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.decisionItem.first().click();
      await editor.keyboard.press('Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 64,
        head: 68,
      });

      await nodes.decisionItem.nth(1).click();
      await editor.keyboard.press('Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 64,
        head: 68,
      });
    });

    test('keymap.ts: shift+tabbing from any decisionItem in a tableCell should go to the previous cell', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20854',
        reason:
          'FIXME: This test was automatically skipped due to failure on 11/11/2023: https://product-fabric.atlassian.net/browse/ED-20854',
        browsers: [BROWSERS.webkit],
      });

      const nodes = EditorNodeContainerModel.from(editor);

      await nodes.decisionItem.first().click();
      await editor.keyboard.press('Shift+Tab');

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 18,
        head: 22,
      });

      await nodes.decisionItem.nth(1).click();
      await editor.keyboard.press('Shift+Tab');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 18,
        head: 22,
      });
    });

    test('keymap.ts: can tab back and forth through a table cell containing a decisionList', async ({
      editor,
    }) => {
      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorTableModel.from(nodes.table.first());

      const cell = await model.cell(3);
      await cell.click();
      await editor.keyboard.press('Tab');
      await editor.keyboard.press('Tab');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 64,
        head: 68,
      });

      await editor.keyboard.press('Shift+Tab');
      await editor.keyboard.press('Shift+Tab');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 18,
        head: 22,
      });
    });
  });
});

test.describe('task and decisions: selection stuff', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowTasksAndDecisions: true,
    },
  });

  test.use({
    adf: decisionAdf,
  });
  test("doesn't select decision item node if click and drag before releasing mouse", async ({
    editor,
  }) => {
    const nodes = EditorNodeContainerModel.from(editor);

    const firstDecisionItem = await nodes.decisionItem.first();
    const lastDecisionItem = await nodes.decisionItem.last();

    await lastDecisionItem.hover();
    await editor.page.mouse.down();

    await firstDecisionItem.hover();

    await expect(editor).not.toHaveSelection({
      type: 'node',
      anchor: 18,
    });
  });
});

test.describe('task and decisions: paste stuff', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowEmbeds: true,
      },
      allowPanel: true,
    },
    editorMountingOptions: {
      providers: {
        cards: true,
      },
    },
  });

  test('task-decision-1.ts: can paste rich text into a decision', async ({
    editor,
  }) => {
    const html =
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>';

    await editor.keyboard.type('<> ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html,
    });

    await expect(editor).toMatchDocument(
      doc(
        decisionList()(
          decisionItem()(
            'this is a link ',
            a({
              href: 'http://www.google.com',
            })('www.google.com'),
          ),
        ),
        p('more elements with some ', strong('format')),
        p('some addition', em(' formatting')),
      ),
    );
  });

  test('task-decision-1.ts: can paste plain text into a decision', async ({
    editor,
  }) => {
    const text =
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*';

    await editor.keyboard.type('<> ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text,
    });

    await expect(editor).toMatchDocument(
      doc(
        decisionList()(
          decisionItem()(
            'this is a link ',
            a({
              href: 'http://www.google.com',
            })('http://www.google.com'),
            ' more elements with some **format** some addition *formatting*',
          ),
        ),
      ),
    );
  });

  test('task-decision: Backspacing on second line of multi-line decision shouldnt remove list', async ({
    editor,
  }) => {
    const html = '<p>Line 1<br/>L2</p>';
    await editor.keyboard.type('<> ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html,
    });
    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('Backspace');

    await expect(editor).toMatchDocument(
      doc(decisionList()(decisionItem()('Line 1', hardBreak()))),
    );
  });

  test('task-decision: Backspacing on second line of multi-line task shouldnt remove list', async ({
    editor,
  }) => {
    const html = '<p>Line 1<br/>L2</p>';
    await editor.keyboard.type('[] ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html,
    });

    await editor.keyboard.press('Backspace');
    await editor.keyboard.press('Backspace');

    await expect(editor).toMatchDocument(
      doc(taskList()(taskItem()('Line 1', hardBreak()))),
    );
  });

  test('task-decision-2.ts: can paste rich text into an action', async ({
    editor,
  }) => {
    const html =
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>';
    await editor.keyboard.type('[] ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html,
    });

    await expect(editor).toMatchDocument(
      doc(
        taskList()(
          taskItem()(
            'this is a link ',
            a({
              href: 'http://www.google.com',
            })('www.google.com'),
          ),
        ),
        p('more elements with some ', strong('format')),
        p('some addition', em(' formatting')),
      ),
    );
  });

  test('task-decision-2.ts: can paste plain text into an action', async ({
    editor,
  }) => {
    const text =
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*';

    await editor.keyboard.type('[] ');

    await editor.simulatePasteEvent({
      pasteAs: 'text/plain',
      text,
    });

    await expect(editor).toMatchDocument(
      doc(
        taskList()(
          taskItem()(
            'this is a link ',
            a({
              href: 'http://www.google.com',
            })('http://www.google.com'),
            ' more elements with some **format** some addition *formatting*',
          ),
        ),
      ),
    );
  });
});

test.describe('task and decisions: stuff', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      smartLinks: {
        allowEmbeds: true,
      },
      allowPanel: true,
    },
    editorMountingOptions: {
      providers: {
        cards: true,
      },
    },
  });

  test('task-decision-1.ts: can type into decision', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const toolbar = EditorMainToolbarModel.from(editor);
    const firstDecisionItem = nodes.decisionItem.first();

    const menu = await toolbar.openInsertMenu();

    await menu.clickAt('Decision');

    await firstDecisionItem.click();

    await editor.keyboard.type('adding decisions');

    await expect(editor).toMatchDocument(
      doc(decisionList()(decisionItem()('adding decisions'))),
    );
  });

  test('task-decision-2.ts: can type into decision', async ({ editor }) => {
    const nodes = EditorNodeContainerModel.from(editor);
    const toolbar = EditorMainToolbarModel.from(editor);
    const firstTaskItem = nodes.taskItem.first();

    await toolbar.clickAt('Action item');

    await firstTaskItem.click();

    await editor.keyboard.type('adding action');

    await expect(editor).toMatchDocument(
      doc(taskList()(taskItem()('adding action'))),
    );
  });

  test('task-decision-2.ts: can insert mention into an action using click', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    const firstMention = editor.typeAhead.mentionsListItems.first();

    await editor.keyboard.type('[] ');
    await toolbar.clickAt('Mention');

    await firstMention.waitFor({ state: 'visible' });
    await firstMention.click();
    await expect(editor).toMatchDocument(
      doc(
        taskList()(
          taskItem()(
            mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
            ' ',
          ),
        ),
      ),
    );
  });

  test('task-decision-2.ts: joins actions regardless of insert method', async ({
    editor,
  }) => {
    await editor.keyboard.type('[] a');

    await editor.keyboard.press('Enter');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('[] b');

    await editor.keyboard.press('Enter');
    await editor.keyboard.press('Enter');

    await editor.typeAhead.search('Action item');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('c');

    await expect(editor).toMatchDocument(
      doc(taskList()(taskItem()('a'), taskItem()('b'), taskItem()('c'))),
    );
  });

  test('task-decision-2.ts: inserts new action item via typeahead on the same level as the previous action item even when it was empty', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);

    await toolbar.clickAt('Action item');
    await editor.keyboard.type('a ');

    // Insert a new action via quickinsert when the cursor is inside of a non-empty action
    await editor.typeAhead.search('Action item');
    await editor.keyboard.press('Enter');

    // Insert a new action via quickinsert when the cursor is inside of an empty action
    await editor.typeAhead.search('Action item');
    await editor.keyboard.press('Enter');

    await editor.keyboard.type('c');

    await expect(editor).toMatchDocument(
      doc(taskList()(taskItem()('a '), taskItem()(), taskItem()('c'))),
    );
  });
});
