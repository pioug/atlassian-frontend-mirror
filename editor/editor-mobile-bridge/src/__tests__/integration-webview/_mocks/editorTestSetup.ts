import { MediaMock } from './media-mock';
import {
  mapDataUriToBlob,
  testMediaFileId,
  testMediaEmptyImageFileId,
} from './utils';
import { testImageDataURI } from './database/testImageDataURI';
import { testEmptyImageDataURI } from './database/testEmptyImageDataURI';

const imageBlob = mapDataUriToBlob(testImageDataURI);
const emptyImageblob = mapDataUriToBlob(testEmptyImageDataURI);
const mediaMock = new MediaMock({
  MediaServicesSample: [
    {
      id: testMediaFileId,
      name: 'one.svg',
      blob: imageBlob,
      processingStatus: 'succeeded',
      mediaType: 'image',
      mimeType: imageBlob.type,
      size: imageBlob.size,
      artifacts: {},
      representations: {
        image: {},
      },
    },
    {
      id: testMediaEmptyImageFileId,
      name: 'one.svg',
      blob: emptyImageblob,
      processingStatus: 'succeeded',
      mediaType: 'image',
      mimeType: emptyImageblob.type,
      size: emptyImageblob.size,
      artifacts: {},
      representations: {
        image: {},
      },
    },
  ],
});

mediaMock.enable();
