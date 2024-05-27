// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';
import {
  mockedAvailableSitesResult,
  mockedAvailableSitesResultWithGatewayBaseUrl,
} from './available-sites-result';

const fetchAvailableSiteEndpoint = /\/gateway\/api\/available-sites/;

export const mockAvailableSites = (responseData?: any) => {
  fetchMock.post(
    fetchAvailableSiteEndpoint,
    responseData || mockedAvailableSitesResult,
    {
      delay: 10,
      overwriteRoutes: true,
    },
  );
};

export const resetMockAvailableSites = () => {
  fetchMock.reset(fetchAvailableSiteEndpoint);
};

/**
 * Mock availableSites for a specific gatewayBaseUrl. Only matches requests with the gatewayBaseUrl in the url.
 * @param gatewayBaseUrl Base url without trailing slash
 */
export const mockAvailableSitesForGatewayUrl = (gatewayBaseUrl: string) => {
  fetchMock.post(
    `${gatewayBaseUrl}/gateway/api/available-sites`,
    mockedAvailableSitesResultWithGatewayBaseUrl,
    {
      delay: 10,
      overwriteRoutes: true,
    },
  );
};

export const mockAvailableSitesWithError = () => {
  fetchMock.post(fetchAvailableSiteEndpoint, 503, {
    delay: 10,
    overwriteRoutes: true,
  });
};

export const mockRestore = () => {
  fetchMock.restore();
};
