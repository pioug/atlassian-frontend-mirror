import { editorTestCase as test, expect } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  mediaSingle,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { adfWithOneExternalMedia } from './__fixtures__/adf-documents';

test.use({
  editorProps: {
    appearance: 'full-page',
    media: {
      allowMediaSingle: true,
    },
  },
});

test.describe('external media', () => {
  test.use({
    adf: adfWithOneExternalMedia,
  });

  test('should keep existing external as is', async ({ editor }) => {
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
            __displayType: null,
            __mediaTraceId: null,
            height: 359,
            width: 860,
          })(),
        ),
      ),
    );
  });
});
