import fetchMock from 'fetch-mock/cjs/client';

fetchMock.config.fallbackToNetwork = true;

interface FetchMockRequestDetails {
  body: string;
  credentials: string;
  headers: object;
  method: string;
}

type AqlValidateRequest = {
  qlQuery: string;
  context: string;
};

const objectSchemaListResponse = {
  values: [
    {
      id: '1',
      name: 'objSchema1',
    },
    {
      id: '2',
      name: 'objSchema2',
    },
    {
      id: '3',
      name: 'objSchema3',
    },
    {
      id: '4',
      name: 'objSchema4',
    },
    {
      id: '5',
      name: 'Demo',
    },
    {
      id: '6',
      name: 'Test',
    },
  ],
};

const delay = 150;

export const mockAssetsClientFetchRequests = () => {
  const workspaceId = '123';
  fetchMock.get('/rest/servicedesk/cmdb/latest/workspace', async () => {
    return new Promise(resolve => {
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
  });

  fetchMock.get(
    `begin:/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list`,
    async (url: string) => {
      const urlParams = new URLSearchParams(url);
      const query = urlParams.get('query');
      return new Promise(resolve => {
        setTimeout(() => {
          if (query) {
            const filteredValues = objectSchemaListResponse.values.filter(
              objectSchema =>
                objectSchema.name.toLowerCase().includes(query.toLowerCase()),
            );
            resolve({ values: filteredValues });
          }
          resolve(objectSchemaListResponse);
        }, delay);
      });
    },
  );

  fetchMock.get(
    new RegExp(
      `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/\\d+`,
    ),
    async (url: string) => {
      const id = url.split('/').pop();
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const objectSchema = objectSchemaListResponse.values.find(
            objectSchema => objectSchema.id === id,
          );
          if (objectSchema) {
            resolve(objectSchema);
          } else {
            reject();
          }
        }, delay);
      });
    },
  );

  fetchMock.post(
    `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`,
    async (_: string, request: FetchMockRequestDetails) => {
      const requestJson = JSON.parse(request.body) as AqlValidateRequest;
      return new Promise(resolve => {
        setTimeout(() => {
          const isValid = requestJson.qlQuery.includes('invalid')
            ? false
            : true;
          resolve({
            isValid,
          });
        }, delay);
      });
    },
  );
};

export const forceCmdbBaseUrl = (baseUrl: string) => {
  fetchMock.mock(/^\//, ((url, init) =>
    fetch(`${baseUrl}${url}`, init)) as typeof fetch);
};
