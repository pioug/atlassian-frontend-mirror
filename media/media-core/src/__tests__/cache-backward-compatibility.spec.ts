/**
 *  This test is a safety net that should prevent us from making any forward and backward breaking
 *  changes in ANYTHING inside FileState interface. This interface is what being stored in media-core
 *  cache. Since there could be different versions of media-client (where FileState lives) at the same time
 *  using same cache we can't have any breaking changes. This includes adding new required fields or
 *  removing any required fields.
 *
 *  PLEASE! Thing twice if you need to change anything in this test. This has potential breaking production.
 */

describe('Cached Value Backward Compatibility', () => {
  const mediaTypes = ['image', 'audio', 'doc', 'video', 'unknown'];

  const filePreviews = [
    {
      value: 'some-value',
    },
    {
      value: new Blob([]),
    },
    {
      value: new Blob([]),
    },
    {
      value: new Blob([]),
      originalDimensions: {
        height: 42,
        width: 42,
      },
    },
  ];

  const representationss = [
    {},
    {
      image: { something: 'random' },
    },
  ];

  const mediaFileArtifactss: any[] = [
    {},
    {
      'video_1280.mp4': {
        url: 'some-url',
        processingStatus: 'pending',
      },
    },
    {
      'video_640.mp4': {
        url: 'some-url',
        processingStatus: 'succeeded',
      },
    },
    {
      'document.pdf': {
        url: 'some-url',
        processingStatus: 'failed',
      },
    },
    {
      'audio.mp3': {
        url: 'some-url',
        processingStatus: 'pending',
      },
    },
  ];

  const verifyMediaTypeProperty = (base: Object) => {
    mediaTypes.forEach(mediaType => {
      const fileState = {
        ...base,
        mediaType,
      };
      expect(fileState).toEqual({
        ...base,
        mediaType,
      });
    });
  };

  const verifyRepresentationsProperty = (base: Object) => {
    representationss.forEach(representations => {
      const fileState = {
        ...base,
        representations,
      };
      expect(fileState).toEqual({
        ...base,
        representations,
      });
    });
  };

  const verifyPreviewProperty = (base: Object) => {
    filePreviews.forEach(preview => {
      const fileState = {
        ...base,
        preview,
      };
      expect(fileState).toEqual({
        ...base,
        preview,
      });

      const fileState2 = {
        ...base,
        preview: Promise.resolve(preview),
      };

      expect(fileState2).toEqual({
        ...base,
        preview: expect.any(Promise),
      });
    });
  };

  const verifyArtifactsProperty = (base: Object) => {
    mediaFileArtifactss.forEach(artifacts => {
      const fileState = {
        ...base,
        artifacts,
      };
      expect(fileState).toEqual({
        ...base,
        artifacts,
      });
    });
  };

  describe('with UploadingFileState', () => {
    it('should not be broken', () => {
      const uploadingFileState = {
        status: 'uploading',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        progress: 0.5,
        mediaType: 'image',
        mimeType: 'some-mime-type',
      };

      const uploadFileStateWithOptionalFields = {
        ...uploadingFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
      };

      verifyMediaTypeProperty(uploadingFileState);
      verifyPreviewProperty(uploadFileStateWithOptionalFields);
    });
  });

  describe('with ProcessingFileState', () => {
    it('should not be broken', () => {
      const processingFileState = {
        status: 'processing',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
      };
      const processingFileStateWithOptionalFields = {
        ...processingFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
        artifacts: mediaFileArtifactss[0],
      };

      verifyMediaTypeProperty(processingFileState);
      verifyPreviewProperty(processingFileStateWithOptionalFields);
      verifyRepresentationsProperty(processingFileStateWithOptionalFields);
      verifyArtifactsProperty(processingFileStateWithOptionalFields);
    });
  });

  describe('with ProcessedFileState', () => {
    it('should not be broken', () => {
      const processedFileState = {
        status: 'processed',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
        artifacts: mediaFileArtifactss[0],
      };
      const processedFileStateWithOptionalFields = {
        ...processedFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
      };

      verifyMediaTypeProperty(processedFileState);
      verifyArtifactsProperty(processedFileState);
      verifyPreviewProperty(processedFileStateWithOptionalFields);
      verifyRepresentationsProperty(processedFileStateWithOptionalFields);
    });
  });

  describe('with ProcessingFailedState', () => {
    it('should not be broken', () => {
      const processingFailedState = {
        status: 'failed-processing',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
        artifacts: { someObject: true },
      };
      const processingFailedStateWithOptionalFields = {
        ...processingFailedState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
      };
      verifyMediaTypeProperty(processingFailedState);
      verifyPreviewProperty(processingFailedStateWithOptionalFields);
      verifyRepresentationsProperty(processingFailedStateWithOptionalFields);
    });
  });

  describe('with ErrorFileState', () => {
    it('should not be broken', () => {
      const errorFileState = {
        status: 'error',
        id: 'some-id',
      };
      const errorFileStateStateWithOptionalFields = {
        ...errorFileState,
        occurrenceKey: 'some-occurrence-key',
        message: 'some-message',
      };

      expect(errorFileState).toEqual({
        status: 'error',
        id: 'some-id',
      });

      expect(errorFileStateStateWithOptionalFields).toEqual({
        status: 'error',
        id: 'some-id',
        occurrenceKey: 'some-occurrence-key',
        message: 'some-message',
      });
    });
  });
});
