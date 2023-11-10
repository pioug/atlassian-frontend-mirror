import {
  editorTestCase as test,
  expect,
  EditorPlaceholderTextModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies
import { doc, p, placeholder } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('placeholder text', () => {
  test.describe('via quickinsert', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowTemplatePlaceholders: {
          allowInserting: true,
        },
        elementBrowser: {
          showModal: true,
          replacePlusMenu: true,
        },
      },
    });

    test('should insert placeholder text', async ({ editor }) => {
      const placeholderTextModel = new EditorPlaceholderTextModel(editor);
      await editor.keyboard.type('Hello ');
      await placeholderTextModel.quickInsert('placeholder-text');
      const displayedText = await placeholderTextModel.getPlaceholderText();
      expect(displayedText).toBe('placeholder-text');
      await expect(editor).toHaveDocument(
        doc(p('Hello ', placeholder({ text: 'placeholder-text' }))),
      );
    });

    test('can type inside placeholder and replace text', async ({ editor }) => {
      const placeholderTextModel = new EditorPlaceholderTextModel(editor);
      await editor.keyboard.type('Hello ');
      await placeholderTextModel.quickInsert('placeholder-text');
      await placeholderTextModel.clickPlaceholderText();
      await editor.keyboard.type('replaced');
      await expect(editor).toHaveDocument(doc(p('Hello ', 'replaced')));
    });

    test('can replace placeholder text with pasted content', async ({
      editor,
    }) => {
      const placeholderTextModel = new EditorPlaceholderTextModel(editor);
      await editor.keyboard.type('Hello ');
      await placeholderTextModel.quickInsert('placeholder-text');
      await placeholderTextModel.clickPlaceholderText();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        text: 'testpastetest',
        html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">test<span data-testid="pastetest" data-node-type="status" data-color="neutral" data-local-id="cd5fe1cb-6828-4d85-b483-ee8fba47b3d3" data-style="" contenteditable="false">pastetest</span></p>`,
      });
      expect(
        await editor.page.getByText('Hello testpastetest').isVisible(),
      ).toBeTruthy();
      await expect(editor).toHaveDocument(doc(p('Hello ', 'testpastetest')));
    });
  });
});
