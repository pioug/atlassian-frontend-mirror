import { useState, useEffect } from 'react';

import {
	type AccessibleProduct,
	type AccessibleProductResponse,
	type AvailableSite,
	AvailableSitesProductType,
	type AvailableSitesRequest,
	type AvailableSitesResponse,
} from './types';
import createEventPayload from '../../common/utils/analytics/analytics.codegen';
import { ANALYTICS_CHANNEL } from '../../common/utils/constants';
import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { useIsMounted } from '../useIsMounted';

import { getOperationFailedAttributes } from './utils';

const AVAILABLE_SITES_PATH = '/gateway/api/available-sites';
const AVAILABLE_SITES_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/available-sites';
const ACCESSIBLE_PRODUCTS_PATH = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH =
	'/gateway/api/experimental/v2/accessible-products';

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

export const mapAccessibleProductsToAvailableSites = (data: AccessibleProduct): AvailableSite[] => {
	const sites: AvailableSite[] = [];

	data.products.forEach((product) => {
		product.workspaces.forEach((workspace) => {
			const currentSite = sites.find((site) => site.cloudId === workspace.cloudId);
			if (currentSite) {
				currentSite.products.push(product.productId);
				return currentSite;
			}
			sites.push({
				avatarUrl: workspace.workspaceAvatarUrl,
				cloudId: workspace.cloudId,
				displayName: workspace.workspaceDisplayName,
				isVertigo: workspace.vortexMode === 'ENABLED',
				products: [product.productId],
				url: workspace.cloudUrl,
			});
		});
	});
	return sites;
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

async function getAccessibleProducts({
	products,
	gatewayBaseUrl,
}: AvailableSitesRequest): Promise<AccessibleProductResponse> {
	const accessibleProductsPath = fg('linking_platform_site_picker_api_unit_compliant')
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
