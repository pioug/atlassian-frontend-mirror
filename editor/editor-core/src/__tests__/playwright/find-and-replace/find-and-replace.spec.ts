import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorFindAndReplaceModel,
} from '@af/editor-libra';
import { matchCaseAdf, replaceAdf } from './find-and-replace.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('Find/replace', () => {
  const findShortcut =
    process.platform === 'darwin' ? 'Meta+KeyF' : 'Control+KeyF';

  test.describe('"allowMatchCase" feature flag is off', () => {
    test.use({
      adf: replaceAdf,
      editorProps: {
        appearance: 'full-page',
        allowFindReplace: true,
        // we enable expand and panel to test text searches inside nested elements
        allowExpand: true,
        allowPanel: true,
      },
    });

    test('modifying find text before replace should not restore stale pluginState replace text', async ({
      editor,
    }) => {
      // open find and replace
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Find and replace');

      // find one
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await findReplaceModel.clickFindInput();
      await editor.keyboard.type('one');
      await editor.keyboard.press('Enter');
      await editor.waitForEditorStable();

      await expect(findReplaceModel.replaceButton).not.toHaveAttribute(
        'disabled',
        '',
      );

      // find and replace
      await findReplaceModel.clickReplaceInput();
      await editor.keyboard.type('HI');
      await findReplaceModel.clickReplaceButton();

      await expect(editor).toMatchDocument(doc(p('HI two')));

      await findReplaceModel.clickReplaceInput();
      await editor.keyboard.press('Backspace');
      await editor.keyboard.press('Backspace');
      await editor.keyboard.type('HO');

      await expect(findReplaceModel.replaceButton).toHaveAttribute(
        'disabled',
        '',
      );
    });

    test('select.ts: Find on selection should select find input on activation', async ({
      editor,
    }) => {
      // select one
      await editor.selection.set({
        anchor: 0,
        head: 0,
      });
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');

      // send to find and replace
      await editor.keyboard.press(findShortcut);

      // verify we got the correct value
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await expect(findReplaceModel.findInput).toHaveValue('one');
    });

    test('select.ts: Find on selection should select find input on activation with no text selected', async ({
      editor,
    }) => {
      // open find and replace
      await editor.keyboard.press(findShortcut);

      // verify we got the correct value
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await expect(findReplaceModel.findInput).toHaveValue('');
    });

    test('select.ts: Find on selection should select find input on update', async ({
      editor,
    }) => {
      // open find and replace
      await editor.keyboard.press(findShortcut);

      // select one
      await editor.selection.set({
        anchor: 0,
        head: 0,
      });
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');
      await editor.keyboard.press('Shift+ArrowRight');

      // send to find and replace
      await editor.keyboard.press(findShortcut);

      // verify we got the correct value
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await expect(findReplaceModel.findInput).toHaveValue('one');
    });
  });

  test.describe('"allowMatchCase" feature flag is off', () => {
    test.use({
      adf: matchCaseAdf,
      editorProps: {
        appearance: 'full-page',
        allowFindReplace: true,
        // we enable expand and panel to test text searches inside nested elements
        allowExpand: true,
        allowPanel: true,
      },
    });
  });

  test.describe('"allowMatchCase" feature flag is on', () => {
    test.use({
      adf: matchCaseAdf,
      editorProps: {
        appearance: 'full-page',
        allowFindReplace: { allowMatchCase: true },
        // we enable expand and panel to test text searches inside nested elements
        allowExpand: true,
        allowPanel: true,
      },
    });

    test('match-case.ts: should initially start', async ({ editor }) => {
      // open find and replace
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Find and replace');

      // toggle match case and find text
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await expect(findReplaceModel.matchCaseButton).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    test('find with Match Case button toggled off should find all results, ignoring case', async ({
      editor,
    }) => {
      // open find and replace
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Find and replace');

      // find text
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await findReplaceModel.clickFindInput();
      await editor.keyboard.type('HELLO');
      await editor.waitForEditorStable();
      expect(await findReplaceModel.matches.count()).toBe(9);
    });

    test('find with Match Case button toggled on should find results that exactly match case', async ({
      editor,
    }) => {
      // open find and replace
      const toolbar = EditorMainToolbarModel.from(editor);
      await toolbar.clickAt('Find and replace');

      // toggle match case and find text
      const findReplaceModel = EditorFindAndReplaceModel.from(editor);
      await findReplaceModel.toggleMatchCase();
      await findReplaceModel.clickFindInput();
      await editor.keyboard.type('HELLO');
      await editor.waitForEditorStable();
      expect(await findReplaceModel.matches.count()).toBe(3);
    });
  });
});
