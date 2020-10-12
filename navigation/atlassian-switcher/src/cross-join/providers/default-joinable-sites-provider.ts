import {
  createProviderWithCustomFetchData,
  ExportedDataProvider,
} from '../../common/providers/create-data-provider';
import { JoinableSitesResponse } from '../../types';

export type JoinableSiteDataFetcher = () => Promise<JoinableSitesResponse>;

export const fetchEmptyData: JoinableSiteDataFetcher = () =>
  Promise.resolve({ sites: [] });

export const createJoinableSitesProvider = (
  fetchData: JoinableSiteDataFetcher = fetchEmptyData,
): ExportedDataProvider<JoinableSitesResponse> => {
  const wrappedFetchData = withTryCatch(fetchData, fetchEmptyData);
  return createProviderWithCustomFetchData<JoinableSitesResponse>(
    'joinableSites',
    wrappedFetchData,
  );
};

export const withTryCatch = (fn: Function, fallback: Function) => () => {
  try {
    return fn();
  } catch (e) {
    return fallback();
  }
};
