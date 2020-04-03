import fetchMock from 'fetch-mock';
import { Service } from '../../../../domain';
import {
  MediaApiFetcher,
  flattenAccounts,
  GiphyResponse,
  GiphyImage,
} from '../../fetcher';

describe('Fetcher', () => {
  afterEach(fetchMock.restore);

  describe('flattenAccounts()', () => {
    const services: Service[] = [
      {
        type: 'dropbox',
        status: 'available',
        accounts: [
          {
            id: 'dropbox|111111111',
            status: 'available',
            displayName: 'user@atlassian.com',
          },
        ],
      },
      {
        type: 'google',
        status: 'available',
        accounts: [],
      },
    ];

    it('flattens the response data into a list of accounts', () => {
      const flattened = flattenAccounts(services);
      expect(flattened).toEqual([
        {
          id: 'dropbox|111111111',
          status: 'available',
          displayName: 'user@atlassian.com',
          type: 'dropbox',
        },
      ]);
    });
  });

  describe('GIPHY methods', () => {
    const gifId = 'some-gif-id';
    const gifSlug = `file-slug-${gifId}`;
    const gifUrl = 'some-gif-url';
    const gifFileSizeStr = '1234567';
    const gifFileSizeNum = 1234567;
    const gifWidth = '200';
    const gifHeight = '363';

    const originalGifUrl = 'some-original-gif-url';

    const images = {
      fixed_width: {
        url: gifUrl,
        size: gifFileSizeStr,
        width: gifWidth,
        height: gifHeight,
      } as GiphyImage,
      original: {
        url: originalGifUrl,
      } as GiphyImage,
    };

    const response: GiphyResponse = {
      data: [{ id: gifId, slug: gifSlug, images }],
      pagination: {
        total_count: 100,
        count: 25,
        offset: 0,
      },
    };

    describe('fetchTrendingGifs()', () => {
      it('should pass rating=pg as a query parameter', () => {
        const offset = 0;
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        fetcher.fetchTrendingGifs(offset);

        expect(fetchMock.lastUrl()).toContain('rating=pg');
      });

      it('should append passed in offset to the query string when it is greater than 0', () => {
        const offset = 25;
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        fetcher.fetchTrendingGifs(offset);
        expect(fetchMock.lastUrl()).toContain(`offset=${offset}`);
      });

      it('should map the GiphyResponse into GiphyCardModels', async () => {
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        const result = await fetcher.fetchTrendingGifs();
        expect(result).toEqual({
          totalResultCount: 100,
          cardModels: [
            {
              metadata: {
                id: gifId,
                name: 'file-slug',
                mediaType: 'image',
                size: gifFileSizeNum,
              },
              dataURI: gifUrl,
              dimensions: {
                width: 200,
                height: 363,
              },
            },
          ],
        });
      });
    });

    describe('fetchGifsRelevantToSearch()', () => {
      it('should pass rating=pg as a query parameter', () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        fetcher.fetchGifsRelevantToSearch(queryString);

        expect(fetchMock.lastUrl()).toContain('rating=pg');
      });

      it('should append passed in query string to the queried url', () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        fetcher.fetchGifsRelevantToSearch(queryString);
        expect(fetchMock.lastUrl()).toContain(`q=${queryString}`);
      });

      it('should append passed in offset to the query string when it is greater than 0', () => {
        const queryString = 'some-gif-search';
        const offset = 25;
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);
        fetcher.fetchGifsRelevantToSearch(queryString, offset);
        expect(fetchMock.lastUrl()).toContain(`offset=${offset}`);
      });

      it('should map the GiphyResponse into GiphyCardModels', async () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();
        fetchMock.get('*', response);

        const result = await fetcher.fetchGifsRelevantToSearch(queryString);
        expect(result).toEqual({
          totalResultCount: 100,
          cardModels: [
            {
              metadata: {
                id: gifId,
                name: 'file-slug',
                mediaType: 'image',
                size: gifFileSizeNum,
              },
              dataURI: gifUrl,
              dimensions: {
                width: 200,
                height: 363,
              },
            },
          ],
        });
      });
    });
  });
});
