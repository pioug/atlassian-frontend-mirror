import { mapAccessibleProductsToAvailableSites } from '@atlaskit/linking-common/hooks';

import type { Site } from '../common/types';

export const getAvailableSites = async (product: 'jira' | 'confluence'): Promise<Site[]> => {
	const requestConfig = {
		method: 'POST',
		credentials: 'include' as RequestCredentials,
		headers: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			products:
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

	const response = await fetch(`/gateway/api/available-sites`, requestConfig);

	if (response.ok) {
		const res = await response.json();
		return res.sites;
	}

	throw new Error((await response.text()) || 'Something went wrong');
};

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

	const response = await fetch(`/gateway/api/v2/accessible-products`, requestConfig);

	if (response.ok) {
		const res = await response.json();
		return mapAccessibleProductsToAvailableSites(res);
	}

	throw new Error((await response.text()) || 'Something went wrong');
};
