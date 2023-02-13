import { JsonLd } from 'json-ld-types';
import { CardClient } from '@atlaskit/link-provider';
import { CardType } from '@atlaskit/linking-common';

import { ResolvedAttributesType } from './analytics.codegen';
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

export const getDisplayCategory = (status?: CardType): 'smartLink' | 'link' => {
  return status !== 'not_found' ? 'smartLink' : 'link';
};

export const getAnalyticsAttributes = (
  url: string,
  details?: JsonLd.Response,
  linkStatus?: CardType,
): ResolvedAttributesType => {
  const status = linkStatus || (details && getStatus(details));

  return {
    status: status ?? null,
    urlHash: getUrlHash(url) ?? '_unknown',
    displayCategory: getDisplayCategory(status),
    extensionKey: details?.meta?.key ?? null,
    destinationTenantId: details?.meta?.tenantId ?? null,
    destinationContainerId: details?.meta?.containerId ?? null,
    destinationCategory: details?.meta?.category ?? null,
    destinationProduct: details?.meta?.product ?? null,
    destinationSubproduct: details?.meta?.subproduct ?? null,
    destinationObjectId: details?.meta?.objectId ?? null,
    destinationObjectType: details?.meta?.resourceType ?? null,
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
