import {
  FileIdentifier,
  ExternalImageIdentifier,
} from '@atlaskit/media-client';
import { generateIdentifierKey } from '../../utils/generateIdentifierKey';

describe('generateIdentifierKey()', () => {
  it('should return a new key for new identifiers', () => {
    const firstKey = generateIdentifierKey({
      mediaItemType: 'file',
      id: 'id-1',
    });
    const secondKey = generateIdentifierKey({
      mediaItemType: 'file',
      id: 'id-2',
    });

    expect(firstKey).toEqual('id-1');
    expect(secondKey).toEqual('id-2');
  });

  it('should return the same for the same identifier', () => {
    const fileIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: 'id',
    };
    const firstKey = generateIdentifierKey(fileIdentifier);
    const secondKey = generateIdentifierKey(fileIdentifier);

    expect(firstKey).toEqual('id');
    expect(firstKey).toEqual(secondKey);
  });

  it('should work with external images', () => {
    const linkIdentifier: ExternalImageIdentifier = {
      mediaItemType: 'external-image',
      dataURI: 'some-external-img',
    };

    expect(generateIdentifierKey(linkIdentifier)).toEqual('some-external-img');
  });

  it('should work with promises', () => {
    const firstPromise = Promise.resolve('id');
    const firstDeferredIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: firstPromise,
    };
    const secondDeferredIdentifier: FileIdentifier = {
      mediaItemType: 'file',
      id: Promise.resolve('id'),
    };
    const firstKey = generateIdentifierKey(firstDeferredIdentifier);
    const secondKey = generateIdentifierKey(secondDeferredIdentifier);

    expect(firstKey).not.toEqual(secondKey);
    expect(
      generateIdentifierKey({ mediaItemType: 'file', id: firstPromise }),
    ).toEqual(firstKey);
  });
});
