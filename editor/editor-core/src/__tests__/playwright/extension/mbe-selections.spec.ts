import {
  BROWSERS,
  EditorMultiBodiedExtensionModel,
  EditorNodeContainerModel,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies

import {
  adfMBEWithTextBeforeAndAfter,
  adfWithMBE,
} from './multi-bodied-extensions.spec.ts-fixtures';

test.describe('MultiBodiedExtensions: selection', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      allowExtension: {
        allowBreakout: true,
      },
      allowFragmentMark: true,
      insertMenuItems: [],
    },
    editorMountOptions: {
      withConfluenceMacrosExtensionProvider: true,
    },
    platformFeatureFlags: {
      'platform.editor.multi-bodied-extension_0rygg': true,
    },
  });

  test.use({ adf: adfMBEWithTextBeforeAndAfter });

  test.describe('when creating a range selection from below MBE to up', () => {
    test.skip('should select the MBE node', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'TBD',
        reason: 'Firefox does not work well with shift selection',
        browsers: [BROWSERS.firefox],
      });
      // set selection after the last paragraph
      await editor.selection.set({ anchor: 52, head: 52 });

      // Range selection until inside the MBE
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        head: 13,
        anchor: 52,
      });

      // Range selection until all text in MBE text frame selected
      await editor.keyboard.press('Shift+ArrowUp');
      await expect(editor).toHaveSelection({
        type: 'text',
        head: 11,
        anchor: 52,
      });
    });
  });

  test.describe('when creating a range selection from above MBE to down', () => {
    test('should select the MBE node', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'TBD',
        reason: 'Firefox does not work well with shift selection',
        browsers: [BROWSERS.firefox],
      });
      await editor.selection.set({ anchor: 1, head: 1 });

      // Range selection until inside the MBE's paragraph
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 7,
      });

      // Range selection should not expand to MBE node
      await editor.keyboard.press('Shift+ArrowDown');
      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 1,
        head: 7,
      });
    });
  });

  test.describe('when navigating using arrow left', () => {
    test.describe('and when the first tab is active', () => {
      test('should set the selection properly', async ({ editor }) => {
        fixTest({
          jiraIssueId: 'TBD',
          reason: 'Firefox does not work well with shift selection',
          browsers: [BROWSERS.firefox],
        });
        // set selection at the start of last paragraph after the MBE
        await editor.selection.set({ anchor: 47, head: 47 });

        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          pos: 46,
          side: 'right',
          type: 'gapcursor',
        });

        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 8,
        });

        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          type: 'text',
          head: 43,
          anchor: 43,
        });

        // Press ArrowLeft until we are out of the paragraph
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        // Cursor right before "LOL TAB1"
        await expect(editor).toHaveSelection({
          type: 'text',
          head: 11,
          anchor: 11,
        });

        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 8,
        });

        await editor.keyboard.press('ArrowLeft');
        await expect(editor).toHaveSelection({
          pos: 8,
          side: 'left',
          type: 'gapcursor',
        });
      });
    });
  });

  test.describe('when navigating using arrow right', () => {
    test.describe('and when the first tab is active', () => {
      test('should set the selection properly', async ({ editor }) => {
        // set selection at the start of first paragraph before the MBE
        await editor.selection.set({ anchor: 7, head: 7 });

        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 8,
          side: 'left',
          type: 'gapcursor',
        });

        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 8,
        });

        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          type: 'text',
          head: 11,
          anchor: 11,
        });

        // Press ArrowRight until we are out of the paragraph
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');
        await editor.keyboard.press('ArrowRight');

        // Cursor right after "LOL TAB1"
        await expect(editor).toHaveSelection({
          type: 'text',
          head: 19,
          anchor: 19,
        });

        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          type: 'node',
          anchor: 8,
        });

        await editor.keyboard.press('ArrowRight');
        await expect(editor).toHaveSelection({
          pos: 46,
          side: 'right',
          type: 'gapcursor',
        });
      });
    });
  });

  test.describe('when clicked on the wrapper', () => {
    test.use({ adf: adfWithMBE });
    test('should select the whole MBE node', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'TBD',
        reason: 'Firefox does not work well with shift selection',
        browsers: [BROWSERS.firefox],
      });

      const nodes = EditorNodeContainerModel.from(editor);
      const model = EditorMultiBodiedExtensionModel.from(
        nodes.multiBodiedExtension.first(),
      );
      await model.wrapper.click();

      await expect(editor).toHaveSelection({
        type: 'text',
        anchor: 11,
        head: 11,
      });
    });
  });
});
