import { getConfig } from '../config';
import { getSearchTransformer } from './transformer';
import { SearchContext, ProductType, ContainerOption } from '../types';

const getUrl = (baseUrl?: string) => getConfig().getSearchUrl(baseUrl);

const searchClient = (
  query: string,
  context: SearchContext,
  scope: string,
  maxRequestOptions: number,
): Promise<ContainerOption[]> =>
  fetch(getUrl(), {
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      query,
      cloudId: context.cloudId,
      limit: maxRequestOptions,
      scopes: [scope],
      filters: [],
      searchSession: {
        sessionId: context.sessionId,
      },
    }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return Promise.reject({
        message: `error calling container search service, statusCode=${response.status}, statusText=${response.statusText}, scope=${scope}`,
      });
    })
    .then(getSearchTransformer(scope));

const searchProjects = (
  query: string,
  context: SearchContext,
  maxRequestOptions: number,
) => {
  return searchClient(query, context, 'jira.project', maxRequestOptions);
};

const searchSpaces = (
  query: string,
  context: SearchContext,
  maxRequestOptions: number,
) => {
  return searchClient(query, context, 'confluence.space', maxRequestOptions);
};

const getSearchClient = (product: ProductType) =>
  product === 'confluence' ? searchSpaces : searchProjects;

export { getSearchClient };
