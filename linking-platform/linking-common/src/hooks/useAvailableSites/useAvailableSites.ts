import { useState, useEffect } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/utils/constants';
import { getOperationFailedAttributes } from './getOperationFailedAttributes';
import {
	AVAILABLE_SITES_PATH,
	AVAILABLE_SITES_UNIT_COMPLIANT_PATH,
	defaultProducts,
} from './index';
import {
	type AvailableSite,
	type AvailableSitesRequest,
	type AvailableSitesResponse,
} from './types';

async function getAvailableSites({
	products,
	gatewayBaseUrl,
}: AvailableSitesRequest): Promise<AvailableSitesResponse> {
	const availableSitesPath = fg('linking_platform_site_picker_api_unit_compliant')
		? AVAILABLE_SITES_UNIT_COMPLIANT_PATH
		: AVAILABLE_SITES_PATH;
	const requestConfig = {
		method: 'POST',
		credentials: 'include' as RequestCredentials,
		headers: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			products,
		}),
	};

	const response = await window.fetch(
		gatewayBaseUrl ? `${gatewayBaseUrl}${availableSitesPath}` : availableSitesPath,
		requestConfig,
	);
	if (response.ok) {
		return response.json();
	}
	throw response;
}

export const useAvailableSites = ({
	gatewayBaseUrl,
}: {
	gatewayBaseUrl?: string;
} = {}): {
	data: AvailableSite[];
	error?: Error;
	loading: boolean;
} => {
	const [state, setState] = useState<{
		data: AvailableSite[];
		error?: Error;
		loading: boolean;
	}>({
		data: [],
		loading: true,
	});
	const { createAnalyticsEvent } = useAnalyticsEvents();

	useEffect(() => {
		const fetchSites = async () => {
			try {
				const { sites } = await getAvailableSites({
					products: defaultProducts,
					gatewayBaseUrl,
				});
				setState({
					data: sites,
					loading: false,
					error: undefined,
				});
			} catch (err: unknown) {
				createAnalyticsEvent(
					createEventPayload(
						'operational.getAvailableSitesResolve.failed',
						getOperationFailedAttributes(err),
					),
				).fire(ANALYTICS_CHANNEL);

				const error = err instanceof Error ? err : new Error('unknown error');
				setState({
					data: [],
					loading: false,
					error,
				});
			}
		};

		fetchSites();
	}, [createAnalyticsEvent, gatewayBaseUrl]);

	return state;
};
