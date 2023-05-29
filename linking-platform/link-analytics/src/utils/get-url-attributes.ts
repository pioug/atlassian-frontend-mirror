import { getUrlHash } from './get-url-hash';

/**
 * Returns a set of analytics attributes that can be determined by the URL alone
 */
export const getUrlAttributes = (url: string) => {
  return {
    urlHash: getUrlHash(url) ?? 'unknown',
  };
};
