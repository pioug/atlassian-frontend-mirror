import { MediaMock } from './media-mock';
import { mapDataUriToBlob, testMediaFileId } from './utils';
import { testImageDataURI } from './database/testImageDataURI';

const blob = mapDataUriToBlob(testImageDataURI);
const mediaMock = new MediaMock({
  MediaServicesSample: [
    {
      id: testMediaFileId,
      name: 'one.svg',
      blob,
      processingStatus: 'succeeded',
      mediaType: 'image',
      mimeType: blob.type,
      size: blob.size,
      artifacts: {},
      representations: {
        image: {},
      },
    },
  ],
});

mediaMock.enable();
