import {
  EditorExtensionModel,
  EditorFloatingToolbarModel,
  EditorNodeContainerModel,
  EditorExtensionDeleteConfirmationModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { connectedExtensionAdf } from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    allowExtension: {
      allowAutoSave: true,
    },
    allowFragmentMark: true,
  },
});

test.describe('gap-cursor: ', () => {
  test.use({
    adf: connectedExtensionAdf,
  });
  test(`should stay where it was after confirmation dialog closed`, async ({
    editor,
  }) => {
    let nodes = EditorNodeContainerModel.from(editor);
    await nodes.extension.first().waitFor({ state: 'visible' });
    await expect(nodes.extension).toHaveCount(2);

    // Initialise the floating toolbar model for extension
    const dataSourceExtensionModel = EditorExtensionModel.from(
      nodes.extension.first(),
    );
    const floatingToolbarModel = EditorFloatingToolbarModel.from(
      editor,
      dataSourceExtensionModel,
    );

    // Click extension
    await dataSourceExtensionModel.waitForStable();
    await dataSourceExtensionModel.clickTitle();

    // Click remove button on the floating toobar of the extension
    await floatingToolbarModel.waitForStable();
    await floatingToolbarModel.remove();

    // Initialize Delete Confirmation Modal
    const confirmationModal =
      EditorExtensionDeleteConfirmationModel.from(editor);
    await confirmationModal.waitForStable();

    // Validate if the consumer extension - listed in the modal
    await expect(confirmationModal.consumerList).toHaveCount(1);
    expect(await confirmationModal.consumerList.nth(0).innerText()).toEqual(
      'Test Name 2',
    );

    // Click checkbox on the confirmation dialog
    await confirmationModal.checkbox.isEditable();
    await confirmationModal.checkbox.click();

    // Click Delete on the confirmation dialog
    await confirmationModal.confirm();
    await editor.waitForEditorStable();

    // Validate if both the extensions are deleted from the page
    const updatedNodes = EditorNodeContainerModel.from(editor);
    await expect(updatedNodes.extension).toHaveCount(0);

    // Validate document status
    await expect(editor).toMatchDocument(
      doc(
        p(
          "Trying to delete the below extension will result in a confirmation dialog, because it's being used as a data source for the extension at the bottom",
        ),
        p('localId: a, b'),
        p(
          'The below extension ⌄⌄⌄ contains a dataConsumer and is linked to the above extension ^b^ ',
        ),
        p('localId: c, d '),
      ),
    );

    // Gap cursor should be at position 165
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 165,
      head: 165,
    });
  });
});
