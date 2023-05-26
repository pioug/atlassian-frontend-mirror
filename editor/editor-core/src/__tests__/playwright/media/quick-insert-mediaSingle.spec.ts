import {
  type EditorPageInterface,
  editorTestCase as test,
  EditorNodeContainerModel,
  EditorUploadMediaModel,
  EditorMediaSingleModel,
  expect,
} from '@atlaskit/editor-test-helpers/playwright';
import {
  doc,
  mediaSingle,
  panel,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { emptyDocument } from './__fixtures__/adf-documents';

async function testStepUploadImage(editor: EditorPageInterface): Promise<void> {
  await test.step('upload image', async () => {
    const nodes = EditorNodeContainerModel.from(editor);
    const mediaSingleModel = EditorMediaSingleModel.from(nodes.mediaSingle);
    const uploadModel = EditorUploadMediaModel.from(editor);
    const relativePathToImage =
      'packages/editor/editor-core/src/__tests__/playwright/media/__resources__/test-image-9kb.jpg';

    await uploadModel.upload({
      fileToUpload: relativePathToImage,
      actionToTriggerUpload: async () => {
        await editor.typeAhead.searchAndInsert('Image');
      },
    });

    await mediaSingleModel.waitForReady();
  });
}

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
      allowMediaGroup: true,
    },
    allowPanel: true,
    allowNewInsertionBehaviour: true,
  },
});

test.describe('quick-insert', () => {
  test.use({
    adf: emptyDocument,
  });

  const expectedDocument = {
    mediaBeforeParagraph: doc(
      mediaSingle({
        layout: 'center',
      }).any,
      p('Hello'),
    ),

    mediaAfterParagraph: doc(
      p('Hello'),
      mediaSingle({
        layout: 'center',
      }).any,
    ),

    mediaBeforePanel: doc(
      mediaSingle({
        layout: 'center',
      }).any,
      panel({ type: 'info' })(p('Hello')),
    ),

    mediaAfterPanel: doc(
      panel({ type: 'info' })(p('Hello ')),
      mediaSingle({
        layout: 'center',
      }).any,
    ),
  };

  test('should insert media before a paragraph', async ({ editor }) => {
    await editor.keyboard.type('Hello');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await testStepUploadImage(editor);
    await expect(editor).toMatchDocument(expectedDocument.mediaBeforeParagraph);
  });

  test('should insert media after a paragraph', async ({ editor }) => {
    await editor.keyboard.type('Hello ');
    await testStepUploadImage(editor);
    await expect(editor).toMatchDocument(expectedDocument.mediaAfterParagraph);
  });

  test('should insert an image before a paragraph nested inside a panel', async ({
    editor,
  }) => {
    await editor.typeAhead.search('Panel');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('Hello');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await editor.keyboard.press('ArrowLeft');
    await testStepUploadImage(editor);
    await expect(editor).toMatchDocument(expectedDocument.mediaBeforePanel);
  });

  test('should insert an image after a paragraph nested inside a panel', async ({
    editor,
  }) => {
    await editor.typeAhead.searchAndInsert('Panel');
    await editor.keyboard.type('Hello ');
    await testStepUploadImage(editor);
    await expect(editor).toMatchDocument(expectedDocument.mediaAfterPanel);
  });
});
