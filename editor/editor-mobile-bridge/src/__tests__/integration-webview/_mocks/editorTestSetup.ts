import {
  MediaMock,
  MockCollections,
  MockFile,
} from '@atlaskit/media-test-helpers/media-mock';
import {
  mapDataUriToBlob,
  testMediaFileId,
  testMediaGroupFileId,
  testMediaEmptyImageFileId,
  testVideoFileId,
  defaultCollectionName,
  testMediaGroupFileId1,
  testMediaGroupFileId2,
  testMediaGroupFileId3,
  testVideoFailedFileId,
  testEmptyFileId,
} from './utils';
import { testImageDataURI } from './database/testImageDataURI';
import { testEmptyImageDataURI } from './database/testEmptyImageDataURI';

const mediaGroupBlob = new Blob(['Hello World'], { type: 'text/plain' });
const imageBlob = mapDataUriToBlob(testImageDataURI);
const emptyImageblob = mapDataUriToBlob(testEmptyImageDataURI);
export const mockFiles: MockFile[] = [
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
  {
    id: testVideoFileId,
    name: 'video.mp4',
    blob: emptyImageblob,
    processingStatus: 'succeeded',
    mediaType: 'video',
    mimeType: 'video/mp4',
    size: emptyImageblob.size,
    artifacts: {},
    representations: {
      image: {},
    },
  },
  {
    id: testVideoFailedFileId,
    name: 'video.mp4',
    blob: emptyImageblob,
    processingStatus: 'failed',
    mediaType: 'video',
    mimeType: 'video/mp4',
    size: emptyImageblob.size,
    artifacts: {},
    representations: {
      image: {},
    },
  },
  {
    id: testMediaGroupFileId,
    name: 'text_file.txt',
    mediaType: 'doc',
    artifacts: {},
    mimeType: 'text/plain',
    representations: {},
    size: mediaGroupBlob.size,
    blob: mediaGroupBlob,
  },
  {
    id: testMediaGroupFileId1,
    name: 'text_file1.txt',
    mediaType: 'doc',
    artifacts: {},
    mimeType: 'text/plain',
    representations: {},
    size: mediaGroupBlob.size,
    blob: mediaGroupBlob,
  },
  {
    id: testMediaGroupFileId2,
    name: 'text_file2.txt',
    mediaType: 'doc',
    artifacts: {},
    mimeType: 'text/plain',
    representations: {},
    size: mediaGroupBlob.size,
    blob: mediaGroupBlob,
  },
  {
    id: testMediaGroupFileId3,
    name: 'text_file3.txt',
    mediaType: 'doc',
    artifacts: {},
    mimeType: 'text/plain',
    representations: {},
    size: mediaGroupBlob.size,
    blob: mediaGroupBlob,
  },
  {
    id: testEmptyFileId,
    // This is to mimic the response of an empty file
    // which doesn't have any metadata. We cast it to
    // any to make typescript happy
  } as any,
];
export const collections: MockCollections = {
  [defaultCollectionName]: mockFiles,
};
const mediaMock = new MediaMock(collections);

mediaMock.enable();
