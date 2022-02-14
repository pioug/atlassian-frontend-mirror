import * as globalScopeModule from '../../globalScope';
import { getSSRData } from '../../getSSRData';
import { getKey } from '../../globalScope';

const getMediaCardSSR = jest.spyOn(globalScopeModule, 'getMediaCardSSR');

const identifier = {
  id: 'some-id',
  collection: 'some-collection',
  occurrenceKey: 'some-occurence',
  mediaItemType: 'file',
} as const;

describe('getSSRData', () => {
  it('should return undefined if data is not found in global scope', () => {
    getMediaCardSSR.mockImplementationOnce(() => ({}));
    expect(getSSRData(identifier)).toBeUndefined();
  });

  it('should return the data from global scope using the proper key', () => {
    const ssrData = {
      dataURI: 'some-data-uri',
      dimensions: { width: 200, height: 300 },
    };
    getMediaCardSSR.mockImplementationOnce(() => ({
      [getKey(identifier)]: ssrData,
    }));

    expect(getSSRData(identifier)).toBe(ssrData);
  });
});
