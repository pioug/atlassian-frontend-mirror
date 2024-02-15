import {
  EditorMainToolbarModel,
  EditorNodeContainerModel,
  expect,
  fixTest,
  editorTestCase as test,
} from '@af/editor-libra';
import { PanelType } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code_block,
  doc,
  p,
  panel,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { singleCodeBlock } from './__fixtures__/adf-documents-panel';
test.describe('insert panel inside code block', () => {
  test.use({
    adf: singleCodeBlock,
    editorProps: {
      appearance: 'full-page',
      elementBrowser: {
        showModal: true,
        replacePlusMenu: true,
      },
      allowPanel: true,
    },
  });

  // The test appear to be flaky while testing revamp bundler ticket https://hello.atlassian.net/browse/UTEST-1021
  test('Insert Info panel in empty document', async ({ editor }) => {
    fixTest({
      jiraIssueId: 'UTEST-1213',
      reason: 'Test fails with latest revamp bundler',
    });
    const { keyboard } = editor;
    let nodes = EditorNodeContainerModel.from(editor);
    const codeBlock = nodes.codeBlock.first();
    await codeBlock.click();
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Insert elements');
    await keyboard.type('Info Panel');
    await keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(code_block()(), panel({ panelType: PanelType.INFO })(p())),
    );
  });
});
