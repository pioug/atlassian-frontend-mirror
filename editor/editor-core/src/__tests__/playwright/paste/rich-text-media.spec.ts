import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  media,
  mediaGroup,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { multiLineTextDocument } from './__fixtures__/adf-document';

test.describe('paste: media', () => {
  test.use({
    adf: multiLineTextDocument,
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
        p('Lorem ipsum dolor sit amet.'),
        p(),
        p('consectetur adipiscing elit.'),
      ),
    );
  });

  test('media blob image copied from renderer and pasted in editor', async ({
    editor,
  }) => {
    const blobURL =
      'blob:http://localhost:9000/2b9bd4f5-ff8a-47dd-90cd-3b075a09d493#media-blob-url=true&id=411d195a-5214-4aff-9d12-ba31fe1610c7&collection=MediaServicesSample&contextId=DUMMY-OBJECT-ID&mimeType=image%2Fjpeg&name=adorable-5099450_1280-20230713-060223.jpg&size=547411&height=640&width=481&alt=';
    await editor.selection.set({ anchor: 30, head: 30 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><img src="${blobURL.replace(
        '&',
        '&amp;',
      )}"/>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        p('Lorem ipsum dolor sit amet.'),
        mediaSingle({
          layout: 'center',
        })(
          media({
            type: 'external',
            url: blobURL,
            __external: true,
          })(),
        ),
        p('consectetur adipiscing elit.'),
      ),
    );
  });
});
