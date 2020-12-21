import {
  MediaType,
  FilePreview,
  UploadingFileState,
  ProcessingFileState,
} from '@atlaskit/media-client';

import {
  PROCESSING_UPLOAD_PORTION,
  PROCESSING_STEP,
  PROCESSING_MAX_VALUE,
  PROCESSING_TICK,
  shouldShowProcessingProgress,
  createProcessingProgressTimer,
} from '../../processingProgress';

describe('shouldShowProcessingProgress()', () => {
  type UseCase = 'uploading' | 'processing';
  const useCases: Array<UseCase> = ['uploading', 'processing'];

  const setup = (
    useCase: UseCase,
    mediaType: MediaType,
    mimeType: string,
    opts: {
      preview?: FilePreview | Promise<FilePreview>;
    } = {},
  ): UploadingFileState | ProcessingFileState => {
    const { preview } = opts;

    switch (useCase) {
      case 'uploading':
        return {
          status: 'uploading',
          id: 'some-id',
          name: 'some-filename',
          size: 1,
          progress: 0,
          mediaType,
          mimeType,
          preview,
        };
      case 'processing':
        return {
          status: 'processing',
          id: 'some-id',
          name: 'some-filename',
          size: 1,
          mediaType,
          mimeType,
          preview,
        };
    }
  };

  describe('Media-card redesign', () => {
    const featureFlags = { newCardExperience: true };

    it('should show processing progress for documents supported by server', () => {
      useCases.forEach(useCase => {
        const fileState = setup(
          useCase,
          'doc',
          'application/vnd.ms-powerpoint',
        );

        expect(
          shouldShowProcessingProgress(fileState, featureFlags),
        ).toBeTruthy();
      });
    });

    it('should show processing progress for other files without preview supported by server', () => {
      const fileTypes: Array<{ mediaType: MediaType; mimeType: string }> = [
        { mediaType: 'image', mimeType: 'image/heic' },
        { mediaType: 'audio', mimeType: 'audio/flac' },
        { mediaType: 'video', mimeType: 'video/quicktime' },
      ];

      useCases.forEach(useCase =>
        fileTypes.forEach(({ mediaType, mimeType }) => {
          const fileState = setup(useCase, mediaType, mimeType);

          expect(
            shouldShowProcessingProgress(fileState, featureFlags),
          ).toBeTruthy();
        }),
      );
    });

    it('should not show processing progress for files with preview supported by server', () => {
      const fileTypes: Array<{
        mediaType: MediaType;
        mimeType: string;
        preview: FilePreview;
      }> = [
        {
          mediaType: 'image',
          mimeType: 'image/png',
          preview: { value: new Blob([], { type: 'image/png' }) },
        },
        {
          mediaType: 'audio',
          mimeType: 'audio/mpeg',
          preview: { value: new Blob([], { type: 'audio/mpeg' }) },
        },
        {
          mediaType: 'video',
          mimeType: 'video/mp4',
          preview: { value: new Blob([], { type: 'video/mp4' }) },
        },
      ];

      useCases.forEach(useCase =>
        fileTypes.forEach(({ mediaType, mimeType, preview }) => {
          const fileState = setup(useCase, mediaType, mimeType, { preview });

          expect(
            shouldShowProcessingProgress(fileState, featureFlags),
          ).toBeFalsy();
        }),
      );
    });

    it('should not show processing progress for files not supported by server', () => {
      useCases.forEach(useCase => {
        const fileState = setup(useCase, 'archive', 'application/zip');

        expect(
          shouldShowProcessingProgress(fileState, featureFlags),
        ).toBeFalsy();
      });
    });
  });

  describe('Classic experience', () => {
    it('should show processing progress for files without preview supported by server', () => {
      const fileTypes: Array<{ mediaType: MediaType; mimeType: string }> = [
        { mediaType: 'image', mimeType: 'image/heic' },
        { mediaType: 'audio', mimeType: 'audio/flac' },
        { mediaType: 'video', mimeType: 'video/quicktime' },
      ];

      useCases.forEach(useCase =>
        fileTypes.forEach(({ mediaType, mimeType }) => {
          const fileState = setup(useCase, mediaType, mimeType);

          expect(shouldShowProcessingProgress(fileState)).toBeTruthy();
        }),
      );
    });

    it('should not show processing progress for files with preview supported by server', () => {
      const fileTypes: Array<{
        mediaType: MediaType;
        mimeType: string;
        preview: FilePreview;
      }> = [
        {
          mediaType: 'image',
          mimeType: 'image/png',
          preview: { value: new Blob([], { type: 'image/png' }) },
        },
        {
          mediaType: 'doc',
          mimeType: 'application/pdf',
          preview: { value: new Blob([], { type: 'application/pdf' }) },
        },
        {
          mediaType: 'audio',
          mimeType: 'audio/mpeg',
          preview: { value: new Blob([], { type: 'audio/mpeg' }) },
        },
        {
          mediaType: 'video',
          mimeType: 'video/mp4',
          preview: { value: new Blob([], { type: 'video/mp4' }) },
        },
      ];

      useCases.forEach(useCase =>
        fileTypes.forEach(({ mediaType, mimeType, preview }) => {
          const fileState = setup(useCase, mediaType, mimeType, { preview });

          expect(shouldShowProcessingProgress(fileState)).toBeFalsy();
        }),
      );
    });

    it('should not show processing progress for files not supported by server', () => {
      useCases.forEach(useCase => {
        const fileState = setup(useCase, 'archive', 'application/zip');

        expect(shouldShowProcessingProgress(fileState)).toBeFalsy();
      });
    });

    it('should not show processing progress for doc types in classic mode', () => {
      useCases.forEach(useCase => {
        const fileState = setup(
          useCase,
          'doc',
          'application/vnd.ms-powerpoint',
        );

        expect(
          shouldShowProcessingProgress(fileState, { newCardExperience: false }),
        ).toBeFalsy();
      });
    });

    it('should show processing progress for image types in classic mode', () => {
      useCases.forEach(useCase => {
        const fileState = setup(useCase, 'image', 'image/heic');

        expect(
          shouldShowProcessingProgress(fileState, { newCardExperience: false }),
        ).toBeTruthy();
      });
    });
  });
});

describe('[create/clear]ProcessingProgressTimer()', () => {
  let timer: number;

  const setup = (
    opts: {
      lastProgress?: number;
      lastTimer?: number;
    } = {},
  ) => {
    const { lastProgress, lastTimer } = opts;

    jest.useFakeTimers();

    const updateProgressMock = jest.fn();
    timer = createProcessingProgressTimer(updateProgressMock, {
      lastProgress,
      lastTimer,
    });

    return { updateProgressMock };
  };

  afterEach(() => !!timer && clearInterval(timer));
  afterAll(() => jest.useRealTimers());

  it('should call window.setInterval', () => {
    setup();
    expect(setInterval).toHaveBeenCalledTimes(1);
  });

  it('should clear previous timer if passed', () => {
    const lastTimer = 1;
    setup({ lastTimer });
    expect(clearInterval).toHaveBeenCalledWith(lastTimer);
  });

  it('should call updateProgress() callback each tick', () => {
    const { updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 3);
    expect(updateProgressMock).toHaveBeenCalledTimes(3);
  });

  it('should add PROCESSING_STEP to PROCESSING_UPLOAD_PORTION', () => {
    const { updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 2);

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      1,
      PROCESSING_UPLOAD_PORTION + PROCESSING_STEP,
    );

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      2,
      PROCESSING_UPLOAD_PORTION + PROCESSING_STEP + PROCESSING_STEP,
    );
  });

  it('should add PROCESSING_STEP to previous progress if passed', () => {
    const lastProgress = 0.4;
    const { updateProgressMock } = setup({
      lastProgress,
    });
    jest.advanceTimersByTime(PROCESSING_TICK * 2);

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      1,
      lastProgress + PROCESSING_STEP,
    );

    expect(updateProgressMock).toHaveBeenNthCalledWith(
      2,
      lastProgress + PROCESSING_STEP + PROCESSING_STEP,
    );
  });

  it('should max at PROCESSING_MAX_VALUE', () => {
    const { updateProgressMock } = setup();
    jest.advanceTimersByTime(PROCESSING_TICK * 30);
    expect(updateProgressMock).toHaveBeenNthCalledWith(
      30,
      PROCESSING_MAX_VALUE,
    );
  });
});
