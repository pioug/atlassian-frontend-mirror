import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { ffTest } from '@atlassian/feature-flags-test-utils/test-runner';
import { renderHook, waitFor } from '@testing-library/react';

import '@atlaskit/link-test-helpers/jest';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetchMock from 'fetch-mock/cjs/client';

import { mockAccessibleProducts } from '../../common/mocks/mock-accessible-products';
import { mockAccessibleProductsWithError } from '../../common/mocks/mock-accessible-products-with-error';
import { mockAvailableSites } from '../../common/mocks/mock-available-sites';
import { mockAvailableSitesWithError } from '../../common/mocks/mock-available-sites-with-error';
import { mapAccessibleProductsToAvailableSites } from './mapAccessibleProductsToAvailableSites';
import { useAvailableSites } from './useAvailableSites';
import { useAvailableSitesV2 } from './useAvailableSitesV2';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { icon } from '../../common/mocks/icons';
import { getOperationFailedAttributes } from './getOperationFailedAttributes';
import { AvailableSitesProductType, type AccessibleProduct, type AvailableSite } from './types';

const AVAILABLE_SITES_PATH = '/gateway/api/available-sites';
const AVAILABLE_SITES_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/available-sites';
const ACCESSIBLE_PRODUCTS_PATH = '/gateway/api/v2/accessible-products';
const ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH = '/gateway/api/experimental/v2/accessible-products';
const FALLBACK_SITE_URL = 'https://site-without-display-name.atlassian.net';

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

	ffTest.on(
		'linking_platform_site_picker_api_unit_compliant',
		'should use the experimental available sites endpoint when the gate is enabled',
		() => {
			it('requests the experimental available sites path', async () => {
				mockAvailableSites();
				const { result } = renderHook(() => useAvailableSites());

				await waitFor(() => {
					expect(result.current.loading).toBe(false);
				});

				const [requestUrl] = fetchMock.lastCall() ?? [];
				expect(requestUrl).toBe(AVAILABLE_SITES_UNIT_COMPLIANT_PATH);
			});
		},
	);

	ffTest.off(
		'linking_platform_site_picker_api_unit_compliant',
		'should use the current available sites endpoint when the gate is disabled',
		() => {
			it('requests the current available sites path', async () => {
				mockAvailableSites();
				const { result } = renderHook(() => useAvailableSites());

				await waitFor(() => {
					expect(result.current.loading).toBe(false);
				});

				const [requestUrl] = fetchMock.lastCall() ?? [];
				expect(requestUrl).toBe(AVAILABLE_SITES_PATH);
			});
		},
	);
});

describe('mapAccessibleProductsToAvailableSites', () => {
	it('should map the response from /v2/accessible-products endpoint to match the AvailableSites[] format', () => {
		failGate('platform_lp_sllv_display_name_fallback');
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
	])('uses the site URL when the display name is %s and the gate is on', (_, displayName) => {
		passGate('platform_lp_sllv_display_name_fallback');

		expect(
			mapAccessibleProductsToAvailableSites(createAccessibleProductResponse(displayName)),
		).toEqual([
			expect.objectContaining({
				displayName: FALLBACK_SITE_URL,
				url: FALLBACK_SITE_URL,
			}),
		]);
	});

	it('preserves the existing missing display name behavior when the gate is off', () => {
		failGate('platform_lp_sllv_display_name_fallback');

		expect(
			mapAccessibleProductsToAvailableSites(createAccessibleProductResponse())[0].displayName,
		).toBeUndefined();
	});
});

describe('useAvailableSitesV2', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it.each([
		['current', false, ACCESSIBLE_PRODUCTS_PATH],
		['unit-compliant', true, ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH],
	])(
		'uses the site URL fallback with the %s endpoint',
		async (_, isUnitCompliant, expectedEndpoint) => {
			if (isUnitCompliant) {
				passGate('linking_platform_site_picker_api_unit_compliant');
			} else {
				failGate('linking_platform_site_picker_api_unit_compliant');
			}
			passGate('platform_lp_sllv_display_name_fallback');
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

	ffTest.on(
		'linking_platform_site_picker_api_unit_compliant',
		'should use the experimental accessible products endpoint when the gate is enabled',
		() => {
			it('requests the experimental accessible products path', async () => {
				mockAccessibleProducts();
				const { result } = renderHook(() => useAvailableSitesV2({}));

				await waitFor(() => {
					expect(result.current.loading).toBe(false);
				});

				const [requestUrl] = fetchMock.lastCall() ?? [];
				expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_UNIT_COMPLIANT_PATH);
			});
		},
	);

	ffTest.off(
		'linking_platform_site_picker_api_unit_compliant',
		'should use the current accessible products endpoint when the gate is disabled',
		() => {
			it('requests the current accessible products path', async () => {
				mockAccessibleProducts();
				const { result } = renderHook(() => useAvailableSitesV2({}));

				await waitFor(() => {
					expect(result.current.loading).toBe(false);
				});

				const [requestUrl] = fetchMock.lastCall() ?? [];
				expect(requestUrl).toBe(ACCESSIBLE_PRODUCTS_PATH);
			});
		},
	);
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
