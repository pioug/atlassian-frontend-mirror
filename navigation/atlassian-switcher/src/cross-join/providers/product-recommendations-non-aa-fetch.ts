import { JoinableSitesResponse, ProductKey } from '../../types';
import { fetchJson } from '../../common/utils/fetch';

const joinSupportedProducts: ProductKey[] = [
  ProductKey.JIRA_SOFTWARE,
  ProductKey.JIRA_SERVICE_DESK,
  ProductKey.JIRA_CORE,
  ProductKey.CONFLUENCE,
];

export const fetchJoinableSitesRecommended = (
  products: ProductKey[],
  baseUrl: string = '',
): Promise<JoinableSitesResponse> => {
  return fetchJson<JoinableSitesResponse>(
    `${baseUrl}/trello-cross-product-recommended/recommended-sites`,
    {
      method: 'post',
      body: JSON.stringify({ products }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const productRecommendationsNonAAFetchData = (baseUrl: string) => () =>
  fetchJoinableSitesRecommended(joinSupportedProducts, baseUrl);
