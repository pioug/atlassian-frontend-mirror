import {
  EditorMainToolbarModel,
  EditorPopupModel,
  EditorTextColourModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, textColor } from '@atlaskit/editor-test-helpers/doc-builder';

import { emptyDocument } from './__fixtures__/adf-documents';
test.describe('Toolbar TextColor', () => {
  test.use({
    adf: emptyDocument,
    editorProps: { allowTextColor: true },
  });
  test('using toolbar change text color', async ({ editor }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await keyboard.type('Hello');
    await toolbar.clickAt('Text color');
    const popup = EditorPopupModel.from(editor);
    const textColorPalette = EditorTextColourModel.from(popup);
    await textColorPalette.toBeVisible();
    await textColorPalette.selectColor('Green');
    await expect(textColorPalette.palette).toBeHidden();
    await keyboard.type('World!');
    await expect(editor).toHaveDocument(
      doc(p('Hello', textColor({ color: '#36b37e' })('World!'))),
    );
  });

  test('clicking on toolbar icon should close the popup', async ({
    editor,
  }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await keyboard.type('Hello');
    await toolbar.clickAt('Text color');
    const popup = EditorPopupModel.from(editor);
    const textColorPalette = EditorTextColourModel.from(popup);
    await textColorPalette.toBeVisible();
    await toolbar.clickAt('Text color');
    await expect(textColorPalette.palette).toBeHidden();
  });

  test('clicking on other toolbar item should close the popup', async ({
    editor,
  }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await keyboard.type('Hello');
    await toolbar.clickAt('Text color');
    const popup = EditorPopupModel.from(editor);
    const textColorPalette = EditorTextColourModel.from(popup);
    await textColorPalette.toBeVisible();
    await toolbar.clickAt('Bold');
    await expect(textColorPalette.palette).toBeHidden();
  });

  test('escape should close the picker', async ({ editor }) => {
    const { keyboard } = editor;
    const toolbar = EditorMainToolbarModel.from(editor);
    await keyboard.type('Hello');
    await toolbar.clickAt('Text color');
    const popup = EditorPopupModel.from(editor);
    const textColorPalette = EditorTextColourModel.from(popup);
    await textColorPalette.toBeVisible();
    await keyboard.press('Escape');
    await expect(textColorPalette.palette).toBeHidden();
  });
});
