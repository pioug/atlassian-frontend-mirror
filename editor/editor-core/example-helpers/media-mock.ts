import {
  MediaMock,
  generateFilesFromTestData,
  fakeImage,
} from '@atlaskit/media-test-helpers';
import {
  testMediaFileId,
  testMediaGroupFileId,
} from '@atlaskit/editor-test-helpers';

export default new MediaMock({
  recents: generateFilesFromTestData([
    {
      name: 'one.svg',
      dataUri: fakeImage,
    },
    {
      name: 'two.svg',
      dataUri: fakeImage,
    },
    {
      name: 'three.svg',
      dataUri: fakeImage,
    },
    {
      name: 'four.svg',
      dataUri: fakeImage,
    },
    {
      name: 'five.svg',
      dataUri: fakeImage,
    },
  ]),
  MediaServicesSample: generateFilesFromTestData([
    {
      id: testMediaFileId,
      name: 'one.svg',
      dataUri: fakeImage,
    },
    {
      id: testMediaGroupFileId,
      name: 'text_file.txt',
      mediaType: 'doc',
    },
  ]),
});
