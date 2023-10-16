import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorPopupModel,
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
    const textColorPalette = popup.locator(
      '[data-testid="text-color-palette"]',
    );
    await textColorPalette.waitFor({ state: 'visible' });
    textColorPalette.locator(
      'button[aria-label="Green", aria-checked="false"]',
    );
    await textColorPalette.waitFor({ state: 'visible' });
    await textColorPalette.click();
    await keyboard.type('World!');
    await expect(editor).toHaveDocument(
      doc(p('Hello', textColor({ color: '#36b37e' })('World!'))),
    );
  });
});
