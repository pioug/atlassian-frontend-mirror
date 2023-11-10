import { editorTestCase as test, expect } from '@af/editor-libra';
import { placeholderDocument } from './placeholder-text-default.spec.ts-fixtures/placeholder-document';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

export const editable = '.ProseMirror';

test.describe('placeholder text', () => {
  test.describe('default placeholder', () => {
    test.use({
      adf: placeholderDocument,
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

    test('can type inside placeholder and replace with text', async ({
      editor,
    }) => {
      await editor.page.click(editable);
      await editor.keyboard.press('ArrowLeft');
      await editor.keyboard.type('This is my text');
      await expect(editor).toHaveDocument(doc(p('This is my text')));
    });

    test('can replace with pasted inline node', async ({ editor }) => {
      await editor.page.click(editable);
      await editor.keyboard.press('ArrowLeft');
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        text: 'testtest',
        html: `<meta charset='utf-8'><p data-pm-slice="1 1 []">test<span data-node-type="status" data-color="neutral" data-local-id="cd5fe1cb-6828-4d85-b483-ee8fba47b3d3" data-style="" contenteditable="false">test</span></p>`,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(doc(p('testtest')));
    });
  });
});
