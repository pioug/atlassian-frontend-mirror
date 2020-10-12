import { JoinableSitesResponse, ProductKey } from '../../types';
import { fetchJson } from '../../common/utils/fetch';

const joinSupportedProducts: ProductKey[] = [
  ProductKey.JIRA_SOFTWARE,
  ProductKey.JIRA_SERVICE_DESK,
  ProductKey.JIRA_CORE,
  ProductKey.CONFLUENCE,
];

export const fetchJoinableSites = (
  products: ProductKey[],
  baseUrl: string = '',
): Promise<JoinableSitesResponse> => {
  return fetchJson<JoinableSitesResponse>(
    `${baseUrl}/trello-cross-product-join/recommended-sites`,
    {
      method: 'post',
      body: JSON.stringify({ products }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const defaultFetchData = (baseUrl: string) => () =>
  fetchJoinableSites(joinSupportedProducts, baseUrl);
