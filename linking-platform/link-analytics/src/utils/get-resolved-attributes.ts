import { type JsonLd } from '@atlaskit/json-ld-types';

import { type CardType, getStatus, type CardState } from '@atlaskit/linking-common';
import { type JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';

import { type ResolvedAttributesType } from '../common/utils/analytics/analytics.types';
import { getDisplayCategory } from './get-display-category';
import { type LinkDetails } from '../types';
import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Returns a set of analytics attributes that be
 * derived from a JSON.LD response
 */
export const getResolvedAttributes = (
	linkDetails: LinkDetails,
	details?: JsonLd.Response,
	linkStatus?: CardType,
	error?: CardState['error'],
): ResolvedAttributesType => {
	const status = linkStatus ?? (details && getStatus(details));
	const displayCategory =
		linkDetails.displayCategory === 'link' ? 'link' : getDisplayCategory(status);

	return {
		status: status ?? null,
		statusDetails: details?.meta?.requestAccess?.accessType ?? null,
		displayCategory,
		extensionKey: fg('platform_bandicoots-smartlink-unresolved-error-key')
			? (details?.meta?.key ?? error?.extensionKey ?? null)
			: (details?.meta?.key ?? null),
		destinationTenantId: details?.meta?.tenantId ?? null,
		destinationActivationId: details?.meta?.activationId ?? null,
		destinationContainerId: details?.meta?.containerId ?? null,
		destinationCategory: details?.meta?.category ?? null,
		destinationProduct: details?.meta?.product ?? null,
		destinationSubproduct: details?.meta?.subproduct ?? null,
		destinationObjectId: details?.meta?.objectId ?? null,
		destinationObjectType: details?.meta?.resourceType ?? null,
		canBeDatasource: ((details as JsonLdDatasourceResponse)?.datasources || []).length > 0,
	};
};
