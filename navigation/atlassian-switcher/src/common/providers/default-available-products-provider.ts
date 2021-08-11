import {
  createProviderWithCustomFetchData,
  ExportedDataProvider,
} from './create-data-provider';
import { AvailableProductsResponse } from '../../types';
import { fetchJson } from '../utils/fetch';

export const DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT =
  '/gateway/api/available-products/api/available-products';

export const defaultAvailableProductsFetch = (
  url: string = DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT,
) => async () => {
  try {
    /**
     * Currently if the /available-products call returns a 401 we'll default to
     * empty sites for nonAA users (querying experiment api). This is to cater
     * for these users in Trello - as they do not have an AAID. For AA users,
     * an error will be expectedly thrown.
     */
    const response = await fetchJson<AvailableProductsResponse>(url);
    return response;
  } catch (e) {
    const usingExperimentApi = url.indexOf('experiment-api') > -1;

    if (usingExperimentApi && e.status === 401) {
      const defaultUnauthorizedResponse = Promise.resolve({
        sites: [],
        isPartial: false,
      });
      return defaultUnauthorizedResponse;
    }
    throw e;
  }
};

export const createAvailableProductsProvider = (
  url: string = DEFAULT_AVAILABLE_PRODUCTS_ENDPOINT,
): ExportedDataProvider<AvailableProductsResponse> => {
  return createProviderWithCustomFetchData<AvailableProductsResponse>(
    'availableProducts',
    defaultAvailableProductsFetch(url),
  );
};
