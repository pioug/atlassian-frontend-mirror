import {
  editorTestCase as test,
  BROWSERS,
  fixTest,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, h1 } from '@atlaskit/editor-test-helpers/doc-builder';

const spaceAtEnd = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: ' ',
        },
      ],
    },
  ],
};
test.describe('typeahead - multiple typeaheads', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
  });

  test.use({ adf: spaceAtEnd });

  test.describe('when undone after insert an item by space', () => {
    test('it should add the raw text into the document', async ({ editor }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.type('lol ');

      await editor.typeAhead.search('Action Item');

      await editor.keyboard.type(' ');

      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await editor.undo();

      await expect(editor).toHaveDocument(doc(p(' lol /Action Item ')));
    });
  });

  test.describe('when undone right after open the typeahead', () => {
    test('it should not add the raw trigger in the document', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.type('ABC ');

      await editor.typeAhead.search('');

      await editor.undo();

      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await expect(editor).toHaveDocument(doc(p(' ')));
    });
  });

  test.describe('when undone the query inside of the typeahead', () => {
    test('it should not add the raw trigger in the document', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason: 'Test does not work on Webkit',
        browsers: [BROWSERS.webkit],
      });

      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.type('ABC ');

      await editor.typeAhead.search('Act');

      // Undo until the typeahead popup closes
      let isTypeAheadOpen = true;
      while (isTypeAheadOpen) {
        await editor.undo();
        await editor.waitForEditorStable();
        isTypeAheadOpen = await editor.typeAhead.popup.isVisible();
      }

      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await expect(editor).toHaveDocument(doc(p(' ABC ')));
    });
  });

  test.describe('when undone the item inserted by typeahead', () => {
    test('it should open the typeahead menu with the old query', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.typeAhead.search('Action');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');
      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await editor.undo();
      await editor.typeAhead.popup.waitFor({ state: 'visible' });

      await expect(editor.typeAhead.wrapper).toContainText('Action');
    });

    test.describe('when a redo operation happens', () => {
      test('it should add the item back', async ({ editor }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('heading1');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.redo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await expect(editor).toHaveDocument(doc(p(' '), h1('')));
      });
    });

    test.describe('when a second undone operation happens', () => {
      test('it should insert the raw text back', async ({ editor }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('Action');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await expect(editor).toHaveDocument(doc(p(' /Action')));
      });
    });

    test.describe('when a third undone operation happens', () => {
      test('it should back to the original document', async ({ editor }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('Action');
        await editor.keyboard.press('ArrowDown');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();

        await expect(editor).toHaveDocument(doc(p(' ')));
      });
    });

    test.describe('when a third undone operation happens plus one redo after', () => {
      test('it should back to the original document', async ({ editor }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('Action');
        await editor.keyboard.press('ArrowDown');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.redo();

        await expect(editor).toHaveDocument(doc(p(' /Action')));
      });
    });

    test.describe('when a third undone operation happens plus two redo after', () => {
      test('it should open the typeahead menu with the query', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('Action');
        await editor.keyboard.press('ArrowDown');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.redo();
        await editor.redo();

        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await expect(editor.typeAhead.wrapper).toContainText('Action');
      });
    });

    test.describe('when a third undone operation happens plus three redo after', () => {
      test('it should open the typeahead menu with the query', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.typeAhead.search('heading1');
        await editor.keyboard.press('Enter');
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'visible' });

        await editor.undo();
        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await editor.undo();
        await editor.redo();
        await editor.redo();
        await editor.redo();

        await editor.typeAhead.popup.waitFor({ state: 'hidden' });

        await expect(editor).toHaveDocument(doc(p(' '), h1('')));
      });
    });
  });
});
