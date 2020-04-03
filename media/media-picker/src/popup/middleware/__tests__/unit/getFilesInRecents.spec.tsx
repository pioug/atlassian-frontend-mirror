import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import {
  mockStore,
  mockFetcher,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
  saveCollectionItemsSubscription,
} from '../../../actions';

import { getFilesInRecents, requestRecentFiles } from '../../getFilesInRecents';
import { of } from 'rxjs/observable/of';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MediaCollectionItem } from '@atlaskit/media-client';

describe('getFilesInRecents middleware', () => {
  describe('getFilesInRecents()', () => {
    it('should ignore actions which are NOT type GET_FILES_IN_RECENTS', () => {
      const fetcher = mockFetcher();
      const store = mockStore();
      const next = jest.fn();

      const unknownAction = { type: 'UNKNOWN' };
      getFilesInRecents()(store)(next)(unknownAction);

      expect(fetcher.getRecentFiles).toHaveBeenCalledTimes(0);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(unknownAction);
    });
  });

  describe('requestRecentFiles()', () => {
    it('should dispatch GET_FILES_IN_RECENTS_FAILED when collection.getItems rejects', async () => {
      const userMediaClient = fakeMediaClient();
      const subject = new ReplaySubject<MediaCollectionItem[]>(1);
      subject.error('');

      const getItems = jest.spyOn(userMediaClient.collection, 'getItems');
      getItems.mockReturnValue(subject);

      const store = mockStore({
        userMediaClient,
      });

      await requestRecentFiles(store);

      expect(getItems).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(getFilesInRecentsFailed());
    });

    it('should dispatch GET_FILES_IN_RECENTS_SUCCESS when requests succeed', async () => {
      const getItems = jest.fn().mockReturnValue(of([]));
      const store = mockStore({
        userMediaClient: {
          collection: {
            getItems,
          },
        },
      } as any);

      await requestRecentFiles(store);

      expect(getItems).toHaveBeenCalledTimes(1);
      expect(getItems).toBeCalledWith(RECENTS_COLLECTION);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(
        getFilesInRecentsFullfilled([]),
      );
    });

    it('should clear previous subscription', async () => {
      const collectionItemsSubscription = { unsubscribe: jest.fn() };
      const getItems = jest.fn().mockReturnValue(of([]));
      const store = mockStore({
        userMediaClient: {
          collection: {
            getItems,
          },
        },
        collectionItemsSubscription,
      } as any);

      await requestRecentFiles(store);

      expect(collectionItemsSubscription.unsubscribe).toHaveBeenCalledTimes(1);
      expect(store.dispatch.mock.calls[1][0]).toEqual(
        saveCollectionItemsSubscription(expect.anything()),
      );
    });
  });
});
