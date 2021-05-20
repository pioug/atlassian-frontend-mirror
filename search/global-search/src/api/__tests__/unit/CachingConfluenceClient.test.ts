import fetchMock from 'fetch-mock/cjs/client';
import CachingConfluenceClient from '../../CachingConfluenceClient';
import {
  ConfluenceClient,
  RecentPage,
  RecentSpace,
} from '../../ConfluenceClient';
import {
  AnalyticsType,
  ConfluenceRecentsMap,
  ContainerResult,
  ContentType,
  ResultType,
} from '../../../model/Result';
import {
  buildMockPage,
  DUMMY_CONFLUENCE_HOST,
  mockRecentlyViewedPages,
  MOCK_SPACE,
  mockRecentlyViewedSpaces,
} from '../../../__tests__/unit/helpers/_confluence-client-mocks';

describe('CachingConfluenceClient', () => {
  let confluenceClient: ConfluenceClient;

  const pages: RecentPage[] = [
    buildMockPage('page'),
    buildMockPage('blogpost'),
  ];

  const spaces: RecentSpace[] = [MOCK_SPACE, MOCK_SPACE];

  const prefetchedResults: ConfluenceRecentsMap = {
    objects: {
      items: pages.map((page) => ({
        resultId: page.id + '',
        name: page.title || '',
        href: `${DUMMY_CONFLUENCE_HOST}${page.url}`,
        containerName: page.space,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.ConfluenceObjectResult as ResultType.ConfluenceObjectResult,
        contentType: `confluence-${page.contentType}` as ContentType,
        containerId: page.spaceKey,
        iconClass: page.iconClass,
        isRecentResult: true,
        friendlyLastModified: undefined, // not available for recent results
      })),
      totalSize: pages.length,
    },
    spaces: {
      items: spaces.map((space) => ({
        resultId: space.id,
        name: space.name,
        href: `${DUMMY_CONFLUENCE_HOST}/spaces/${space.key}/overview`,
        avatarUrl: space.icon,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.GenericContainerResult,
        contentType: ContentType.ConfluenceSpace,
      })),
      totalSize: spaces.length,
    },
    people: {
      items: [],
      totalSize: 0,
    },
  };

  beforeEach(() => {
    confluenceClient = new CachingConfluenceClient(DUMMY_CONFLUENCE_HOST);
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getRecentItems', () => {
    const expectedResults = [
      {
        resultId: pages[0].id + '',
        name: pages[0].title,
        href: `${DUMMY_CONFLUENCE_HOST}${pages[0].url}`,
        containerName: pages[0].space,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.ConfluenceObjectResult,
        contentType: ContentType.ConfluencePage,
        containerId: pages[0].spaceKey,
        iconClass: pages[0].iconClass,
        isRecentResult: true,
      },
      {
        resultId: pages[1].id + '',
        name: pages[1].title,
        href: `${DUMMY_CONFLUENCE_HOST}${pages[1].url}`,
        containerName: pages[1].space,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.ConfluenceObjectResult,
        contentType: ContentType.ConfluenceBlogpost,
        containerId: pages[1].spaceKey,
        iconClass: pages[1].iconClass,
        isRecentResult: true,
      },
    ];

    it('should return the pre fetched results if present', async () => {
      confluenceClient = new CachingConfluenceClient(
        DUMMY_CONFLUENCE_HOST,
        Promise.resolve(prefetchedResults),
      );

      expect(fetchMock.called()).toBeFalsy();
      const result = await confluenceClient.getRecentItems();
      expect(result).toEqual(expectedResults);
    });

    it('should do an actual search if the pre-fetching isnt available', async () => {
      mockRecentlyViewedPages(pages);

      const result = await confluenceClient.getRecentItems();
      expect(fetchMock.called()).toBeTruthy();
      expect(result).toEqual(expectedResults);
    });
  });

  describe('getRecentSpaces', () => {
    const expectedResults: ContainerResult[] = [
      {
        resultId: MOCK_SPACE.id,
        name: MOCK_SPACE.name,
        href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
        avatarUrl: MOCK_SPACE.icon,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.GenericContainerResult,
        contentType: ContentType.ConfluenceSpace,
      },
      {
        resultId: MOCK_SPACE.id,
        name: MOCK_SPACE.name,
        href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
        avatarUrl: MOCK_SPACE.icon,
        analyticsType: AnalyticsType.RecentConfluence,
        resultType: ResultType.GenericContainerResult,
        contentType: ContentType.ConfluenceSpace,
      },
    ];

    it('should return the pre fetched results if present', async () => {
      confluenceClient = new CachingConfluenceClient(
        DUMMY_CONFLUENCE_HOST,
        Promise.resolve(prefetchedResults),
      );

      expect(fetchMock.called()).toBeFalsy();
      const result = await confluenceClient.getRecentSpaces();
      expect(result).toEqual(expectedResults);
    });

    it('should do an actual search if the pre-fetching isnt available', async () => {
      mockRecentlyViewedSpaces(spaces);

      const result = await confluenceClient.getRecentSpaces();
      expect(fetchMock.called()).toBeTruthy();
      expect(result).toEqual(expectedResults);
    });
  });
});
