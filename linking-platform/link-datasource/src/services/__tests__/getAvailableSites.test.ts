import fetchMock from 'fetch-mock/cjs/client';

import { mockProductsData, mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { __clearUnitsRolloutSettingsCacheForTests } from '@atlaskit/linking-common/units-rollout-test-utils';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getAccessibleProducts } from '../getAvailableSites';

const ACCESSIBLE_PRODUCTS_PATH = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/v2/accessible-products';
const AGG_PATH = '/gateway/api/graphql';
const MASTER_GATE = 'cc-units-ga';
const ROLLOUT_GATE = 'linking_platform_link_datasource_unit_compliant';
const FALLBACK_SITE_URL = mockProductsData[0].workspaces[0].cloudUrl;
const productsWithoutDisplayName = [
	{
		...mockProductsData[0],
		workspaces: [
			{
				...mockProductsData[0].workspaces[0],
				workspaceDisplayName: undefined,
			},
		],
	},
];

const mockGates = ({ masterGate = true, rolloutGate = false } = {}) => {
	(masterGate ? passGate : failGate)(MASTER_GATE);

	if (!masterGate) {
		// The killswitch short-circuits, so the rollout gate is never evaluated.
		return;
	}

	(rolloutGate ? passGate : failGate)(ROLLOUT_GATE);
};

const ORG_ID = 'a4b5c6d7-0000-1111-2222-333344445555';
const TENANT_CONTEXT_OPERATION = 'link_datasource_tenantContext';
const UNITS_ROLLOUT_SETTINGS_OPERATION = 'link_datasource_unitSettings';

const parseBody = (body: RequestInit['body']): Record<string, any> =>
	typeof body === 'string' ? JSON.parse(body) : {};

/**
 * The org id is not known by the browser, so reading the settings takes two AGG operations: the
 * tenant context lookup that resolves the org id, then the settings themselves.
 */
const mockUnitsRolloutSettings = (
	settings: { boundaryEnforced?: boolean | null; endUsersLaunched?: boolean | null } | null,
	{ orgId = ORG_ID }: { orgId?: string | null } = {},
) => {
	fetchMock.post(AGG_PATH, (_url: string, { body }: RequestInit) =>
		parseBody(body).operationName === TENANT_CONTEXT_OPERATION
			? { data: { tenantContexts: orgId ? [{ orgId }] : [] } }
			: { data: { admin_unitSettings: settings } },
	);
};

const getRequestUrls = (): string[] => fetchMock.calls().map(([url]: [string, RequestInit]) => url);

const getAggRequests = (): Record<string, any>[] =>
	fetchMock
		.calls()
		.filter(([url]: [string, RequestInit]) => url === AGG_PATH)
		.map(([, requestInit]: [string, RequestInit]) => parseBody(requestInit?.body));

describe('getAvailableSites', () => {
	beforeEach(() => {
		fetchMock.restore();
		__clearUnitsRolloutSettingsCacheForTests();
	});

	it.each([
		['current', false, ACCESSIBLE_PRODUCTS_PATH],
		['unit-compliant', true, ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH],
	])(
		'uses the site URL fallback with the %s endpoint',
		async (_, isUnitCompliant, expectedEndpoint) => {
			mockGates({ rolloutGate: isUnitCompliant });
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			passGate('platform_lp_sllv_display_name_fallback');
			fetchMock.post(expectedEndpoint, { data: { products: productsWithoutDisplayName } });

			const sites = await getAccessibleProducts('jira');

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(expectedEndpoint);
			expect(sites[0]).toEqual(
				expect.objectContaining({
					displayName: FALLBACK_SITE_URL,
					url: FALLBACK_SITE_URL,
				}),
			);
		},
	);

	describe('when the rollout gate is OFF', () => {
		beforeEach(() => {
			mockGates();
		});

		it('returns jira sites', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });

			const jiraSites = await getAccessibleProducts('jira');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(requestInit?.body).toEqual(
				'{"productIds":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
			);
			expect(jiraSites).toEqual(mockSiteData);
		});

		it('should return an array of confluence sites using the v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });

			await getAccessibleProducts('confluence');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(requestInit?.body).toEqual('{"productIds":["confluence.ondemand"]}');
		});

		it('should not query the units rollout settings', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });

			await getAccessibleProducts('jira');

			expect(getRequestUrls()).toEqual([ACCESSIBLE_PRODUCTS_PATH]);
		});

		it('should throw with the error message if response is not ok', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { body: 'penguins jumping high', status: 500 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('penguins jumping high'),
			);
		});

		it('should throw a generic message if response body is empty', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { body: '', status: 401 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('Something went wrong'),
			);
		});
	});

	describe('when the rollout gate is ON and the org has launched units with boundary enforcement', () => {
		beforeEach(() => {
			mockGates({ rolloutGate: true });
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
		});

		it('returns jira sites', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			const jiraSites = await getAccessibleProducts('jira');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
			expect(requestInit?.body).toEqual(
				'{"productIds":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
			);
			expect(jiraSites).toEqual(mockSiteData);
		});

		it('should return an array of confluence sites using the experimental v2 endpoint', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			await getAccessibleProducts('confluence');

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
			expect(requestInit?.body).toEqual('{"productIds":["confluence.ondemand"]}');
		});

		it('should only query the units rollout settings once across calls', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			await getAccessibleProducts('jira');
			await getAccessibleProducts('confluence');

			expect(getAggRequests().map(({ operationName }) => operationName)).toEqual([
				TENANT_CONTEXT_OPERATION,
				UNITS_ROLLOUT_SETTINGS_OPERATION,
			]);
		});

		it('should read the settings for the org id of the current host', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});

			await getAccessibleProducts('jira');

			const [tenantContextRequest, settingsRequest] = getAggRequests();
			expect(tenantContextRequest.variables).toEqual({
				hostNames: [window.location.hostname],
			});
			expect(settingsRequest.variables).toEqual({ orgId: ORG_ID });
			expect(settingsRequest.query).toContain('admin_unitSettings(orgId: $orgId)');
		});

		it('should throw with the error message if response is not ok', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				body: 'penguins jumping high',
				status: 500,
			});

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('penguins jumping high'),
			);
		});

		it('should throw a generic message if response body is empty', async () => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, { body: '', status: 401 });

			await expect(getAccessibleProducts('jira')).rejects.toEqual(
				new Error('Something went wrong'),
			);
		});
	});

	describe('units rollout settings', () => {
		beforeEach(() => {
			fetchMock.post(ACCESSIBLE_PRODUCTS_PATH, { data: { products: mockProductsData } });
			fetchMock.post(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH, {
				data: { products: mockProductsData },
			});
		});

		it('uses the current endpoint when the cc-units-ga killswitch is off', async () => {
			mockGates({ masterGate: false, rolloutGate: true });
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await getAccessibleProducts('jira');

			expect(getRequestUrls()).toEqual([ACCESSIBLE_PRODUCTS_PATH]);
		});

		it.each([
			['the boundary is not enforced', { boundaryEnforced: false, endUsersLaunched: true }],
			['end users are not launched', { boundaryEnforced: true, endUsersLaunched: false }],
			['the settings are unset', { boundaryEnforced: null, endUsersLaunched: null }],
			['there are no settings for the org', null],
		])('uses the current endpoint when %s', async (_, settings) => {
			mockGates({ rolloutGate: true });
			mockUnitsRolloutSettings(settings);

			await getAccessibleProducts('jira');

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		});

		it('uses the current endpoint when the settings cannot be fetched', async () => {
			mockGates({ rolloutGate: true });
			fetchMock.post(AGG_PATH, { body: 'something went wrong', status: 500 });

			await getAccessibleProducts('jira');

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		});

		it('uses the current endpoint when AGG answers with errors', async () => {
			mockGates({ rolloutGate: true });
			fetchMock.post(AGG_PATH, {
				data: { admin_unitSettings: null },
				errors: [{ message: 'Cannot read the unit settings of this organisation' }],
			});

			await getAccessibleProducts('jira');

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		});

		it('uses the current endpoint when the org id cannot be resolved for the host', async () => {
			mockGates({ rolloutGate: true });
			mockUnitsRolloutSettings(
				{ boundaryEnforced: true, endUsersLaunched: true },
				{
					orgId: null,
				},
			);

			await getAccessibleProducts('jira');

			expect(getAggRequests().map(({ operationName }) => operationName)).toEqual([
				TENANT_CONTEXT_OPERATION,
			]);
			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		});
	});
});
