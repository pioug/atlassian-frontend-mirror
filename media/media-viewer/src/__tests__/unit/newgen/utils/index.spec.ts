import { Identifier } from '@atlaskit/media-client';
import { getSelectedIndex } from '../../../../newgen/utils';

describe('utils', () => {
  describe('getSelectedIndex', () => {
    it('should return the right index if item is found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, identifier)).toEqual(0);
    });

    it('should return -1 if item is not found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const notFoundIdentifier: Identifier = {
        id: 'some-id-not-found',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, notFoundIdentifier)).toEqual(-1);
    });

    it('should work with external image identifiers', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        dataURI: 'some-src-1',
        mediaItemType: 'external-image',
      };
      const identifier3: Identifier = {
        dataURI: 'some-src-2',
        mediaItemType: 'external-image',
      };

      const items = [identifier, identifier3, identifier2];
      expect(getSelectedIndex(items, identifier3)).toEqual(1);
    });
  });
});
