import { mockStore, mockFetcher } from '@atlaskit/media-test-helpers';
import { searchGiphy as createSearchGiphyAction } from '../../../actions';

import searchGiphy, { fetchGifs } from '../../searchGiphy';

describe('searchGiphy middleware', () => {
  describe('searchGiphy()', () => {
    it('should ignore actions which are NOT type SEARCH_GIPHY', () => {
      const fetcher = mockFetcher();
      const store = mockStore();
      const next = jest.fn();

      const unknownAction = { type: 'UNKNOWN' };
      searchGiphy(fetcher)(store)(next)(unknownAction);

      expect(fetcher.fetchTrendingGifs).toHaveBeenCalledTimes(0);
      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledTimes(0);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(unknownAction);
    });

    it('should call fetcher#fetchTrendingGifs when search query has length 0', () => {
      const fetcher = mockFetcher();
      fetcher.fetchTrendingGifs = jest.fn().mockReturnValue(Promise.resolve());

      const store = mockStore();
      const next = jest.fn();

      const action = createSearchGiphyAction('', false);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchTrendingGifs).toHaveBeenCalledTimes(1);
      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledTimes(0);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should call fetcher#fetchTrendingGifs with offset undefined when search query has length greater than 0 and shouldAppendResults is false', () => {
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const store = mockStore();
      const next = jest.fn();

      const action = createSearchGiphyAction('', false);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchTrendingGifs).toHaveBeenCalledWith(undefined);
    });

    it('should call fetcher#fetchTrendingGifs with offset set to the length of "imageResults + 1" when search query has length greater than 0 and shouldAppendResults is true', () => {
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const imageCardModels: any = [1, 2, 3, 4, 5];
      const store = mockStore({
        giphy: { imageCardModels, totalResultCount: 100 },
      });
      const next = jest.fn();

      const action = createSearchGiphyAction('', true);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchTrendingGifs).toHaveBeenCalledWith(6);
    });

    it('should call fetcher#fetchGifsRelevantToSearch when search query has length greater than 0', () => {
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const store = mockStore();
      const next = jest.fn();

      const action = createSearchGiphyAction('some query', false);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchTrendingGifs).toHaveBeenCalledTimes(0);
      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledTimes(1);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(action);
    });

    it('should call fetcher#fetchGifsRelevantToSearch with offset undefined when search query has length greater than 0 and shouldAppendResults is false', () => {
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const store = mockStore();
      const next = jest.fn();

      const action = createSearchGiphyAction('some query', false);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledTimes(1);
      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledWith(
        'some query',
        undefined,
      );
    });

    it('should call fetcher#fetchGifsRelevantToSearch with offset set to the length of "imageResults + 1" when search query has length greater than 0 and shouldAppendResults is true', () => {
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.resolve());

      const imageCardModels: any = [1, 2, 3, 4, 5];
      const store = mockStore({
        giphy: { imageCardModels, totalResultCount: 100 },
      });
      const next = jest.fn();

      const action = createSearchGiphyAction('some query', true);
      searchGiphy(fetcher)(store)(next)(action);

      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledTimes(1);
      expect(fetcher.fetchGifsRelevantToSearch).toHaveBeenCalledWith(
        'some query',
        6,
      );
    });
  });

  describe('fetchGifs()', () => {
    const fulfilledTestSetup = () => {
      const totalResultCount = 100;
      const shouldAppendResults = false;
      const cardModels = ['first', 'second', 'third'];
      const expectedFulfilledAction = {
        type: 'SEARCH_GIPHY_FULFILLED',
        shouldAppendResults,
        totalResultCount,
        imageCardModels: cardModels,
      };

      const fetcher = mockFetcher();
      const searchResult = Promise.resolve({
        cardModels,
        totalResultCount,
      });
      fetcher.fetchTrendingGifs = jest.fn().mockReturnValue(searchResult);
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(searchResult);

      return {
        fetcher,
        shouldAppendResults,
        cardModels,
        expectedFulfilledAction,
      };
    };

    it('should dispatch SEARCH_GIPHY_FULFILLED when search query has length 0 and fetcher#fetchTrendingGifs resolves successfully', async () => {
      const {
        fetcher,
        shouldAppendResults,
        expectedFulfilledAction,
      } = fulfilledTestSetup();

      const store = mockStore();

      await fetchGifs(fetcher, store, { query: '', shouldAppendResults });
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(expectedFulfilledAction);
    });

    it('should dispatch SEARCH_GIPHY_FAILED when search query has length greater than 0 and fetcher#fetchTrendingGifs rejects', async () => {
      const shouldAppendResults = false;
      const expectedFailedAction = {
        type: 'SEARCH_GIPHY_FAILED',
      };
      const fetcher = mockFetcher();
      fetcher.fetchTrendingGifs = jest
        .fn()
        .mockReturnValue(Promise.reject('some error'));
      const store = mockStore();

      await fetchGifs(fetcher, store, { query: '', shouldAppendResults });
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(expectedFailedAction);
    });

    it('should dispatch SEARCH_GIPHY_FULFILLED when search query has length greater than 0 and fetcher#fetchGifsRelevantToSearch resolves successfully', async () => {
      const {
        fetcher,
        shouldAppendResults,
        expectedFulfilledAction,
      } = fulfilledTestSetup();

      const store = mockStore();

      await fetchGifs(fetcher, store, {
        query: 'some query',
        shouldAppendResults,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(expectedFulfilledAction);
    });

    it('should dispatch SEARCH_GIPHY_FAILED when search query has length greater than 0 and fetcher#fetchGifsRelevantToSearch rejects', async () => {
      const shouldAppendResults = false;
      const expectedFailedAction = {
        type: 'SEARCH_GIPHY_FAILED',
      };
      const fetcher = mockFetcher();
      fetcher.fetchGifsRelevantToSearch = jest
        .fn()
        .mockReturnValue(Promise.reject('some error'));
      const store = mockStore();

      await fetchGifs(fetcher, store, {
        query: 'some query',
        shouldAppendResults,
      });
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toBeCalledWith(expectedFailedAction);
    });
  });
});
