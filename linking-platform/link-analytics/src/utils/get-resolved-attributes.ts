import { JsonLd } from 'json-ld-types';

import { CardType } from '@atlaskit/linking-common';

import { ResolvedAttributesType } from '../analytics.codegen';
import { getDisplayCategory } from './get-display-category';
import { getStatus } from './get-status';
import { LinkDetails } from '../types';

/**
 * Returns a set of analytics attributes that be
 * derived from a JSON.LD response
 */
export const getResolvedAttributes = (
  linkDetails: LinkDetails,
  details?: JsonLd.Response,
  linkStatus?: CardType,
): ResolvedAttributesType => {
  const status = linkStatus ?? (details && getStatus(details));
  const displayCategory =
    linkDetails.displayCategory === 'link'
      ? 'link'
      : getDisplayCategory(status);

  return {
    status: status ?? null,
    displayCategory,
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
