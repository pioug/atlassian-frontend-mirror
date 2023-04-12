import { CardClient } from '@atlaskit/link-provider';
import { CardState } from '@atlaskit/linking-common';

import { LinkDetails, CardStore } from '../types';
import { getUrlAttributes } from './get-url-attributes';
import { getResolvedAttributes } from './get-resolved-attributes';

const hasMessage = (err: unknown): err is { message: unknown } => {
  return !!(typeof err === 'object' && err && 'message' in err);
};

const hasType = (err: unknown): err is { type: unknown } => {
  return !!(typeof err === 'object' && err && 'type' in err);
};

const getLinkData = async (
  { url, displayCategory }: LinkDetails,
  client: CardClient,
  store: CardStore,
): Promise<[CardState['details']?, CardState['status']?]> => {
  const cachedDetails = store.getState()[url]?.details;

  /**
   * If `displayCategory` is not 'link' then we assume we are displaying
   * as a smart link, so we can fetch data if its not already available in the store
   */
  if (!cachedDetails && displayCategory !== 'link') {
    try {
      const data = await client.fetchData(url);
      return [data];
    } catch (err: unknown) {
      if (
        hasType(err) &&
        typeof err.type === 'string' &&
        err.type === 'ResolveUnsupportedError'
      ) {
        return [, 'not_found'];
      }
      if (
        hasMessage(err) &&
        typeof err.message === 'string' &&
        err.message.includes('Invalid URL')
      ) {
        return [, 'not_found'];
      }
      return [, 'errored'];
    }
  }

  return [cachedDetails];
};

/**
 * Resolves the attributes for a link using the link client and store
 */
export const resolveAttributes = async (
  linkDetails: LinkDetails,
  client: CardClient,
  store: CardStore,
) => {
  const [linkData, status] = await getLinkData(linkDetails, client, store);

  return {
    ...getUrlAttributes(linkDetails.url),
    ...getResolvedAttributes(linkDetails, linkData, status),
  };
};
