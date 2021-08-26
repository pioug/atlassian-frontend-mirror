import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { map } from 'rxjs/operators/map';

import {
  FileState,
  UploadingFileState,
  ProcessingFileState,
  ProcessedFileState,
  ProcessingFailedState,
  isUploadingFileState,
  isErrorFileState,
  MediaStore,
} from '../../..';
import { createFileDataloader } from '../../createFileDataLoader';
import {
  createMobileUploadStateMachine,
  createMobileUploadService,
} from '../../mobileUpload';

jest.mock('../../createFileDataLoader');

describe('mobileUpload', () => {
  const processingFileState: ProcessingFileState = {
    status: 'processing',
    id: 'file-id',
    occurrenceKey: 'occurrence-key',
    name: 'image.png',
    size: 1,
    mediaType: 'image',
    mimeType: 'image/png',
    preview: {
      value: new Blob([], { type: 'image/png' }),
    },
    createdAt: -1,
  };

  const uploadingFileState: UploadingFileState = {
    ...processingFileState,
    status: 'uploading',
    progress: 0,
  };

  const processedFileState: ProcessedFileState = {
    ...processingFileState,
    status: 'processed',
    representations: {},
    artifacts: {},
  };

  const processingFailedState: ProcessingFailedState = {
    ...processingFileState,
    status: 'failed-processing',
    artifacts: {},
  };

  const setup = (initialState: UploadingFileState) => {
    const dataloader = createFileDataloader({} as jest.Mocked<MediaStore>);
    const machine = createMobileUploadStateMachine(dataloader, initialState);
    const service = createMobileUploadService(machine);

    return { machine, service };
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create stateMachine in uploading state', () => {
    const { machine } = setup(uploadingFileState);

    expect(machine.initial).toEqual(uploadingFileState.status);
    expect(machine.context.currentFileState).toEqual(uploadingFileState);
  });

  describe('uploading state', () => {
    it('should receive UPLOAD_PROGRESS event', (done) => {
      const { service } = setup(uploadingFileState);

      service.onTransition((state) => {
        // should eventually reach this transition
        if (
          state.matches('uploading') &&
          isUploadingFileState(state.context.currentFileState) &&
          state.context.currentFileState.progress === 0.6
        ) {
          expect(state.changed).toBeTruthy();
          expect(state.done).toBeFalsy();
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_PROGRESS', progress: 0.6 });
    });

    it('should deny invalid UPLOAD_PROGRESS event', (done) => {
      const { service } = setup({ ...uploadingFileState, progress: 0.8 });

      service.onTransition((state) => {
        // should eventually reach this transition
        if (
          state.matches('uploading') &&
          isUploadingFileState(state.context.currentFileState) &&
          state.context.currentFileState.progress === 0.8
        ) {
          expect(state.changed).toBeFalsy();
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_PROGRESS', progress: 0.5 });
    });

    it('should receive UPLOAD_END event', (done) => {
      const { service } = setup(uploadingFileState);

      service.onTransition((state) => {
        // should eventually reach this transition
        if (
          state.matches('processing') &&
          typeof state.value === 'object' &&
          state.value['processing'] === 'loading'
        ) {
          expect(state.changed).toBeTruthy();
          expect(state.done).toBeFalsy();
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });
    });

    it('should receive UPLOAD_ERROR event', (done) => {
      const { service } = setup(uploadingFileState);
      const message = 'Error';

      service.onTransition((state) => {
        // should eventually reach this transition
        if (
          state.matches('error') &&
          isErrorFileState(state.context.currentFileState)
        ) {
          expect(state.context.currentFileState.message).toEqual(message);
          expect(state.changed).toBeTruthy();
          expect(state.done).toBeTruthy();
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_ERROR', message });
    });
  });

  describe('processing state', () => {
    it('should call shouldFetchRemoteFileStates service', (done) => {
      const { machine } = setup(uploadingFileState);
      const shouldFetchRemoteFileStatesMock = jest.fn();
      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: shouldFetchRemoteFileStatesMock,
          },
        }),
      );

      service.onTransition((state) => {
        if (state.matches('processing')) {
          expect(shouldFetchRemoteFileStatesMock).toHaveBeenCalledTimes(1);
          expect(shouldFetchRemoteFileStatesMock).toHaveBeenCalledWith(
            {
              currentFileState: expect.objectContaining({
                status: 'processing',
                mediaType: uploadingFileState.mediaType,
                mimeType: uploadingFileState.mimeType,
                preview: uploadingFileState.preview,
              }),
            },
            { type: 'UPLOAD_END' },
            expect.any(Object),
          );
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(2);
    });

    it('should call fetchRemoteFileStates service when shouldFetchRemoteFileStates resolves to true', (done) => {
      const { machine } = setup(uploadingFileState);
      const fetchRemoteFileStatesMock = jest.fn();
      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: async () => true,
            fetchRemoteFileStates: fetchRemoteFileStatesMock,
          },
        }),
      );

      service.onTransition((state) => {
        if (
          state.matches('processing') &&
          typeof state.value === 'object' &&
          state.value['processing'] === 'fetchingRemoteFileStates'
        ) {
          expect(fetchRemoteFileStatesMock).toHaveBeenCalledTimes(1);
          expect(fetchRemoteFileStatesMock).toHaveBeenCalledWith(
            {
              currentFileState: expect.objectContaining({
                status: 'processing',
              }),
            },
            { type: 'REMOTE_FILESTATE_FETCH' },
            expect.any(Object),
          );
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(2);
    });

    it("shouldn't call fetchRemoteFileStates service when shouldFetchRemoteFileStates resolves to false", (done) => {
      const { machine } = setup(uploadingFileState);
      const fetchRemoteFileStatesMock = jest.fn();
      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: async () => false,
            fetchRemoteFileStates: fetchRemoteFileStatesMock,
          },
        }),
      );

      service.onTransition((state) => {
        if (
          state.matches('processing') &&
          typeof state.value === 'object' &&
          state.value['processing'] === 'idle'
        ) {
          expect(fetchRemoteFileStatesMock).toHaveBeenCalledTimes(0);
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(1);
    });

    it('should update processed fileState upon fetchRemoteFileStates completion', (done) => {
      const { machine } = setup(uploadingFileState);
      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: async () => true,
            fetchRemoteFileStates: () =>
              of<FileState>(
                // emit 2 processing file states, 1 processed and complete
                processingFileState,
                processingFileState,
                processedFileState,
              ).pipe(
                map((fileState) => ({
                  type: 'REMOTE_FILESTATE_RESULT',
                  fileState,
                })),
              ),
          },
        }),
      );

      service.onTransition((state) => {
        if (state.matches('processed')) {
          expect(state.context.currentFileState).toEqual(processedFileState);
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(1);
    });

    it('should update failed processing fileState upon fetchRemoteFileStates completion', (done) => {
      const { machine } = setup(uploadingFileState);
      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: async () => true,
            fetchRemoteFileStates: () =>
              of<FileState>(
                // emit 2 processing file states, 1 failed processing and complete
                processingFileState,
                processingFileState,
                processingFailedState,
              ).pipe(
                map((fileState) => ({
                  type: 'REMOTE_FILESTATE_RESULT',
                  fileState,
                })),
              ),
          },
        }),
      );

      service.onTransition((state) => {
        if (state.matches('processingFailed')) {
          expect(state.context.currentFileState).toEqual(processingFailedState);
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(1);
    });

    it('should update error fileState if fetchRemoteFileStates errors', (done) => {
      const { machine } = setup(uploadingFileState);
      const message = 'an error occured';

      const service = createMobileUploadService(
        machine.withConfig({
          services: {
            shouldFetchRemoteFileStates: async () => true,
            fetchRemoteFileStates: () => _throw(new Error(message)),
          },
        }),
      );

      service.onTransition((state) => {
        if (state.matches('error')) {
          expect(isErrorFileState(state.context.currentFileState)).toBeTruthy();
          expect(state.context.currentFileState).toEqual({
            status: 'error',
            id: uploadingFileState.id,
            occurrenceKey: uploadingFileState.occurrenceKey,
            message,
          });
          done();
        }
      });

      service.start();
      service.send({ type: 'UPLOAD_END' });

      expect.assertions(2);
    });
  });
});
