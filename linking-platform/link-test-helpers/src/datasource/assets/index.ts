import fetchMock from 'fetch-mock/cjs/client';

fetchMock.config.fallbackToNetwork = true;

export const mockAssetsClientFetchRequests = () => {
  const workspaceId = '123';
  fetchMock.get(
    '/rest/servicedesk/cmdb/latest/workspace',
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeout(() => {
          resolve({
            results: [
              {
                id: workspaceId,
              },
            ],
          });
        }, delay);
      });
    },
    { overwriteRoutes: false },
  );

  fetchMock.get(
    `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?maxResults=100`,
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeout(() => {
          resolve({
            values: [
              {
                id: '2',
                name: 'objSchema2',
              },
            ],
          });
        }, delay);
      });
    },
    { overwriteRoutes: false },
  );
};
