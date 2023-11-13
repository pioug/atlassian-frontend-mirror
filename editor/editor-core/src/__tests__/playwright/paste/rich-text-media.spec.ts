import { editorTestCase as test, expect } from '@af/editor-libra';
import { documentWithParagraph } from './__fixtures__/adf-document';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  mediaGroup,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('paste: media', () => {
  test.use({
    adf: documentWithParagraph,
    editorProps: {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
    },
  });

  test('when message is not a media image node does nothing', async ({
    editor,
  }) => {
    const id = 'af9310df-fee5-459a-a968-99062ecbb756';
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<div data-id="${id}" data-node-type="media" data-type="file" data-collection="MediaServicesSample" title="Attachment" data-file-mime-type="pdf"></div>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        mediaGroup(
          media({
            id: id,
            type: 'file',
            collection: 'MediaServicesSample',
            __fileMimeType: 'pdf',
            __contextId: 'DUMMY-OBJECT-ID',
            __mediaTraceId: expect.any(String),
          })(),
        ),
        p('text'),
      ),
    );
  });
});
