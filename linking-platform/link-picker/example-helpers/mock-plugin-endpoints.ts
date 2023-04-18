import fetchMock from 'fetch-mock/cjs/client';

import mockPluginData from './mock-plugin-data';

const XP_SEARCH_ENDPOINT = /\/gateway\/api\/xpsearch-aggregator/;
const OBJECT_RESOLVER_SERVICE_ENDPOINT = /\/gateway\/api\/object-resolver/;
const PROVIDERS = 'providers';

export const mockPluginEndpoints = () => {
  const { MOCKED_DATA, MOCKED_PROVIDERS, MOCKED_SEARCH } = mockPluginData;

  fetchMock.post(
    OBJECT_RESOLVER_SERVICE_ENDPOINT,
    (_req: string, options: { body: string }) => {
      if (_req.includes(PROVIDERS)) {
        return MOCKED_PROVIDERS;
      }
      return MOCKED_DATA;
    },
    { method: 'POST', overwriteRoutes: true, delay: 200 },
  );

  fetchMock.post(
    XP_SEARCH_ENDPOINT,
    () => {
      return MOCKED_SEARCH;
    },
    { method: 'POST', overwriteRoutes: true, delay: 200 },
  );
};
