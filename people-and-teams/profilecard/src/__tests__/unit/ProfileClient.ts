import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';
// @ts-ignore
import * as sinon from 'sinon';

import ProfileClient from '../../client/ProfileCardClient';
import { modifyResponse } from '../../client/UserProfileCardClient';
import { ApiClientResponse } from '../../types';

const clientUrl = 'https://foo/';
const clientCacheSize = 10;
const clientCacheMaxAge = 500;

describe('Profilecard', () => {
  describe('UserProfileCardClient', () => {
    it('config.url is available when set on instantiation', () => {
      const client = new ProfileClient({
        url: clientUrl,
      }).userClient;

      expect(client.options.url).toEqual(clientUrl);
      expect(client.cache).toEqual(null);
    });

    it('cache is available when cacheMaxAge is set on instantiation', () => {
      const client = new ProfileClient({
        url: clientUrl,
        cacheSize: clientCacheSize,
        cacheMaxAge: clientCacheMaxAge,
      }).userClient;

      expect(client.options.url).toEqual(clientUrl);
      expect(client.cache).not.toEqual(null);
      expect(client.cache!.limit).toEqual(clientCacheSize);
      expect(client.config.cacheMaxAge).toEqual(clientCacheMaxAge);
    });

    it('should cap the cache at 30 days, even if you set a longer one', () => {
      const client = new ProfileClient({
        url: clientUrl,
        cacheSize: clientCacheSize,
        // 40 days
        cacheMaxAge: 40 * 24 * 60 * 60 * 1000,
      }).userClient;

      expect(client.config.cacheMaxAge).toEqual(30 * 24 * 60 * 60 * 1000);
    });

    describe('LRU Cache', () => {
      const client = new ProfileClient({
        url: clientUrl,
        cacheSize: clientCacheSize,
        cacheMaxAge: clientCacheMaxAge,
      }).userClient;

      let cache: any;
      let clock: any;

      beforeEach(() => {
        clock = sinon.useFakeTimers();

        fetchMock.mock({
          options: {
            method: 'GET',
          },
          matcher: `begin:${clientUrl}`,
          response: { data: 'foo' },
        });
      });

      afterEach(() => {
        clock.restore();
        fetchMock.restore();
      });

      describe('#getCachedProfile', () => {
        it('should return cached data within n milliseconds', async () => {
          expect.assertions(1);
          const data = await client.getProfile('DUMMY-CLOUD-ID', '1');
          clock.tick(clientCacheMaxAge);
          cache = await client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(data);
        });

        it('should return `null` after n+1 milliseconds ', async () => {
          expect.assertions(1);
          await client.getProfile('DUMMY-CLOUD-ID', '1');

          clock.tick(clientCacheMaxAge + 1);
          cache = await client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(null);
        });

        it('should reset expiry to n ms when cache item is used', async () => {
          expect.assertions(2);
          const data = await client.getProfile('DUMMY-CLOUD-ID', '1');
          clock.tick(clientCacheMaxAge);
          cache = client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(data);

          clock.tick(clientCacheMaxAge);
          cache = client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(data);
        });
      });

      describe('#flushCache', () => {
        it('should purge all cached items', async () => {
          expect.assertions(2);
          const data = await client.getProfile('DUMMY-CLOUD-ID', '1');
          cache = await client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(data);

          client.flushCache();
          cache = await client.getCachedProfile('DUMMY-CLOUD-ID/1');

          expect(cache).toEqual(null);
        });
      });
    });

    describe('#modifyResponse', () => {
      it('should remove certain properties from the data object', () => {
        const data = {
          User: {
            remoteWeekdayIndex: 'shouldberemoved',
            remoteWeekdayString: 'shouldberemoved',
            remoteTimeString: 'shouldberemoved',
            id: 'shouldberemoved',
          },
        };

        const result = modifyResponse(data as ApiClientResponse);

        // @ts-ignore
        expect(result.remoteWeekdayIndex).toEqual(undefined);
        // @ts-ignore
        expect(result.remoteWeekdayString).toEqual(undefined);
        // @ts-ignore
        expect(result.remoteTimeString).toEqual(undefined);
        // @ts-ignore
        expect(result.id).toEqual(undefined);
      });

      it('should rename "remoteTimeString" property to "timestring"', () => {
        const data = {
          User: {
            remoteTimeString: '10:23am',
          },
        };

        const result = modifyResponse(data as ApiClientResponse);

        expect(result.timestring).toEqual('10:23am');
      });

      it('should not modify "timestring" property if remote and local date share the same weekday index', () => {
        const data = {
          User: {
            remoteTimeString: '0:00pm',
            remoteWeekdayString: 'Mon',
            remoteWeekdayIndex: new Date().getDay().toString(),
          },
        };

        const result = modifyResponse(data as ApiClientResponse);

        expect(result.timestring).toEqual('0:00pm');
      });

      it('should prefix "timestring" property with weekday if local dates weekday index is different', () => {
        const data = {
          User: {
            remoteTimeString: '0:00pm',
            remoteWeekdayString: 'Mon',
            remoteWeekdayIndex: '12',
          },
        };

        const result = modifyResponse(data as ApiClientResponse);

        expect(result.timestring).toEqual('Mon 0:00pm');
      });
    });
  });
});
