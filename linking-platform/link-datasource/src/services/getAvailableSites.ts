import { mapAccessibleProductsToAvailableSites } from '@atlaskit/linking-common/map-accessible-products-to-available-sites';
import { shouldUseUnitCompliantApi } from '@atlaskit/linking-common/units-rollout';

import type { Site } from '../common/types';

import { isLinkDatasourceInUnitsRollout } from './isLinkDatasourceInUnitsRollout';

export const getAccessibleProducts = async (product: 'jira' | 'confluence'): Promise<Site[]> => {
	const requestConfig = {
		method: 'POST',
		credentials: 'include' as RequestCredentials,
		headers: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			productIds:
				product === 'confluence'
					? ['confluence.ondemand']
					: [
							'jira-software.ondemand',
							'jira-core.ondemand',
							'jira-incident-manager.ondemand',
							'jira-product-discovery',
							'jira-servicedesk.ondemand',
						],
		}),
	};

	// Organisations with units isolation in effect must be served the unit compliant endpoint,
	// which filters the products down to the unit the user belongs to.
	const endpoint = (await shouldUseUnitCompliantApi(isLinkDatasourceInUnitsRollout))
		? '/gateway/api/experimental/v2/accessible-products'
		: '/gateway/api/v2/accessible-products';

	const response = await fetch(endpoint, requestConfig);

	if (response.ok) {
		const res = await response.json();
		return mapAccessibleProductsToAvailableSites(res.data);
	}

	throw new Error((await response.text()) || 'Something went wrong');
};
