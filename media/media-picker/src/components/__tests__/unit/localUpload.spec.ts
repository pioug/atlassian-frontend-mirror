import { LocalUploadComponent } from '../../localUpload';
import { UploadServiceImpl } from '../../../service/uploadServiceImpl';
import { MediaFile } from '../../../types';
import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

describe('MediaLocalUpload', () => {
  const imageFile: MediaFile = {
    id: 'some-id',
    name: 'some-name',
    size: 12345,
    creationDate: Date.now(),
    type: 'image/jpg',
  };
  const setup = (options: { shouldCopyFileToRecents?: boolean } = {}) => {
    const mediaClient = fakeMediaClient();
    const config = {
      uploadParams: {
        collection: '',
      },
      shouldCopyFileToRecents: options.shouldCopyFileToRecents,
    };
    const localUpload = new LocalUploadComponent(mediaClient, config);
    const uploadService = localUpload['uploadService'] as UploadServiceImpl;
    const emitUploadServiceEvent = uploadService['emit'];
    const emitter = localUpload['emitter'];

    jest.spyOn(emitter, 'emit');

    return {
      localUpload,
      emitUploadServiceEvent,
      emitter,
    };
  };

  const extractShouldCopyFileToRecents = (
    localUpload: LocalUploadComponent,
  ) => {
    const uploadService: UploadServiceImpl = localUpload[
      'uploadService'
    ] as any;
    return uploadService['shouldCopyFileToRecents'];
  };

  it('should emit uploads-start event given upload service emits files-added event', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('files-added', {
      files: [imageFile],
    });

    expect(emitter.emit).toBeCalledWith('uploads-start', {
      files: [expect.objectContaining(imageFile)],
    });
  });

  it('should emit upload-preview-update event given upload service emits file-preview-update event', () => {
    const { emitter, emitUploadServiceEvent } = setup();

    emitUploadServiceEvent('file-preview-update', {
      file: imageFile,
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    });

    expect(emitter.emit).toBeCalledWith('upload-preview-update', {
      file: expect.objectContaining(imageFile),
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    });
  });

  it('should use shouldCopyFileToRecents as true by default and pass to upload service', () => {
    const { localUpload } = setup();
    const shouldCopyFileToRecents = extractShouldCopyFileToRecents(localUpload);
    expect(shouldCopyFileToRecents).toEqual(true);
  });

  it('should use given shouldCopyFileToRecents and pass to upload service', () => {
    const { localUpload } = setup({ shouldCopyFileToRecents: false });
    const shouldCopyFileToRecents = extractShouldCopyFileToRecents(localUpload);
    expect(shouldCopyFileToRecents).toEqual(false);
  });
});
