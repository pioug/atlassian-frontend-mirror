import fetchMock from 'fetch-mock/cjs/client';
import {
  ConfluenceContentType,
  RecentPage,
  RecentSpace,
} from '../../../api/ConfluenceClient';
import uuid from 'uuid/v4';

export const DUMMY_CONFLUENCE_HOST = 'http://localhost';
export const DUMMY_CLOUD_ID = '123';
export const PAGE_CLASSNAME = 'content-type-page';
export const BLOG_CLASSNAME = 'content-type-blogpost';
export const SPACE_CLASSNAME = 'content-type-space';
export const PEOPLE_CLASSNAME = 'content-type-userinfo';

export function buildMockPage(
  type: ConfluenceContentType,
  overrides: Partial<RecentPage> = {},
): RecentPage {
  const defaultPage = {
    available: true,
    contentType: type,
    id: Math.floor(Math.random() * 1000),
    lastSeen: Math.floor(Math.random() * 1000),
    space: 'Search & Smarts ' + uuid(),
    spaceKey: 'abc ' + uuid(),
    title: 'Page title ' + uuid(),
    type: 'page ' + uuid(),
    url: '/content/123 ' + uuid(),
    iconClass: 'iconClass' + uuid(),
  };

  return { ...defaultPage, ...overrides };
}

export const MOCK_SPACE = {
  id: '123',
  key: 'S&S',
  icon: 'icon',
  name: 'Search & Smarts',
};

export const MOCK_QUICKNAV_RESULT_BASE = {
  href: '/href',
  name: 'name',
  id: '123',
  icon: 'icon',
};

export function mockRecentlyViewedPages(pages: RecentPage[]) {
  fetchMock.get('begin:http://localhost/rest/recentlyviewed/1.0/recent', pages);
}

export function mockRecentlyViewedSpaces(spaces: RecentSpace[]) {
  fetchMock.get(
    'begin:http://localhost/rest/recentlyviewed/1.0/recent/spaces',
    spaces,
  );
}
