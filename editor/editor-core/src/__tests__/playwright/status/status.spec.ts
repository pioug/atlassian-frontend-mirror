import {
  editorTestCase as test,
  expect,
  EditorNodeContainerModel,
  EditorPopupModel,
  EditorStatusModel,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import singleStatus from './__fixtures__/status-single.adf.json';

test.describe('test status', () => {
  test.use({
    adf: singleStatus,
    editorProps: {
      appearance: 'full-page',
      allowStatus: true,
    },
  });

  test('Clicking on the status and pressing Delete should delete the status', async ({
    editor,
  }) => {
    const { keyboard } = editor;
    const popupModel = EditorPopupModel.from(editor);
    let nodes = EditorNodeContainerModel.from(editor);
    const statusModel = EditorStatusModel.from(nodes.status);
    await statusModel.openStatusPicker(popupModel);
    await keyboard.press('Delete');
    await expect(editor).toHaveDocument(doc(p()));
  });
});
