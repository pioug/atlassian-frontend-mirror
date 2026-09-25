import { useState, useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { shouldUseUnitCompliantApi } from '../../units-rollout/shouldUseUnitCompliantApi';
import { useIsMounted } from '../useIsMounted';
import {
	ACCESSIBLE_PRODUCTS_PATH,
	ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH,
	defaultProducts,
} from './index';
import { mapAccessibleProductsToAvailableSites } from './mapAccessibleProductsToAvailableSites';
import {
	type AccessibleProductResponse,
	type AvailableSite,
	type AvailableSitesRequest,
} from './types';

async function getAccessibleProducts({
	products,
	gatewayBaseUrl,
}: AvailableSitesRequest): Promise<AccessibleProductResponse> {
	// Organisations with units isolation in effect must be served the unit compliant endpoint,
	// which filters the products down to the unit the user belongs to. The gate is passed as a
	// callback so it is only evaluated - and only records exposure - once the units GA killswitch
	// has already let the check through.
	const isUnitCompliant = await shouldUseUnitCompliantApi(() =>
		fg('linking_platform_site_picker_api_unit_compliant'),
	);
	const accessibleProductsPath = isUnitCompliant
		? ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH
		: ACCESSIBLE_PRODUCTS_PATH;
	const requestConfig = {
		method: 'POST',
		credentials: 'include' as RequestCredentials,
		headers: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			productIds: products,
			permissionIds: [],
		}),
	};

	const response = await window.fetch(
		gatewayBaseUrl ? `${gatewayBaseUrl}${accessibleProductsPath}` : accessibleProductsPath,
		requestConfig,
	);
	if (response.ok) {
		return response.json();
	}
	throw response;
}

export const useAvailableSitesV2 = ({
	gatewayBaseUrl,
}: {
	gatewayBaseUrl?: string;
}): {
	data: AvailableSite[];
	error?: unknown;
	loading: boolean;
} => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const isMounted = useIsMounted();
	const [state, setState] = useState<{
		data: AvailableSite[];
		error?: unknown;
		loading: boolean;
	}>({
		data: [],
		loading: true,
	});

	useEffect(() => {
		const fetchSites = async () => {
			try {
				const response = await getAccessibleProducts({
					products: defaultProducts,
					gatewayBaseUrl,
				});

				if (isMounted()) {
					setState({
						data: mapAccessibleProductsToAvailableSites(response.data),
						loading: false,
						error: undefined,
					});
				}
			} catch (error: unknown) {
				if (isMounted()) {
					setState({
						data: [],
						loading: false,
						error,
					});
				}
			}
		};

		fetchSites();
	}, [createAnalyticsEvent, gatewayBaseUrl, isMounted]);

	return state;
};
