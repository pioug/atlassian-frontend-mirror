import { EditorPageObject } from '../../../page-objects/Editor';
import { EditorTestCase } from '../../base-test-case';
import { TestCaseOpts } from '../../types';

export const editorIsPresentTestCase = (opts?: TestCaseOpts) =>
  new EditorTestCase({
    testOptions: opts,
    title: 'content-area, title of Editor are visible',
    id: 'editor-is-present',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      editor.getTitleArea().should('be.visible');
      editor.getEditorArea().should('be.visible');
    },
  });
