import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
} from '@af/editor-libra';

import { toolbarInsertBlockMessages as insertBlockMessages } from '@atlaskit/editor-common/messages';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowLayouts: true,
  },
});

test('layouts: Backspacing within a layout shouldnt remove all contents', async ({
  editor,
}) => {
  const toolbar = EditorMainToolbarModel.from(editor);
  await toolbar.clickAt(insertBlockMessages.columns.defaultMessage);
  await editor.keyboard.type('*');
  await editor.keyboard.press('Space');
  await editor.keyboard.type('abc');
  await editor.keyboard.press('Enter');
  await editor.keyboard.type('123');

  await editor.keyboard.press('Backspace');
  await editor.keyboard.press('Backspace');
  await editor.keyboard.press('Backspace');

  await expect(editor).toMatchDocumentSnapshot();
});
