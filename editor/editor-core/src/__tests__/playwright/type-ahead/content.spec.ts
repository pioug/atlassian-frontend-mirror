import {
  EditorNodeContainerModel,
  EditorMainToolbarModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';

// eslint-disable-next-line import/no-extraneous-dependencies
import type { EditorProps } from '@atlaskit/editor-core';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { onlyOneChar, tableWithPlaceholders } from './__fixtures__/base-adfs';

test.describe('typeahead - content', () => {
  const editorProps: EditorProps = {
    appearance: 'full-page',
    allowTables: true,
    allowTemplatePlaceholders: {
      allowInserting: true,
    },
  };
  test.use({
    editorProps,
  });

  test.describe('when there is no query and space is pressed', () => {
    test.use({
      adf: onlyOneChar,
    });

    test('it should insert the trigger into the document', async ({
      editor,
    }) => {
      await editor.selection.set({
        anchor: 2,
        head: 2,
      });

      await editor.keyboard.press('Enter');
      await editor.typeAhead.search('');
      await editor.keyboard.type(' ');
      await editor.typeAhead.popup.isHidden();

      await expect(editor).toHaveDocument(doc(p('C'), p('/ ')));
    });
  });

  test.describe('when a typeahead is inserted at a placeholder', () => {
    test.use({ adf: tableWithPlaceholders });
    test('it should delete the placeholder', async ({ editor }) => {
      const { table, placeholder } = EditorNodeContainerModel.from(editor);
      const tablePlaceholder = table.locator(placeholder);

      const toolbar = EditorMainToolbarModel.from(editor);

      await tablePlaceholder.click();
      await toolbar.clickAt('Mention');

      await editor.typeAhead.query.isVisible();
      await editor.keyboard.type('Carolyn');
      await editor.keyboard.press('ArrowDown');
      await editor.keyboard.press('Enter');
      await editor.typeAhead.query.isHidden();

      await expect(await tablePlaceholder.count()).toEqual(0);
    });
  });
});
