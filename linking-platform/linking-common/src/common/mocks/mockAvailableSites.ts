// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';
import {
  mockedAvailableSitesResult,
  mockedAvailableSitesResultWithGatewayBaseUrl,
} from './available-sites-result';

export const mockAvailableSites = () => {
  const fetchAvailableSiteEndpoint = /\/gateway\/api\/available-sites/;

  fetchMock.post(fetchAvailableSiteEndpoint, mockedAvailableSitesResult, {
    delay: 10,
  });
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
    },
  );
};

export const mockAvailableSitesWithError = () => {
  const fetchAvailableSiteEndpoint = /\/gateway\/api\/available-sites/;

  fetchMock.post(fetchAvailableSiteEndpoint, 503, {
    delay: 10,
  });
};

export const mockRestore = () => {
  fetchMock.restore();
};
