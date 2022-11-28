jest.mock('../../../util/getPreviewFromBlob');
jest.mock('../../../util/getPreviewFromImage');

jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue('some-scope'),
}));

import { MediaClient, UploadableFile, FileState } from '@atlaskit/media-client';
import {
  TouchedFiles,
  ProcessingFileState,
  createMediaSubscribable,
} from '@atlaskit/media-client';
import uuidV4 from 'uuid/v4';
import { asMock, fakeMediaClient } from '@atlaskit/media-test-helpers';
import { Subscriber } from 'rxjs/Subscriber';
import { UploadServiceImpl } from '../../uploadServiceImpl';
import * as getPreviewModule from '../../../util/getPreviewFromBlob';
import * as getPreviewFromImage from '../../../util/getPreviewFromImage';
import {
  Preview,
  UploadParams,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
} from '../../../types';

describe('UploadService', () => {
  const baseUrl = 'some-api-url';
  const usersClientId = 'some-users-collection-client-id';
  const usersToken = 'some-users-collection-client-id';
  const previewObject: Preview = { someImagePreview: true } as any;
  const defaultUploadMock = {
    subscribe() {},
  };

  const getMediaClient = (options = {}) =>
    fakeMediaClient({
      authProvider: () =>
        Promise.resolve({
          clientId: usersClientId,
          token: usersToken,
          baseUrl,
        }),
      ...options,
    });
  const file = { size: 100, name: 'some-filename', type: 'video/mp4' } as File;
  const setup = (
    mediaClient: MediaClient = getMediaClient(),
    tenantUploadParams: UploadParams = { collection: '' },
    shouldCopyFileToRecents: boolean = true,
  ) => {
    const touchedFiles: TouchedFiles = {
      created: [
        {
          fileId: 'uuid1',
          uploadId: 'some-upload-id-uuid1',
        },
        {
          fileId: 'uuid2',
          uploadId: 'some-upload-id-uuid2',
        },
        {
          fileId: 'uuid3',
          uploadId: 'some-upload-id-uuid3',
        },
        {
          fileId: 'uuid4',
          uploadId: 'some-upload-id-uuid4',
        },
      ],
    };
    asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);
    asMock(mediaClient.file.upload).mockReturnValue(defaultUploadMock);

    (getPreviewFromImage.getPreviewFromImage as any).mockReturnValue(
      Promise.resolve(previewObject),
    );

    const uploadService = new UploadServiceImpl(
      mediaClient,
      tenantUploadParams,
      shouldCopyFileToRecents,
    );

    const filesAddedPromise = new Promise<void>((resolve) =>
      uploadService.on('files-added', () => resolve()),
    );

    return { uploadService, filesAddedPromise, mediaClient };
  };

  beforeEach(() => {
    (getPreviewModule.getPreviewFromBlob as any).mockReset();
    (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
      Promise.resolve(),
    );
    (uuidV4 as unknown as jest.Mock<{}>)
      .mockReturnValueOnce('uuid1')
      .mockReturnValueOnce('uuid2')
      .mockReturnValueOnce('uuid3')
      .mockReturnValueOnce('uuid4');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('setUploadParams', () => {
    const setup = () => ({
      uploadService: new UploadServiceImpl(getMediaClient(), {}, false),
    });

    it('should set new uploadParams', () => {
      const { uploadService } = setup();

      uploadService.setUploadParams({
        collection: 'new-collection',
      });

      expect(uploadService['tenantUploadParams']).toEqual({
        collection: 'new-collection',
      });
    });
  });

  describe('addFiles', () => {
    it('should emit file-preview-update for video files', async () => {
      const { uploadService, filesAddedPromise } = setup();

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      const previewObject: Preview = { someImagePreview: true } as any;
      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
        Promise.resolve(previewObject),
      );

      uploadService.addFiles([file]);
      await filesAddedPromise;
      const expectedPayload: UploadPreviewUpdateEventPayload = {
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'video/mp4',
          occurrenceKey: expect.any(String),
        },
        preview: previewObject,
      };
      expect(callback).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit file-preview-update for image files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'image/png' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);
      await filesAddedPromise;
      const expectedPayload: UploadPreviewUpdateEventPayload = {
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'image/png',
          occurrenceKey: expect.any(String),
        },
        preview: previewObject,
      };
      expect(callback).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit empty file-preview-update for non native files', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/3gpp' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      uploadService.addFiles([file as File]);
      await filesAddedPromise;
      const expectedPayload: UploadPreviewUpdateEventPayload = {
        file: {
          creationDate: expect.any(Number),
          id: expect.any(String),
          name: 'some-filename',
          size: 100,
          type: 'video/3gpp',
          occurrenceKey: expect.any(String),
        },
        preview: {},
      };
      expect(callback).toHaveBeenCalledWith(expectedPayload);
    });

    it('should emit empty file-preview-update if getPreviewFromBlob() fails', (done) => {
      const { uploadService } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

      uploadService.on('file-preview-update', (payload) => {
        expect(payload).toMatchObject({
          file: {
            creationDate: expect.any(Number),
            id: expect.any(String),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
            occurrenceKey: expect.any(String),
          },
          preview: {},
        });
        done();
      });

      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
        Promise.reject(new Error('Something went wrong')),
      );

      uploadService.addFiles([file as File]);
      expect.assertions(1);
    });

    it('should use getPreviewFromBlob for non-image files when emitting preview', async () => {
      const { uploadService, filesAddedPromise } = setup();
      const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

      const callback = jest.fn();
      uploadService.on('file-preview-update', callback);

      (getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
        Promise.resolve({ someImagePreview: true }),
      );

      uploadService.addFiles([file as File]);
      await filesAddedPromise;

      expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledWith(
        'video',
        file,
      );
    });

    it('should not emit files-added if files is empty list', () => {
      const { uploadService } = setup();
      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);
      uploadService.addFiles([]);
      expect(filesAddedCallback).not.toHaveBeenCalled();
    });

    it('should emit files-added event with correct payload when addFiles() is called with multiple files', () => {
      const { uploadService } = setup();
      const currentTimestamp = Date.now();
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      uploadService.addFiles([file, file2]);
      const expectedPayload: UploadsStartEventPayload = {
        files: [
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
            occurrenceKey: expect.any(String),
          },
          {
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-other-filename',
            size: 100000000,
            type: 'image/png',
            occurrenceKey: expect.any(String),
          },
        ],
      };
      expect(filesAddedCallback).toHaveBeenCalledWith(expectedPayload);
      expect(filesAddedCallback.mock.calls[0][0].files[0].id).not.toEqual(
        filesAddedCallback.mock.calls[0][0].files[1].id,
      );
      expect(
        filesAddedCallback.mock.calls[0][0].files[0].creationDate,
      ).toBeGreaterThanOrEqual(currentTimestamp);
      expect(
        filesAddedCallback.mock.calls[0][0].files[1].creationDate,
      ).toBeGreaterThanOrEqual(currentTimestamp);
    });

    it('should call upload for each given file', () => {
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;
      const { mediaClient, uploadService } = setup(undefined, {
        collection: 'some-collection',
      });
      uploadService.addFiles([file, file2]);
      expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
      const expectedUploadableFile2: UploadableFile = {
        collection: 'some-collection',
        content: file2,
        name: 'some-other-filename',
        mimeType: 'image/png',
      };
      const expectedUploadableFile1: UploadableFile = {
        collection: 'some-collection',
        content: file,
        name: 'some-filename',
        mimeType: 'video/mp4',
      };

      expect(asMock(mediaClient.file.upload).mock.calls[0][0]).toEqual(
        expectedUploadableFile1,
      );

      expect(asMock(mediaClient.file.upload).mock.calls[1][0]).toEqual(
        expectedUploadableFile2,
      );
    });

    it.skip('should emit file-converting when uploadFile resolves', async () => {
      const mediaClient = getMediaClient();
      const { uploadService } = setup(mediaClient, {
        collection: 'some-collection',
      });
      const fileConvertingCallback = jest.fn();
      uploadService.on('file-converting', fileConvertingCallback);
      jest
        .spyOn(mediaClient.file, 'upload')

        .mockReturnValue(
          createMediaSubscribable({
            status: 'processing',
            id: 'public-file-id',
          } as ProcessingFileState),
        );
      uploadService.addFiles([file]);
      window.setTimeout(() => {
        expect(fileConvertingCallback).toHaveBeenCalledTimes(1);
        expect(fileConvertingCallback).toHaveBeenCalledWith({
          file: {
            publicId: 'public-file-id',
            id: expect.any(String),
            creationDate: expect.any(Number),
            name: 'some-filename',
            size: 100,
            type: 'video/mp4',
          },
        });
      });
    });

    it('should emit "file-upload-error" when uploadFile fail', () => {
      const mediaClient = getMediaClient();
      const { uploadService } = setup(mediaClient, {
        collection: 'some-collection',
      });
      const error = new Error('Some reason');
      const fileUploadErrorCallback = jest.fn();
      uploadService.on('file-upload-error', fileUploadErrorCallback);
      jest.spyOn(mediaClient.file, 'upload').mockReturnValue({
        // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
        //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
        subscribe(subscription: Subscriber<FileState>) {
          // window.setTimeout(() => {
          subscription.error(error);
          // }, 10)
        },
      });

      uploadService.addFiles([file]);

      expect(fileUploadErrorCallback).toHaveBeenCalledWith({
        fileId: 'uuid1',
        error: {
          fileId: 'uuid1',
          name: 'upload_fail',
          description: 'Some reason',
          rawError: error,
        },
      });
    });
  });

  describe('#cancel()', () => {
    it('should cancel specific upload', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;
      const { uploadService } = setup();
      const abort = jest.fn();
      (uploadService as any).createUploadController = () => ({ abort });

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      uploadService.addFiles([file]);

      const generatedId = filesAddedCallback.mock.calls[0][0].files[0].id;
      uploadService.cancel(generatedId);
      expect(abort).toHaveBeenCalled();
    });

    it('should cancel all uploads when #cancel is not passed any arguments', () => {
      const file1: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;
      const file2: File = {
        size: 10e7,
        name: 'some-other-filename',
        type: 'image/png',
      } as any;
      const { uploadService } = setup();
      const createUploadController = jest.fn().mockReturnValue({ abort() {} });
      (uploadService as any).createUploadController = createUploadController;

      const filesAddedCallback = jest.fn();

      uploadService.on('files-added', filesAddedCallback);
      uploadService.addFiles([file1, file2]);
      uploadService.cancel();
      expect(createUploadController).toHaveBeenCalledTimes(2);
    });

    it.skip('should release cancellableFilesUpload after file failed to upload', () => {
      const file: File = {
        size: 100,
        name: 'some-filename',
        type: 'doc',
      } as any;

      const mediaClient = getMediaClient();
      const { uploadService } = setup(mediaClient);

      const filesAddedCallback = jest.fn();
      uploadService.on('files-added', filesAddedCallback);

      return new Promise<void>((resolve) => {
        jest.spyOn(mediaClient.file, 'upload').mockReturnValue({
          // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
          //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
          subscribe(subscription: Subscriber<FileState>) {
            subscription.error();
            expect(
              Object.keys((uploadService as any).cancellableFilesUploads),
            ).toHaveLength(0);
            resolve();
          },
        });

        uploadService.addFiles([file]);
        expect(
          Object.keys((uploadService as any).cancellableFilesUploads),
        ).toHaveLength(1);
      });
    });
  });
});
