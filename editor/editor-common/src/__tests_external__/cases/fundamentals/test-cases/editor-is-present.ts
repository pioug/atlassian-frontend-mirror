import { InProductTestCase } from '@atlaskit/in-product-testing';

import { EditorPageObject } from '../../../page-objects/Editor';
import { EditorTestCaseOpts } from '../../types';

export const editorIsPresentTestCase = (testOptions?: EditorTestCaseOpts) =>
  new InProductTestCase({
    testOptions,
    title: 'content-area, title of Editor are visible',
    id: 'editor-is-present',
    assertions: (cy) => {
      const editor = new EditorPageObject(cy);
      editor.getTitleArea().should('be.visible');
      editor.getEditorArea().should('be.visible');
    },
  });
