import type { EditorProps } from '@atlaskit/editor-core';
import {
  editorTestCase as test,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  spaceAtEnd,
  spaceBeforeText,
  onlyOneChar,
} from './__fixtures__/base-adfs';

for (const useEditorNextFlag of [true, false]) {
  test.describe(`typeahead: arrow navigation when ff for useEditorNext is ${useEditorNextFlag}`, () => {
    const editorProps: EditorProps = {
      appearance: 'full-page',
      featureFlags: { 'use-editor-next': useEditorNextFlag },
    };
    test.use({
      editorProps,
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
}
