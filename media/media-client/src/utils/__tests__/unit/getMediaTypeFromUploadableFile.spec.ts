import { getMediaTypeFromUploadableFile } from '../../getMediaTypeFromUploadableFile';

describe('getMediaTypeFromUploadableFile()', () => {
  const setup = (type: string = 'image/png') => {
    const blobFile = {
      content: new File([], 'file-name', { type }),
    };
    const base64File = {
      content: 'some-base-64',
    };

    return {
      blobFile,
      base64File,
    };
  };

  it('should return unknown for non Blob files', () => {
    const { base64File } = setup();

    expect(getMediaTypeFromUploadableFile(base64File)).toEqual('unknown');
  });

  it('should return valid media type from Blob files', () => {
    const { blobFile: imageFile } = setup();
    const { blobFile: videoFile } = setup('video/mp4');
    const { blobFile: unknownFile } = setup('random-format/xzy');

    expect(getMediaTypeFromUploadableFile(imageFile)).toEqual('image');
    expect(getMediaTypeFromUploadableFile(videoFile)).toEqual('video');
    expect(getMediaTypeFromUploadableFile(unknownFile)).toEqual('unknown');
  });
});
