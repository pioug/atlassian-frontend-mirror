import { useState, useEffect } from 'react';

import {
	type AvailableSite,
	AvailableSitesProductType,
	type AvailableSitesRequest,
	type AvailableSitesResponse,
} from './types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/utils/constants';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { useIsMounted } from '../useIsMounted';

import { getOperationFailedAttributes } from './utils';

const defaultProducts = [
	AvailableSitesProductType.WHITEBOARD,
	AvailableSitesProductType.BEACON,
	AvailableSitesProductType.COMPASS,
	AvailableSitesProductType.CONFLUENCE,
	AvailableSitesProductType.JIRA_BUSINESS,
	AvailableSitesProductType.JIRA_INCIDENT_MANAGER,
	AvailableSitesProductType.JIRA_PRODUCT_DISCOVERY,
	AvailableSitesProductType.JIRA_SERVICE_DESK,
	AvailableSitesProductType.JIRA_SOFTWARE,
	AvailableSitesProductType.MERCURY,
	AvailableSitesProductType.OPSGENIE,
	AvailableSitesProductType.STATUS_PAGE,
	AvailableSitesProductType.ATLAS,
	AvailableSitesProductType.LOOM,
];

export const useAvailableSites = ({
	gatewayBaseUrl,
}: {
	gatewayBaseUrl?: string;
} = {}) => {
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

export const useAvailableSitesV2 = ({ gatewayBaseUrl }: { gatewayBaseUrl?: string }) => {
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
				const { sites } = await getAvailableSites({
					products: defaultProducts,
					gatewayBaseUrl,
				});

				if (isMounted()) {
					setState({
						data: sites,
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

async function getAvailableSites({
	products,
	gatewayBaseUrl,
}: AvailableSitesRequest): Promise<AvailableSitesResponse> {
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
		gatewayBaseUrl
			? `${gatewayBaseUrl}/gateway/api/available-sites`
			: '/gateway/api/available-sites',
		requestConfig,
	);
	if (response.ok) {
		return response.json();
	}
	throw response;
}
