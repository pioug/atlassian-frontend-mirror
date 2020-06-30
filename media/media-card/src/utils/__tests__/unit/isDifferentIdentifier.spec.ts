import {
  FileIdentifier,
  ExternalImageIdentifier,
  isDifferentIdentifier,
} from '@atlaskit/media-client';

describe('isDifferentIdentifier()', () => {
  describe('file identifier', () => {
    it('should work with string id', () => {
      const a: FileIdentifier = {
        id: '1',
        mediaItemType: 'file',
      };
      const b: FileIdentifier = {
        id: '2',
        mediaItemType: 'file',
      };

      expect(isDifferentIdentifier(a, b)).toBeTruthy();
    });
  });

  describe('non file identifier', () => {
    it('should work with external images', () => {
      const a: ExternalImageIdentifier = {
        dataURI: 'some-preview-1',
        mediaItemType: 'external-image',
      };
      const b: ExternalImageIdentifier = {
        dataURI: 'some-preview-2',
        mediaItemType: 'external-image',
      };

      expect(isDifferentIdentifier(a, b)).toBeTruthy();
    });
  });
});
