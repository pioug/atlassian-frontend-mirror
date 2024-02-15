import {
  EditorMainToolbarModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, expand, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { emptyAdf } from './insert-expand-inline.spec.ts-fixtures/adf';

test.use({
  adf: emptyAdf,
  editorProps: {
    appearance: 'full-page',
    allowTextAlignment: true,
    smartLinks: {
      allowBlockCards: true,
      allowEmbeds: true,
    },
    allowExpand: { allowInsertion: true },
  },
});

test.describe('expand', () => {
  test('Quick insert an expand node in the current line', async ({
    editor,
  }) => {
    await editor.keyboard.type('Hello ');
    await editor.typeAhead.searchAndInsert('expand');

    await expect(editor).toHaveDocument(doc(p('Hello '), expand({})(p(''))));
  });

  test('Insert an expand node via toolbar in the current line', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await editor.keyboard.type('Hello ');
    await toolbar.clickAt('Insert elements');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(doc(p('Hello '), expand({})(p(''))));
  });

  test('Insert an expand node via toolbar in the current line with selection', async ({
    editor,
  }) => {
    const toolbar = EditorMainToolbarModel.from(editor);
    await editor.keyboard.type('Hello ');
    await editor.selection.set({ anchor: 1, head: 6 });
    await toolbar.clickAt('Insert elements');
    await editor.keyboard.press('ArrowDown');
    await editor.keyboard.press('Enter');

    await expect(editor).toHaveDocument(doc(expand({})(p('Hello '))));
  });
});
