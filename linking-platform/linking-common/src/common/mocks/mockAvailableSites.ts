// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';
import { mockedAvailableSitesResult } from './available-sites-result';

export const mockAvailableSites = () => {
  const fetchAvailableSiteEndpoint = /\/gateway\/api\/available-sites/;

  fetchMock.post(fetchAvailableSiteEndpoint, mockedAvailableSitesResult, {
    delay: 10,
  });
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
