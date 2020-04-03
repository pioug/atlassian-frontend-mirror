import { extendMetadata } from '../../metadata';
import { FileState, FileDetails } from '@atlaskit/media-client';

describe('metadata utils', () => {
  describe('extendMetadata()', () => {
    it('should not extend when its error state', () => {
      const state: FileState = {
        id: '1',
        status: 'error',
      };
      const existingMetadata: FileDetails = {
        id: '123',
      };

      expect(extendMetadata(state)).toEqual({
        id: '1',
      });
      expect(extendMetadata(state, existingMetadata)).toEqual({
        id: '1',
      });
    });

    it('should extend metadata with file state', () => {
      const state: FileState = {
        id: '1',
        status: 'processing',
        name: 'file-name',
        size: 10,
        mediaType: 'unknown',
        mimeType: 'foo/bar',
        representations: {},
      };
      const existingMetadata: FileDetails = {
        id: '123',
        mediaType: 'image',
      };

      expect(extendMetadata(state)).toEqual({
        id: '1',
        name: 'file-name',
        size: 10,
        mediaType: 'unknown',
        mimeType: 'foo/bar',
      });
      expect(extendMetadata(state, existingMetadata)).toEqual({
        id: '1',
        name: 'file-name',
        size: 10,
        mediaType: 'image',
        mimeType: 'foo/bar',
      });
    });
  });
});
