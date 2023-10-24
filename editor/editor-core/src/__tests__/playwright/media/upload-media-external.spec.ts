import {
  editorTestCase as test,
  EditorMediaSingleModel,
  EditorNodeContainerModel,
  expect,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('when pasted an external media', () => {
  test('should upload it', async ({ editor }) => {
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      text: '',
      html: `<meta charset='utf-8'><img src="http://localhost:9000/img/editor-core/test-image-9kb.jpg"/>`,
    });

    const nodes = EditorNodeContainerModel.from(editor);

    const mediaModel = EditorMediaSingleModel.from(nodes.mediaSingle);
    await mediaModel.waitForReady();

    await expect(editor).toMatchDocument(
      doc(
        mediaSingle()(
          media({
            id: expect.any(String),
            occurrenceKey: expect.any(String),
            collection: 'MediaServicesSample',
            type: 'file',
            __external: true,
            __contextId: expect.any(String),
            __fileMimeType: 'image/jpeg',
            __fileName: 'test-image-9kb.jpg',
            __fileSize: 8751,
            height: 359,
            width: 860,
          })(),
        ),
      ),
    );
  });
});
