import {
  ErrorFileState,
  isErrorFileState,
  isImageRepresentationReady,
  ProcessingFailedState,
  ProcessedFileState,
  ProcessingFileState,
  isPreviewableFileState,
  FileState,
} from '../..';

describe('isErrorFileState()', () => {
  const processingFailedState: ProcessingFailedState = {
    status: 'failed-processing',
    id: 'some-id',
    name: 'some-name',
    size: 42,
    artifacts: {},
    mediaType: 'image',
    mimeType: 'some-mime-type',
    representations: {},
  };

  const errorState: ErrorFileState = {
    status: 'error',
    id: 'some-id',
  };
  it('should return true when it is an error file state', () => {
    expect(isErrorFileState(errorState)).toBe(true);
  });
  it('should return false when it is not an error file state', () => {
    expect(isErrorFileState(processingFailedState)).toBe(false);
  });
});

describe('isImageRepresentationReady()', () => {
  const processedWithNoImage: ProcessedFileState = {
    status: 'processed',
    id: 'some-id',
    name: 'some-name',
    size: 42,
    mediaType: 'image',
    mimeType: 'some-mime-type',
    artifacts: {},
    representations: {},
  };

  it('should return false when representations has no image', () => {
    expect(isImageRepresentationReady(processedWithNoImage)).toBe(false);
  });

  it('should return true when status is processed and representations has image', () => {
    const processedWithImage: ProcessedFileState = {
      ...processedWithNoImage,
      representations: {
        image: {},
      },
    };

    expect(isImageRepresentationReady(processedWithImage)).toBe(true);
  });

  it('should return true when status is processing and representations has image', () => {
    const processingWithImage: ProcessingFileState = {
      status: 'processing',
      id: 'some-id',
      name: 'some-name',
      size: 42,
      mediaType: 'image',
      mimeType: 'some-mime-type',
      representations: {
        image: {},
      },
    };

    expect(isImageRepresentationReady(processingWithImage)).toBe(true);
  });

  it('should return true when status is failed-processing and representations has image', () => {
    const processingFailedWithImage: ProcessingFailedState = {
      status: 'failed-processing',
      id: 'some-id',
      name: 'some-name',
      size: 42,
      artifacts: {},
      mediaType: 'image',
      mimeType: 'some-mime-type',
      representations: {
        image: {},
      },
    };

    expect(isImageRepresentationReady(processingFailedWithImage)).toBe(true);
  });

  it('should return false for error state', () => {
    expect(
      isImageRepresentationReady({ status: 'error', id: 'some-id' }),
    ).toBeFalsy();
  });

  it('should return false for non error state and representations missings', () => {
    expect(
      isImageRepresentationReady({
        status: 'processing',
        id: 'some-id',
        mediaType: 'video',
        mimeType: '',
        name: '',
        size: 0,
      }),
    ).toBeFalsy();
    expect(
      isImageRepresentationReady({
        status: 'processed',
        id: 'some-id',
        mediaType: 'video',
        mimeType: '',
        name: '',
        size: 0,
        artifacts: {},
      }),
    ).toBeFalsy();
    expect(
      isImageRepresentationReady({
        status: 'failed-processing',
        id: 'some-id',
        mediaType: 'video',
        mimeType: '',
        name: '',
        size: 0,
        artifacts: {},
      }),
    ).toBeFalsy();
  });
});

describe('isPreviewableFileState()', () => {
  it('should return true if the input has defined preview attribute', () => {
    expect(
      isPreviewableFileState(({
        preview: 'some-preview',
      } as unknown) as FileState),
    ).toBe(true);
  });

  it('should return false if the input has nullish preview attribute', () => {
    expect(
      isPreviewableFileState(({
        preview: undefined,
      } as unknown) as FileState),
    );
    expect(
      isPreviewableFileState(({
        preview: null,
      } as unknown) as FileState),
    ).toBe(false);
  });
});
