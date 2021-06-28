import { EditorPageObject } from '../../../page-objects/Editor';
import { RendererPageObject } from '../../../page-objects/Renderer';
import { EditorTestCase } from '../../base-test-case';
import { TestCaseOpts } from '../../types';

export const editorTypingTestCase = (opts?: TestCaseOpts) =>
  new EditorTestCase({
    title: 'typing in Editor works',
    id: 'editor-typing',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      editor.getEditorArea().type('abcdef');
      editor.getEditorArea().contains('abcdef');

      if (!opts || !opts.ui?.publishButton) {
        return;
      }

      const { publishButton } = opts.ui;

      const renderer = new RendererPageObject(cy);

      cy.get(publishButton).click();
      renderer.getRenderedContent().contains('abcdef');
    },
  });
