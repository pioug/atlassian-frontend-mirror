import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorFindAndReplaceModel,
} from '@af/editor-libra';

import { matchCaseAdf } from './find-replace.spec.ts-fixtures/adf';

test.describe('Find/replace', () => {
  test.use({
    adf: matchCaseAdf,
    editorProps: {
      appearance: 'full-page',
      allowPanel: true,
      allowExpand: true,
      allowFindReplace: { allowMatchCase: true },
    },
  });

  test('when Match Case feature toggle is enabled, should not match case by default', async ({
    editor,
  }) => {
    await editor.waitForEditorStable();
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Find and replace');
    const findReplaceModel = EditorFindAndReplaceModel.from(editor);
    await findReplaceModel.clickFindInput();
    await editor.keyboard.type('HELLO');
    await editor.waitForEditorStable();
    expect(await findReplaceModel.matches.count()).toBe(9);
    await expect(findReplaceModel.matches.nth(8)).toBeVisible();
  });
});
