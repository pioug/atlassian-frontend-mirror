import {
  editorTestCase as test,
  expect,
  EditorMainToolbarModel,
  EditorNodeContainerModel,
} from '@af/editor-libra';
import { PanelType } from '@atlaskit/adf-schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  code_block,
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
  test('Insert Info panel in empty document', async ({ editor }) => {
    const { keyboard } = editor;
    let nodes = EditorNodeContainerModel.from(editor);
    const codeBlock = nodes.codeBlock.first();
    await codeBlock.click();
    const toolbar = EditorMainToolbarModel.from(editor);
    await toolbar.clickAt('Insert /');
    await keyboard.type('Info Panel');
    await keyboard.press('Enter');
    await expect(editor).toHaveDocument(
      doc(code_block()(), panel({ panelType: PanelType.INFO })(p())),
    );
  });
});
