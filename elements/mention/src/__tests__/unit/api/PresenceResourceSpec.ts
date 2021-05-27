import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';

import PresenceResource, {
  DefaultPresenceCache,
  DefaultPresenceParser,
  PresenceMap,
} from '../../../api/PresenceResource';
import {
  validPresenceData,
  invalidPresenceData,
} from '@atlaskit/util-data-test/presence-data';

// avoid polluting test logs with error message in console
// please ensure you fix it if you expect console.error to be thrown
// eslint-disable-next-line no-console
let consoleError = console.error;

const baseUrl = 'https://bogus/presence';
const dummyId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

const apiConfig = {
  url: baseUrl,
  cloudId: dummyId,
};

const testIds = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
const parser = new DefaultPresenceParser();

describe('PresenceParser', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });
  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });
  it('should parse presences into correct states', () => {
    const parsedPresences = parser.parse(validPresenceData);
    expect(parsedPresences['0'].status).toEqual('offline');
    expect(parsedPresences['1'].status).toEqual('online');
    expect(parsedPresences['5'].status).toEqual('busy');
    expect(parsedPresences['6'].status).toEqual('focus');
  });

  it('should parse presences despite invalid presence data', () => {
    const parsedPresences = parser.parse(invalidPresenceData);
    expect(Object.keys(parsedPresences)).toHaveLength(3);
  });

  it('should ignore presence stateMetadata if not valid JSON', () => {
    const parsedPresences = parser.parse(invalidPresenceData);
    expect(parsedPresences['42563'].status).toEqual('busy');
  });
});

describe('PresenceCache', () => {
  let cache: DefaultPresenceCache;
  let testPresenceMap: PresenceMap;
  let extraPresences: PresenceMap;

  beforeEach(() => {
    testPresenceMap = parser.parse(validPresenceData);
    extraPresences = {
      '13-thirteen-13': { status: 'available' },
      'Roger-rolo-the-steam-roller-Lo': { status: 'busy' },
    };
    // Setup presence resource and cache
    cache = new DefaultPresenceCache();
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
    fetchMock.restore();
  });

  it('should know whether it contains a user by ID', () => {
    cache.update(testPresenceMap);
    const userId = Object.keys(testPresenceMap)[0];
    expect(cache.contains(userId)).toBe(true);
  });

  it('should not contain IDs that not have been manually added to the cache', () => {
    cache.update(testPresenceMap);
    expect(cache.contains('DEFINITELY-N0T-A-TEST-US3R-1D')).toBe(false);
  });

  it('should retrieve a user given their ID', () => {
    cache.update(testPresenceMap);
    const userId = Object.keys(testPresenceMap)[0];
    const expectedPresence = testPresenceMap[userId];
    expect(cache.get(userId)).toEqual(expectedPresence);
  });

  it('should return no presence if queried for users not present in the cache', () => {
    cache.update(testPresenceMap);
    expect(cache.get('DEFINITELY-N0T-A-TEST-US3R-1D')).toEqual({});
  });

  it('should retrieve a set of users given an array of their IDs', () => {
    cache.update(testPresenceMap);
    const userIds = Object.keys(testPresenceMap);
    const actual = cache.getBulk(userIds);
    expect(actual).toEqual(testPresenceMap);
  });

  it('should update its entries when given a PresenceMap', () => {
    cache.update(testPresenceMap);
    cache.update(extraPresences);
    const combinedPresences = {
      ...testPresenceMap,
      ...extraPresences,
    };
    expect(cache.getBulk(Object.keys(combinedPresences))).toEqual(
      combinedPresences,
    );
  });

  it('should retrieve a set of missing users given an array of their IDs', () => {
    const extraIds: string[] = [
      '13-thirteen-13',
      'Roger-rolo-the-steam-roller-Lo',
    ];
    cache.update(testPresenceMap);
    expect(cache.getMissingUserIds(testIds.concat(extraIds))).toEqual(
      testIds.slice(7, 9).concat(extraIds),
    );
  });

  it('should insert and store user ids on demand', () => {
    // Check cache only adds entries when hit by presence service
    expect(cache.contains(testIds[0])).toBe(false);
    cache.update(testPresenceMap);
    let cacheHits = testIds.filter((id) => cache.contains(id));
    expect(cacheHits).toHaveLength(7);
  });

  it('should store correctly parsed responses from presence service', () => {
    cache.update(testPresenceMap);
    // Check cache stores correct mapping
    for (let userId in testPresenceMap) {
      expect(cache.get(userId).status).toEqual(testPresenceMap[userId].status);
    }
  });

  it('should delete the entry if the user presence it gets has expired', () => {
    const expiredCache = new DefaultPresenceCache(-1);
    expiredCache.update(testPresenceMap);
    expiredCache.get(testIds[0]);
    expect(expiredCache.contains(testIds[0])).toBe(false);
  });

  it('should remove all expired users if the cache hits its trigger point', () => {
    const limitedCache = new DefaultPresenceCache(-1, 5);
    limitedCache.update(testPresenceMap);
    limitedCache.update(extraPresences);
    validPresenceData.data.PresenceBulk.forEach((response) => {
      expect(limitedCache.contains(response.userId)).toBe(false);
    });
  });
});

describe('PresenceResource', () => {
  const mockName: string = 'query';
  beforeEach(() => {
    const matcher = {
      name: `${mockName}`,
      matcher: `begin:${baseUrl}`,
    };

    fetchMock.mock({
      ...matcher,
      response: {
        body: validPresenceData,
      },
    });
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
    fetchMock.restore();
  });

  describe('#refreshPresence', () => {
    it('should result in fewer listener callbacks and service requests with cache', (done) => {
      const resource = new PresenceResource(apiConfig);
      try {
        // notifyListeners called twice as no cache hits so must call again after service query
        resource.refreshPresence(testIds);
        let calls = fetchMock.calls(mockName);
        expect(calls).toHaveLength(1);
        window.setTimeout(() => {
          resource.refreshPresence(testIds.slice(0, 6));
        }, 5);
        calls = fetchMock.calls(mockName);
        expect(calls).toHaveLength(1);
        done();
      } catch (err) {
        done(err);
      }
    });

    it('should result in one callback after injecting a cache and only hitting existing ids', (done) => {
      try {
        // Setup parser and cache with data
        const populatedCache = new DefaultPresenceCache();
        const update = parser.parse(validPresenceData);
        populatedCache.update(update);

        // Initialise resource with cache
        const resource = new PresenceResource({
          ...apiConfig,
          cache: populatedCache,
        });
        resource.refreshPresence(testIds.slice(0, 6));
        const calls = fetchMock.calls(mockName);
        // One call since only needs to render info from cache
        expect(calls).toHaveLength(0);
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});
