import { getIdentifierCollection } from '../../../../utils/getIdentifierCollection';
import {
  ExternalImageIdentifier,
  FileIdentifier,
} from '@atlaskit/media-client';

describe('getIdentifierCollection', () => {
  const defaultCollection = 'default-collection-name';

  it('should use identifier collection if its present', () => {
    const identifier: FileIdentifier = {
      mediaItemType: 'file',
      id: '1',
      collectionName: 'some-collection',
    };

    expect(getIdentifierCollection(identifier, defaultCollection)).toEqual(
      'some-collection',
    );
  });

  it('should default to given collection name if identifier.collection name is not defined', () => {
    const identifier: FileIdentifier = {
      mediaItemType: 'file',
      id: '1',
    };

    expect(getIdentifierCollection(identifier, defaultCollection)).toEqual(
      defaultCollection,
    );
  });

  it('should return undefined for external images', () => {
    const identifier: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-external-src',
    };

    expect(
      getIdentifierCollection(identifier, defaultCollection),
    ).toBeUndefined();
  });
});
