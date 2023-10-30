import { editorTestCase as test, expect } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, h1, h5 } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  spaceAtEnd,
  spaceBeforeText,
  onlyOneChar,
} from './__fixtures__/base-adfs';

test.describe('typeahead: arrow navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: spaceAtEnd,
  });

  test('it should open the typeahead quick insert and search Action', async ({
    editor,
  }) => {
    const title = 'Act';

    await editor.typeAhead.search(title);

    await expect(editor.typeAhead.popup).toBeVisible();
  });

  test.describe('when Escape is pressed', () => {
    test.use({
      adf: onlyOneChar,
    });

    test('it should insert the raw query with the trigger handler', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.press('Enter');

      const title = 'Act';
      await editor.typeAhead.search(title);

      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.press('ArrowLeft');

      await editor.keyboard.press('Escape');

      await expect(editor).toHaveDocument(doc(p('C'), p('/Act')));
    });
  });

  test.describe('when backspace is pressed before the trigger char', () => {
    test.use({
      adf: onlyOneChar,
    });
    test.describe('and the query is not empty', () => {
      test('it should insert the raw query without the trigger handler', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.keyboard.press('Enter');

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        await editor.keyboard.press('Backspace');

        await expect(editor).toHaveDocument(doc(p('C'), p('Act')));
      });
    });

    test.describe('and the query is empty', () => {
      test('it not should insert the query at the document', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.keyboard.press('Enter');

        const title = 'Act';
        await editor.typeAhead.search(title);

        await editor.keyboard.press('Backspace');
        await editor.keyboard.press('Backspace');
        await editor.keyboard.press('Backspace');
        await editor.keyboard.press('Backspace');

        await expect(editor).toHaveDocument(doc(p('C'), p()));
      });
    });
  });

  test.describe('when typeahead is add as first element in a new paragraph and user leaves the query', () => {
    test.use({
      adf: onlyOneChar,
    });

    test.describe('using the arrow left key', () => {
      test('it should insert the typeahead query content inside of the document', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.keyboard.press('Enter');

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        await expect(editor).toHaveDocument(doc(p('C'), p('/Act')));
      });
    });
    test.describe('using the arrow right key', () => {
      test('it should insert the typeahead query content inside of the document', async ({
        editor,
      }) => {
        await editor.selection.set({
          anchor: 2,
          head: 2,
        });

        await editor.keyboard.press('Enter');

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowRight');

        await expect(editor).toHaveDocument(doc(p('C'), p('/Act')));
      });
    });
  });

  test.describe('when typeahead is actived and user leaves the query', () => {
    test.use({
      adf: spaceBeforeText,
    });
    test.describe('using the arrow left key', () => {
      test('it should close the popup', async ({ editor }) => {
        // Set cursor position right before the 'b' char
        await editor.selection.set({
          anchor: 3,
          head: 3,
        });

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        await expect(editor.typeAhead.popup).toBeHidden();
      });

      test('it should insert the typeahead query content inside of the document', async ({
        editor,
      }) => {
        // Set cursor position right before the 'b' char
        await editor.selection.set({
          anchor: 3,
          head: 3,
        });

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');
        await editor.keyboard.press('ArrowLeft');

        await expect(editor).toHaveDocument(doc(p('a /Actb')));
      });
    });

    test.describe('using the arrow right key', () => {
      test('it should close the popup', async ({ editor }) => {
        // Set cursor position right before the 'b' char
        await editor.selection.set({
          anchor: 3,
          head: 3,
        });

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowRight');

        const isPopupInvisible = await editor.typeAhead.popup.isHidden();
        expect(isPopupInvisible).toBe(true);
      });

      test('it should insert the typeahead query content inside of the document', async ({
        editor,
      }) => {
        // Set cursor position right before the 'b' char
        await editor.selection.set({
          anchor: 3,
          head: 3,
        });

        const title = 'Act';
        await editor.typeAhead.search(title);
        await editor.keyboard.press('ArrowRight');

        await expect(editor).toHaveDocument(doc(p('a /Actb')));
      });
    });
  });
});

test.describe('typeahead: up & down arrow navigation', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    adf: spaceAtEnd,
  });

  test.describe('when cursor is inside of query and arrow down is used with ENTER to select', () => {
    test('it navigates to the typeahead search result below', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.type('X');
      await editor.keyboard.press('Space');
      await editor.typeAhead.search('heading');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');
      await editor.keyboard.type('X');
      await expect(editor).toHaveDocument(doc(p('X  '), h1('X')));
    });
  });

  test.describe('when cursor is inside of query and arrow down is used with CLICK to select', () => {
    test('it navigates to the typeahead search result below', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.type('X');
      await editor.keyboard.press('Space');
      await editor.typeAhead.search('heading');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('ArrowDown');
      await editor.typeAhead.itemSelected.click();
      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await editor.keyboard.type('X');
      await expect(editor).toHaveDocument(doc(p('X  '), h1('X')));
    });
  });

  test.describe('when cursor is inside of query and arrow up is used with ENTER to select', () => {
    test('it navigates to the typeahead search result below', async ({
      editor,
    }) => {
      // wait until option is actually selected before pressing enter,
      // going to end of list can sometimes be flaky otherwise
      const h5Locator = editor.typeAhead.popup.locator(
        ' [role="option"][aria-label="Heading 5"][aria-selected="true"]',
      );
      await editor.selection.set({
        anchor: 1,
        head: 1,
      });
      await editor.keyboard.type('X');
      await editor.keyboard.press('Space');
      await editor.typeAhead.search('heading');
      await editor.keyboard.press('ArrowUp');

      await editor.waitForEditorStable();
      await h5Locator.waitFor({ state: 'visible' });

      await editor.keyboard.press('Enter');
      await editor.typeAhead.popup.waitFor({ state: 'hidden' });

      await expect(editor).toHaveDocument(doc(p('X  '), h5('')));
    });
  });
});
