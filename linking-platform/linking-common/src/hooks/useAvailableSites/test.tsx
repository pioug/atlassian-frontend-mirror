import React from 'react';

import { renderHook, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';

import '@atlaskit/link-test-helpers/jest';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { icon } from '../../common/mocks/icons';
import { mockAccessibleProducts } from '../../common/mocks/mock-accessible-products';
import { mockAccessibleProductsWithError } from '../../common/mocks/mock-accessible-products-with-error';
import { mockAvailableSites } from '../../common/mocks/mock-available-sites';
import { mockAvailableSitesWithError } from '../../common/mocks/mock-available-sites-with-error';
import { __clearUnitsRolloutSettingsCacheForTests } from '../../units-rollout/clearCacheForTests';
import { shouldUseUnitCompliantApi } from '../../units-rollout/shouldUseUnitCompliantApi';
import { getOperationFailedAttributes } from './getOperationFailedAttributes';
import { mapAccessibleProductsToAvailableSites } from './mapAccessibleProductsToAvailableSites';
import { AvailableSitesProductType, type AccessibleProduct, type AvailableSite } from './types';
import { useAvailableSites } from './useAvailableSites';
import { useAvailableSitesV2 } from './useAvailableSitesV2';

const AVAILABLE_SITES_PATH = '/gateway/api/available-sites';
const AVAILABLE_SITES_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/available-sites';
const ACCESSIBLE_PRODUCTS_PATH = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/v2/accessible-products';
const FALLBACK_SITE_URL = 'https://site-without-display-name.atlassian.net';
const AGG_PATH = '/gateway/api/graphql';
const AGG_MATCHER = /\/gateway\/api\/graphql/;
const ORG_ID = 'test-org-id';

/** Units GA master gate - acts as the killswitch for the whole isolation behaviour. */
const MASTER_GATE = 'cc-units-ga';
const ROLLOUT_GATE = 'linking_platform_site_picker_api_unit_compliant';
const ORG_ID_FALLBACK_GATE = 'linking_platform_units_org_id_fallback';

const TENANT_CONTEXT_OPERATION = 'link_datasource_tenantContext';

const parseBody = (body: RequestInit['body']): Record<string, any> =>
	typeof body === 'string' ? JSON.parse(body) : {};

/**
 * The org id is not known by the browser, so reading the settings takes two AGG operations: the
 * tenant context lookup that resolves the org id, then the settings themselves.
 */
const mockUnitsRolloutSettings = (
	settings: { boundaryEnforced?: boolean | null; endUsersLaunched?: boolean | null } | null,
	{ orgId = ORG_ID }: { orgId?: string | null } = {},
): void => {
	fetchMock.post(
		AGG_MATCHER,
		(_url: string, { body }: RequestInit) =>
			parseBody(body).operationName === TENANT_CONTEXT_OPERATION
				? { data: { tenantContexts: orgId ? [{ orgId }] : [] } }
				: // eslint-disable-next-line @typescript-eslint/naming-convention -- matches the AGG field name
					{ data: { admin_unitSettings: settings } },
		{ overwriteRoutes: true },
	);
};

const mockUnitsRolloutSettingsError = (): void => {
	fetchMock.post(AGG_MATCHER, 500, { overwriteRoutes: true });
};

const aggCalls = (): unknown[] =>
	fetchMock.calls().filter(([url]: [string]) => String(url).includes(AGG_PATH));

const createAccessibleProductResponse = (workspaceDisplayName?: string): AccessibleProduct => ({
	products: [
		{
			productDisplayName: 'confluence',
			productId: AvailableSitesProductType.CONFLUENCE,
			workspaces: [
				{
					cloudId: 'site-without-display-name',
					workspaceAvatarUrl: 'www.avatarurl.com',
					workspaceDisplayName,
					workspaceUrl: FALLBACK_SITE_URL,
					isPartOf: [],
					orgId: '',
					workspaceAri: '',
					cloudUrl: FALLBACK_SITE_URL,
				},
			],
		},
	],
});

describe('useAvailableSites', () => {
	beforeEach(() => {
		fetchMock.restore();
		__clearUnitsRolloutSettingsCacheForTests();
		// The units GA killswitch is the first gate read on every path through
		// `shouldUseUnitCompliantApi`, so it is turned on for the whole suite. The tests that
		// cover the killswitch itself live in their own describe below.
		passGate(MASTER_GATE);
	});

	it('should return loading status and the result', async () => {
		mockAvailableSites();
		const { result } = renderHook(() => useAvailableSites());

		expect(result.current).toEqual({ data: [], loading: true });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.data.length).toBeGreaterThan(0);
		});
	});

	it('should return loading status and the result', async () => {
		mockAvailableSitesWithError();
		const spy = jest.fn();
		const { result } = renderHook(() => useAvailableSites(), {
			wrapper: ({ children }) => (
				<AnalyticsListener channel={'*'} onEvent={spy}>
					{children}
				</AnalyticsListener>
			),
		});

		expect(result.current).toEqual({ data: [], loading: true });

		await waitFor(() => {
			expect(spy).toBeFiredWithAnalyticEventOnce({
				payload: {
					action: 'failed',
					actionSubject: 'getAvailableSitesResolve',
					actionSubjectId: undefined,
					eventType: 'operational',
					attributes: {
						error: 'NetworkError',
						errorType: 'NetworkError',
						traceId: null,
						status: 503,
						path: 'Failed to parse pathname from url',
					},
				},
			});
			expect(result.current).toEqual({
				data: [],
				error: expect.any(Error),
				loading: false,
			});
			expect(result.current.error?.message).toBe('unknown error');
		});
	});

	describe('should use the experimental available sites endpoint when the org is launched and enforced', () => {
		beforeEach(() => {
			passGate('linking_platform_site_picker_api_unit_compliant');
		});

		it('requests the experimental available sites path', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			mockAvailableSites();
			const { result } = renderHook(() => useAvailableSites());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(AVAILABLE_SITES_UNIT_COMPLIANT_PATH);
		});

		it.each([
			['boundaries are not enforced', { boundaryEnforced: false, endUsersLaunched: true }],
			['end users are not launched', { boundaryEnforced: true, endUsersLaunched: false }],
			['the settings are unknown', null],
		])('requests the current available sites path when %s', async (_, settings) => {
			mockUnitsRolloutSettings(settings);
			mockAvailableSites();
			const { result } = renderHook(() => useAvailableSites());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
		});

		it('requests the current available sites path when the rollout settings request fails', async () => {
			mockUnitsRolloutSettingsError();
			mockAvailableSites();
			const { result } = renderHook(() => useAvailableSites());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
		});

		it('requests the current available sites path when the org id cannot be resolved', async () => {
			// The tenant context lookup is what resolves the org id, so an empty result means the
			// settings can never be read and the current behaviour has to be kept.
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });
			mockAvailableSites();
			const { result } = renderHook(() => useAvailableSites());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
			expect(aggCalls()).toHaveLength(1);
		});
	});

	describe('should use the current available sites endpoint when the gate is disabled', () => {
		beforeEach(() => {
			failGate('linking_platform_site_picker_api_unit_compliant');
		});

		it('requests the current available sites path and does not call AGG', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			mockAvailableSites();
			const { result } = renderHook(() => useAvailableSites());

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
			expect(aggCalls()).toHaveLength(0);
		});
	});
});

describe('mapAccessibleProductsToAvailableSites', () => {
	it('should map the response from /v2/accessible-products endpoint to match the AvailableSites[] format', () => {
		const accessibleProductsResponse: AccessibleProduct = {
			products: [
				{
					productDisplayName: 'confluence',
					productId: AvailableSitesProductType.CONFLUENCE,
					workspaces: [
						{
							cloudId: '11111',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 1',
							workspaceUrl: 'https://customsite-1.jira.atlassian.net',
							isPartOf: [],
							orgId: '',
							workspaceAri: '',
							cloudUrl: 'https://customsite-1.atlassian.net',
						},
						{
							cloudId: '22222',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 2',
							workspaceUrl: 'https://customsite-2.jira.atlassian.net',
							isPartOf: [],
							orgId: '',
							workspaceAri: '',
							cloudUrl: 'https://customsite-2.atlassian.net',
						},
					],
				},
				{
					productDisplayName: 'jira software',
					productId: AvailableSitesProductType.JIRA_SOFTWARE,
					workspaces: [
						{
							cloudId: '11111',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 1',
							workspaceUrl: 'https://customsite-1.jira.atlassian.net',
							cloudUrl: 'https://customsite-1.atlassian.net',
							isPartOf: [],
							orgId: '',
							workspaceAri: '',
						},
						{
							cloudId: '33333',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 3',
							workspaceUrl: 'https://customsite-3.jira.atlassian.net',
							cloudUrl: 'https://customsite-3.atlassian.net',
							isPartOf: [],
							orgId: '',
							workspaceAri: '',
						},
					],
				},
				{
					productDisplayName: 'JPD',
					productId: AvailableSitesProductType.JIRA_PRODUCT_DISCOVERY,
					workspaces: [
						{
							cloudId: '22222',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 2',
							workspaceUrl: 'https://customsite-2.jira.atlassian.net',
							cloudUrl: 'https://customsite-2.atlassian.net',
							isPartOf: [],
							orgId: '',
							workspaceAri: '',
						},
					],
				},
			],
		};
		const availableSitesResponse: AvailableSite[] = [
			{
				avatarUrl: 'www.avatarurl.com',
				cloudId: '11111',
				displayName: 'custom site 1',
				products: [AvailableSitesProductType.CONFLUENCE, AvailableSitesProductType.JIRA_SOFTWARE],
				url: 'https://customsite-1.atlassian.net',
			},
			{
				avatarUrl: 'www.avatarurl.com',
				cloudId: '22222',
				displayName: 'custom site 2',
				products: [
					AvailableSitesProductType.CONFLUENCE,
					AvailableSitesProductType.JIRA_PRODUCT_DISCOVERY,
				],
				url: 'https://customsite-2.atlassian.net',
			},
			{
				avatarUrl: 'www.avatarurl.com',
				cloudId: '33333',
				displayName: 'custom site 3',
				products: [AvailableSitesProductType.JIRA_SOFTWARE],
				url: 'https://customsite-3.atlassian.net',
			},
		];

		expect(mapAccessibleProductsToAvailableSites(accessibleProductsResponse)).toEqual(
			availableSitesResponse,
		);
	});

	it.each([
		['missing', undefined],
		['empty', ''],
	])('uses the site URL when the display name is %s', (_, displayName) => {
		expect(
			mapAccessibleProductsToAvailableSites(createAccessibleProductResponse(displayName)),
		).toEqual([
			expect.objectContaining({
				displayName: FALLBACK_SITE_URL,
				url: FALLBACK_SITE_URL,
			}),
		]);
	});
});

describe('useAvailableSitesV2', () => {
	beforeEach(() => {
		fetchMock.restore();
		__clearUnitsRolloutSettingsCacheForTests();
		passGate(MASTER_GATE);
	});

	it.each([
		['current', false, ACCESSIBLE_PRODUCTS_PATH],
		['unit-compliant', true, ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH],
	])(
		'uses the site URL fallback with the %s endpoint',
		async (_, isUnitCompliant, expectedEndpoint) => {
			(isUnitCompliant ? passGate : failGate)(ROLLOUT_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			mockAccessibleProducts({ data: createAccessibleProductResponse() });

			const { result } = renderHook(() => useAvailableSitesV2({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});
			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(expectedEndpoint);
			expect(result.current.data[0]).toEqual(
				expect.objectContaining({
					displayName: FALLBACK_SITE_URL,
					url: FALLBACK_SITE_URL,
				}),
			);
		},
	);

	it('should return loading status and the result', async () => {
		mockAccessibleProducts();
		const { result } = renderHook(() => useAvailableSitesV2({}));

		expect(result.current).toEqual({ data: [], loading: true });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.data.length).toBeGreaterThan(0);
		});
	});

	it('should return loading state then load data', async () => {
		mockAccessibleProducts();
		const { result } = renderHook(() => useAvailableSitesV2({}));

		expect(result.current).toEqual({ data: [], loading: true });

		await waitFor(() => {
			expect(result.current).toEqual(
				expect.objectContaining({
					loading: false,
					error: undefined,
					data: expect.arrayContaining([
						{
							cloudId: '49d8b9d6-ee7d-4931-a0ca-7fcae7d1c3b5',
							url: 'https://jdog.jira-dev.com',
							displayName: 'jdog',
							avatarUrl: icon.triangle.base64,
							products: [
								'confluence.ondemand',
								'jira-software.ondemand',
								'jira-servicedesk.ondemand',
								'jira-product-discovery',
								'compass',
							],
						},
					]),
				}),
			);
		});
	});

	it('should return loading status and the result', async () => {
		mockAccessibleProductsWithError();
		const spy = jest.fn();
		const { result } = renderHook(() => useAvailableSitesV2({}), {
			wrapper: ({ children }) => (
				<AnalyticsListener channel={'*'} onEvent={spy}>
					{children}
				</AnalyticsListener>
			),
		});

		expect(result.current).toEqual({ data: [], loading: true });
		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await waitFor(() => {
			expect(result.current).toMatchObject({
				data: [],
				error: expect.any(Response),
				loading: false,
			});
		});
	});

	describe('should use the experimental accessible products endpoint when the org is launched and enforced', () => {
		beforeEach(() => {
			passGate('linking_platform_site_picker_api_unit_compliant');
		});

		it('requests the experimental accessible products path', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			mockAccessibleProducts();
			const { result } = renderHook(() => useAvailableSitesV2({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
		});

		it.each([
			['boundaries are not enforced', { boundaryEnforced: false, endUsersLaunched: true }],
			['end users are not launched', { boundaryEnforced: true, endUsersLaunched: false }],
			['the settings are unknown', null],
		])('requests the current accessible products path when %s', async (_, settings) => {
			mockUnitsRolloutSettings(settings);
			mockAccessibleProducts();
			const { result } = renderHook(() => useAvailableSitesV2({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		});

		it('requests the current accessible products path when the org id cannot be resolved', async () => {
			// The tenant context lookup is what resolves the org id, so an empty result means the
			// settings can never be read and the current behaviour has to be kept.
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });
			mockAccessibleProducts();
			const { result } = renderHook(() => useAvailableSitesV2({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(aggCalls()).toHaveLength(1);
		});
	});

	describe('should use the current accessible products endpoint when the gate is disabled', () => {
		beforeEach(() => {
			failGate('linking_platform_site_picker_api_unit_compliant');
		});

		it('requests the current accessible products path and does not call AGG', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
			mockAccessibleProducts();
			const { result } = renderHook(() => useAvailableSitesV2({}));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
			});

			const [requestUrl] = fetchMock.lastCall() ?? [];
			expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			expect(aggCalls()).toHaveLength(0);
		});
	});
});

describe('units GA killswitch', () => {
	beforeEach(() => {
		fetchMock.restore();
		__clearUnitsRolloutSettingsCacheForTests();
		// `cc-units-ga` short circuits the rollout check, so the rollout gate is never evaluated
		// and is deliberately left unforced in these tests.
		failGate(MASTER_GATE);
	});

	it('keeps the current available sites endpoint and does not call AGG', async () => {
		mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
		mockAvailableSites();
		const { result } = renderHook(() => useAvailableSites());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const [requestUrl] = fetchMock.lastCall() ?? [];
		expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
		expect(aggCalls()).toHaveLength(0);
	});

	it('keeps the current accessible products endpoint and does not call AGG', async () => {
		mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });
		mockAccessibleProducts();
		const { result } = renderHook(() => useAvailableSitesV2({}));

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		const [requestUrl] = fetchMock.lastCall() ?? [];
		expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
		expect(aggCalls()).toHaveLength(0);
	});

	it('does not enable the unit compliant api', async () => {
		mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

		await expect(
			shouldUseUnitCompliantApi(() => fg('linking_platform_site_picker_api_unit_compliant')),
		).resolves.toBe(false);
		expect(aggCalls()).toHaveLength(0);
	});
});

describe('shouldUseUnitCompliantApi', () => {
	beforeEach(() => {
		fetchMock.restore();
		__clearUnitsRolloutSettingsCacheForTests();
		passGate(MASTER_GATE);
	});

	describe('when the rollout gate is enabled', () => {
		beforeEach(() => {
			passGate('linking_platform_site_picker_api_unit_compliant');
		});

		it('queries AGG for the org unit settings with the orgId', async () => {
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await expect(
				shouldUseUnitCompliantApi(() => fg('linking_platform_site_picker_api_unit_compliant')),
			).resolves.toBe(true);

			const [requestUrl, requestInit] = fetchMock.lastCall() ?? [];
			// The org id is resolved from the current hostname, so the settings have to be read
			// from the gateway on that same origin rather than from a caller supplied base url.
			expect(requestUrl).toBe(AGG_PATH);

			const body = JSON.parse(String(requestInit?.body));
			expect(body.variables).toEqual({ orgId: ORG_ID });
			expect(body.query).toContain('admin_unitSettings(orgId: $orgId)');
			expect(body.query).toContain('boundaryEnforced');
			expect(body.query).toContain('endUsersLaunched');
			// `admin_unitSettings` is not an experimental field, so it needs no opt in.
			expect(body.query).not.toContain('@optIn');
		});
	});

	describe('with an org id fallback', () => {
		const originalLocation = Object.getOwnPropertyDescriptor(window, 'location');
		const fallbackOrgId = 'fallback-org-id';
		const useUnitCompliantApi = (orgId?: string): Promise<boolean> =>
			shouldUseUnitCompliantApi(() => fg('linking_platform_site_picker_api_unit_compliant'), orgId);
		const expectSettingsOrgId = (orgId: string): void => {
			const [, requestInit] = fetchMock.lastCall() ?? [];
			expect(parseBody(requestInit?.body).variables).toEqual({ orgId });
		};
		const clearHostname = (): void => {
			Object.defineProperty(window, 'location', {
				configurable: true,
				value: { hostname: '' },
			});
		};

		beforeEach(() => {
			passGate(ROLLOUT_GATE);
		});

		afterEach(() => {
			if (originalLocation) {
				Object.defineProperty(window, 'location', originalLocation);
			}
		});

		it('prefers the org resolved from the hostname', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

			expectSettingsOrgId(ORG_ID);
		});

		it('uses the fallback when the hostname does not resolve an org', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

			expectSettingsOrgId(fallbackOrgId);
			expect(aggCalls()).toHaveLength(2);
		});

		it('ignores the fallback when its gate is disabled', async () => {
			failGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(false);

			expect(aggCalls()).toHaveLength(1);
		});

		it('keeps hostname resolution when the fallback gate is disabled', async () => {
			failGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

			expectSettingsOrgId(ORG_ID);
		});

		it('uses defaults without a hostname when the fallback gate is disabled', async () => {
			failGate(ORG_ID_FALLBACK_GATE);
			clearHostname();

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(false);

			expect(aggCalls()).toHaveLength(0);
		});

		it('shares hostname-only settings across fallback org ids when the gate is disabled', async () => {
			failGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);
			await expect(useUnitCompliantApi('another-org-id')).resolves.toBe(true);

			expectSettingsOrgId(ORG_ID);
			expect(aggCalls()).toHaveLength(2);
		});

		it('uses the fallback without a tenant lookup when the hostname is absent', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			clearHostname();
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true });

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

			expectSettingsOrgId(fallbackOrgId);
			expect(aggCalls()).toHaveLength(1);
		});

		it.each([undefined, ''])(
			'uses defaults when both hostname and org id (%p) are absent',
			async (orgId) => {
				passGate(ORG_ID_FALLBACK_GATE);
				clearHostname();

				await expect(useUnitCompliantApi(orgId)).resolves.toBe(false);

				expect(aggCalls()).toHaveLength(0);
			},
		);

		it('uses defaults when the hostname does not resolve an org and no fallback is supplied', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });

			await expect(useUnitCompliantApi()).resolves.toBe(false);

			expect(aggCalls()).toHaveLength(1);
		});

		it.each([500, { errors: [{ message: 'Tenant lookup failed' }] }])(
			'uses the fallback when the tenant lookup fails with %p',
			async (response) => {
				passGate(ORG_ID_FALLBACK_GATE);
				fetchMock.post(AGG_MATCHER, (_url: string, { body }: RequestInit) =>
					parseBody(body).operationName === TENANT_CONTEXT_OPERATION
						? response
						: // eslint-disable-next-line @typescript-eslint/naming-convention -- matches the AGG field name
							{ data: { admin_unitSettings: { boundaryEnforced: true, endUsersLaunched: true } } },
				);

				await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

				expectSettingsOrgId(fallbackOrgId);
			},
		);

		it('shares requests for the same fallback and keeps different fallbacks separate', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });
			await expect(useUnitCompliantApi()).resolves.toBe(false);

			await expect(
				Promise.all([useUnitCompliantApi(fallbackOrgId), useUnitCompliantApi(fallbackOrgId)]),
			).resolves.toEqual([true, true]);
			expect(aggCalls()).toHaveLength(3);

			mockUnitsRolloutSettings(
				{ boundaryEnforced: false, endUsersLaunched: false },
				{ orgId: null },
			);
			await expect(useUnitCompliantApi('another-org-id')).resolves.toBe(false);
			expectSettingsOrgId('another-org-id');
			expect(aggCalls()).toHaveLength(5);

			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);
			expect(aggCalls()).toHaveLength(5);
		});

		it('retries failed settings requests for the fallback org', async () => {
			passGate(ORG_ID_FALLBACK_GATE);
			fetchMock.post(AGG_MATCHER, (_url: string, { body }: RequestInit) =>
				parseBody(body).operationName === TENANT_CONTEXT_OPERATION
					? { data: { tenantContexts: [] } }
					: 500,
			);
			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(false);

			mockUnitsRolloutSettings({ boundaryEnforced: true, endUsersLaunched: true }, { orgId: null });
			await expect(useUnitCompliantApi(fallbackOrgId)).resolves.toBe(true);

			expectSettingsOrgId(fallbackOrgId);
			expect(aggCalls()).toHaveLength(4);
		});
	});
});

describe('getOperationFailedAttributes', () => {
	it('should correctly handle failed Response', () => {
		const response = new Response(null, {
			status: 500,
			headers: {
				'x-trace-id': 'some-traceid',
			},
		});

		Object.defineProperty(response, 'url', {
			value: 'https://atlassian.com/some-path?some-query-params',
		});

		const attributes = getOperationFailedAttributes(response);

		expect(attributes).toStrictEqual({
			error: 'NetworkError',
			errorType: 'NetworkError',
			traceId: 'some-traceid',
			status: 500,
			path: '/some-path',
		});
	});

	it('should correctly handle generic error', () => {
		const error = new Error('Something error');
		const attributes = getOperationFailedAttributes(error);

		expect(attributes).toStrictEqual({
			error: 'Error',
			errorType: 'Error',
			traceId: null,
			status: null,
			path: null,
		});
	});
});
