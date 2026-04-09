import { mapAccessibleProductsToAvailableSites } from '@atlaskit/linking-common/hooks';
import { fg } from '@atlaskit/platform-feature-flags';

import type { Site } from '../common/types';

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

	const endpoint = fg('linking_platform_link_datasource_unit_compliant')
		? '/gateway/api/experimental/v2/accessible-products'
		: '/gateway/api/v2/accessible-products';

	const response = await fetch(endpoint, requestConfig);

	if (response.ok) {
		const res = await response.json();
		return mapAccessibleProductsToAvailableSites(res.data);
	}

	throw new Error((await response.text()) || 'Something went wrong');
};
