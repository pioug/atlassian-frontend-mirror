import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import { CardType } from '@atlaskit/linking-common';

import { LinkAnalyticsAttributes } from './types';
import { getUrlHash } from './utils';

// Be aware, this is a copy of a function in link-provider/src/helpers
export const getStatus = ({ meta }: JsonLd.Response): CardType => {
  const { access, visibility } = meta;
  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return 'not_found';
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};

export const getDisplayCategory = (status?: CardType): string => {
  return status !== 'not_found' ? 'smartLink' : 'link';
};

export const getAnalyticsAttributes = (
  url: string,
  details?: JsonLd.Response,
  linkStatus?: CardType,
): LinkAnalyticsAttributes => {
  const status = linkStatus || (details && getStatus(details));

  return {
    status: status,
    urlHash: getUrlHash(url),
    displayCategory: getDisplayCategory(status),
    extensionKey: details?.meta?.key,
    destinationTenantId: details?.meta?.tenantId,
    destinationContainerId: details?.meta?.containerId,
    destinationCategory: details?.meta.category,
    destinationProduct: details?.meta?.product,
    destinationSubproduct: details?.meta?.subproduct,
    destinationObjectId: details?.meta?.objectId,
    destinationObjectType: details?.meta?.resourceType,
  };
};

export const resolveAttributes = async (url: string, client: CardClient) => {
  try {
    const response = await client.fetchData(url);
    return getAnalyticsAttributes(url, response);
  } catch {
    return {};
  }
};
