import {
  EditorContextPanelModel,
  EditorFocusModel,
  EditorPlaceholderTextModel,
  expect,
  editorTestCase as test,
} from '@af/editor-libra';

import { placeholderAndEmptyParagraph } from './focus.spec.ts-fixtures';

test.describe('placeholder-text: focus', () => {
  test.describe('when context panel is open', () => {
    test.use({
      adf: placeholderAndEmptyParagraph,
      editorProps: {
        appearance: 'full-page',
        allowTemplatePlaceholders: {
          allowInserting: true,
        },
      },
      editorMountOptions: {
        withContextPanel: true,
      },
    });

    test('should focus in editor when placeholder is clicked', async ({
      editor,
    }) => {
      const placeholderTextModel = new EditorPlaceholderTextModel(editor);
      const editorFocusModel = EditorFocusModel.from(editor);
      const contextPanelModel = EditorContextPanelModel.from(editor);
      await expect(contextPanelModel.contextPanelContent).toBeVisible();

      await contextPanelModel.contextPanelContent.click();
      await expect(await editorFocusModel.notFocused()).toBeTruthy();

      await placeholderTextModel.clickPlaceholderText();
      await expect(await editorFocusModel.hasFocus()).toBeTruthy();
    });
  });
});
