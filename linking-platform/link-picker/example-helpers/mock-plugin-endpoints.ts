import fetchMock from 'fetch-mock/cjs/client';

import mockPluginData from './mock-plugin-data';

const OBJECT_RESOLVER_SERVICE_ENDPOINT = 'glob:*/gateway/api/object-resolver/*';
const PROVIDERS = 'providers';

export const mockPluginEndpoints = () => {
  const { MOCKED_DATA, MOCKED_PROVIDERS } = mockPluginData;

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
};
