import {
  BROWSERS,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';

import {
  blockNodesDocument,
  selectableNodesDocument,
} from './selection.spec.ts-fixtures';

test.describe('Selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowLayouts: true,
      allowDate: true,
      allowTables: {},
      allowExtension: {},
    },
  });

  test.use({
    adf: selectableNodesDocument,
  });
  test.describe('Selection with arrow left/right', () => {
    test('selection: right arrow sets correct selections', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 2, head: 2 });

      // panel
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 3,
        side: 'left',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 6,
        head: 6,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 8,
        side: 'right',
      });

      // layout
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 8,
        side: 'left',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 8 });

      // nested code block
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 10,
        side: 'left',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 10 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 11,
        head: 11,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 12,
        head: 12,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 10 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 13,
        side: 'right',
      });

      // nested panel
      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 13,
        side: 'left',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 13 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 15,
        head: 15,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 15 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 16,
        head: 16,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 13 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 18,
        side: 'right',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 21,
        head: 21,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 8 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 24,
        side: 'right',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 24,
        side: 'left',
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 25 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 26,
        head: 26,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 27,
        head: 27,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 25 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 28 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 29,
        head: 29,
      });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 28 });

      await editor.keyboard.press('ArrowRight');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 31,
        side: 'right',
      });
    });

    test('selection: left arrow sets correct selections', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 32, head: 32 });

      // decision list
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 31,
        side: 'right',
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 28 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 29,
        head: 29,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 28 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 25 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 27,
        head: 27,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 26,
        head: 26,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 25 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 24,
        side: 'left',
      });

      // layout
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 24,
        side: 'right',
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 8 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 21,
        head: 21,
      });

      // nested panel
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 18,
        side: 'right',
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 13 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 16,
        head: 16,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 15 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 15,
        head: 15,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 13 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 13,
        side: 'left',
      });

      // nested code block
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 13,
        side: 'right',
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 10 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 12,
        head: 12,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 11,
        head: 11,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 10 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 10,
        side: 'left',
      });

      // layout
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 8 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 8,
        side: 'left',
      });

      // panel
      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 8,
        side: 'right',
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 6,
        head: 6,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({ type: 'node', anchor: 3 });

      await editor.keyboard.press('ArrowLeft');
      await expect(editor).toHaveSelection({
        type: 'gapcursor',
        pos: 3,
        side: 'left',
      });
    });
  });

  test.describe('Selection with Shift + Arrow', () => {
    test.use({
      adf: blockNodesDocument,
    });
    test('selection: shift + arrowup selection for block react node views', async ({
      editor,
    }) => {
      // migrated skip config: firefox
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'Selection: shift + arrowup with block nodes does not work on Firefox',
        browsers: [BROWSERS.firefox],
      });

      await editor.selection.set({ anchor: 60, head: 60 });

      // bodiedExtension inside the selection
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 60,
        head: 55,
      });

      // empty paragraph inside the selection
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 60,
        head: 54,
      });

      // extension inside the selection
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 60,
        head: 52,
      });
    });

    // migrated skip config: safari
    test('selection: shift + arrowdown selection for block react node views', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'Selection: shift + arrowdown with block nodes does not work on Safari',
        browsers: [BROWSERS.webkit],
      });

      await editor.selection.set({ anchor: 1, head: 1 });

      // table inside the selection
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 50,
      });

      // extension inside the selection
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 53,
      });

      // bodiedExtension inside the selection
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 59,
      });

      // last paragragh inside the selection
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 60,
      });
    });
  });
});
