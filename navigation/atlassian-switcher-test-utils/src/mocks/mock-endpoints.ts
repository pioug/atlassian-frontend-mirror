import fetchMock from 'fetch-mock/cjs/client';
import ORIGINAL_MOCK_DATA, { MockData } from './mock-data';
import memoizeOne from 'memoize-one';

export interface DataTransformer {
  (originalMockData: MockData): MockData;
}

interface LoadTimes {
  containers?: number;
  xflow?: number;
  permitted?: number;
  appswitcher?: number;
  availableProducts?: number;
  joinableSites?: number;
}

export const REQUEST_SLOW = {
  containers: 2000,
  xflow: 1200,
  permitted: 500,
  appswitcher: 1500,
  availableProducts: 1000,
  joinableSites: 7000,
};

export const REQUEST_MEDIUM = {
  containers: 1000,
  xflow: 600,
  permitted: 250,
  appswitcher: 750,
  availableProducts: 400,
  joinableSites: 2000,
};

export const REQUEST_FAST = {
  containers: 500,
  xflow: 300,
  permitted: 125,
  appswitcher: 375,
  availableProducts: 200,
  joinableSites: 500,
};

export const getMockData = memoizeOne((transformer?: DataTransformer) => {
  return transformer ? transformer(ORIGINAL_MOCK_DATA) : ORIGINAL_MOCK_DATA;
});

export const availableProductsUrlRegex = /\/gateway\/api\/available\-products\/api\/available\-products/;

export const joinableSitesUrlRegex = /\/gateway\/api\/trello\-cross\-product\-join\/recommended\-sites/;

export const mockEndpoints = (
  product: string,
  transformer?: DataTransformer,
  loadTimes: LoadTimes = {},
) => {
  const mockData = getMockData(transformer);

  const {
    CUSTOM_LINKS_DATA,
    CUSTOM_LINKS_DATA_ERROR,
    USER_PERMISSION_DATA,
    XFLOW_SETTINGS,
    COLLABORATION_GRAPH_CONTAINERS,
  } = mockData;

  mockAvailableProductsEndpoint(
    availableProductsUrlRegex,
    transformer,
    loadTimes,
  );

  mockJoinableSitesEndpoint(joinableSitesUrlRegex, transformer, loadTimes);

  fetchMock.get(
    `${product === 'confluence' ? '/wiki' : ''}/rest/menu/latest/appswitcher`,
    () =>
      new Promise((res, rej) =>
        setTimeout(
          () =>
            CUSTOM_LINKS_DATA_ERROR
              ? rej(CUSTOM_LINKS_DATA_ERROR)
              : res(CUSTOM_LINKS_DATA),
          loadTimes && loadTimes.appswitcher,
        ),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
  fetchMock.post(
    '/gateway/api/permissions/permitted',
    (_: string, options: { body: string }) =>
      new Promise((res) =>
        setTimeout(
          () =>
            res(
              USER_PERMISSION_DATA[
                JSON.parse(options.body).permissionId as
                  | 'manage'
                  | 'add-products'
              ],
            ),
          loadTimes && loadTimes.permitted,
        ),
      ),
    { method: 'POST', overwriteRoutes: true },
  );
  fetchMock.get(
    '/gateway/api/site/some-cloud-id/setting/xflow',
    () =>
      new Promise((res) =>
        setTimeout(() => res(XFLOW_SETTINGS), loadTimes && loadTimes.xflow),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
  fetchMock.post(
    '/gateway/api/collaboration/v1/collaborationgraph/user/container',
    () =>
      new Promise((res) =>
        setTimeout(
          () => res(COLLABORATION_GRAPH_CONTAINERS),
          loadTimes && loadTimes.containers,
        ),
      ),
    { method: 'POST', overwriteRoutes: true },
  );
};

export const mockAvailableProductsEndpoint = (
  endpoint: string | RegExp,
  transformer?: DataTransformer,
  loadTimes: LoadTimes = {},
) => {
  const mockData = getMockData(transformer);

  const { AVAILABLE_PRODUCTS_DATA, AVAILABLE_PRODUCTS_DATA_ERROR } = mockData;
  fetchMock.get(
    endpoint,
    () =>
      new Promise((res, rej) =>
        setTimeout(
          () =>
            AVAILABLE_PRODUCTS_DATA_ERROR
              ? rej(AVAILABLE_PRODUCTS_DATA_ERROR)
              : res(AVAILABLE_PRODUCTS_DATA),
          loadTimes && loadTimes.availableProducts,
        ),
      ),
    { method: 'GET', overwriteRoutes: true },
  );
};

export const mockJoinableSitesEndpoint = (
  endpoint: string | RegExp,
  transformer?: DataTransformer,
  loadTimes: LoadTimes = {},
) => {
  const mockData = getMockData(transformer);
  const { JOINABLE_SITES_DATA } = mockData;
  fetchMock.post(
    endpoint,
    () =>
      new Promise((res) =>
        setTimeout(
          () => res(JOINABLE_SITES_DATA),
          loadTimes && loadTimes.joinableSites,
        ),
      ),
    { method: 'POST', overwriteRoutes: true },
  );
};
