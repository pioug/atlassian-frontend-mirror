import {
  EditorUploadMediaModel,
  editorTestCase as test,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('Media drag and drop', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
    },
  });

  test('should upload a image file', async ({ editor }) => {
    const upload = EditorUploadMediaModel.from(editor);

    await upload.simulateDropFileEvent({});
    await editor.waitForEditorStable();
    await expect(editor).toMatchDocument(
      doc(
        mediaSingle()(
          media({
            __contextId: expect.any(String),
            __fileMimeType: 'image/jpg',
            __fileName: 'test-image-9kb',
            __fileSize: 8751,
            collection: 'MediaServicesSample',
            id: expect.any(String),
            type: 'file',
          })(),
        ),
        p(''),
      ),
    );
  });
});
