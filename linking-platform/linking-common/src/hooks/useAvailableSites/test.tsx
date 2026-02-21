import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import '@atlaskit/link-test-helpers/jest';
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore - This was added due to this import failing with 'no declaration file found for 'fetch-mock/cjs/client' in the Jira Typecheck when the platform is being locally consumed, as Jira does not contain the 'platform/fetch-mock.d.ts' typing. Additionally since this is a custom typing with no properties set it is already adding no type value
import fetchMock from 'fetch-mock/cjs/client';

import {
	mockAccessibleProducts,
	mockAccessibleProductsWithError,
	mockAvailableSites,
	mockAvailableSitesWithError,
} from '../../common/mocks/mockAvailableSites';
import { mapAccessibleProductsToAvailableSites, useAvailableSites, useAvailableSitesV2 } from '.';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { getOperationFailedAttributes } from './utils';
import { AvailableSitesProductType, type AccessibleProduct, type AvailableSite } from './types';
import { icon } from '../../common/mocks/icons';

describe('useAvailableSites', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it('should return loading status and the result', async () => {
		mockAvailableSites();
		const { result } = renderHook(() => useAvailableSites());

		expect(result.current).toMatchInlineSnapshot(`
		      {
		        "data": [],
		        "loading": true,
		      }
	    `);

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

		expect(result.current).toMatchInlineSnapshot(`
		      {
		        "data": [],
		        "loading": true,
		      }
	    `);

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
							vortexMode: 'ENABLED',
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
							vortexMode: 'ENABLED',
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
							vortexMode: 'ENABLED',
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
							vortexMode: 'ENABLED',
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
							vortexMode: 'ENABLED',
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
				isVertigo: true,
				products: [AvailableSitesProductType.CONFLUENCE, AvailableSitesProductType.JIRA_SOFTWARE],
				url: 'https://customsite-1.atlassian.net',
			},
			{
				avatarUrl: 'www.avatarurl.com',
				cloudId: '22222',
				displayName: 'custom site 2',
				isVertigo: true,
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
				isVertigo: true,
				products: [AvailableSitesProductType.JIRA_SOFTWARE],
				url: 'https://customsite-3.atlassian.net',
			},
		];

		expect(mapAccessibleProductsToAvailableSites(accessibleProductsResponse)).toEqual(
			availableSitesResponse,
		);
	});
});

describe('useAvailableSitesV2', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it('should return loading status and the result', async () => {
		mockAccessibleProducts();
		const { result } = renderHook(() => useAvailableSitesV2({}));

		expect(result.current).toMatchInlineSnapshot(`
		{
		  "data": [],
		  "loading": true,
		}
	`);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
			expect(result.current.data.length).toBeGreaterThan(0);
		});
	});

	it('should return loading state then load data', async () => {
		mockAccessibleProducts();
		const { result } = renderHook(() => useAvailableSitesV2({}));

		expect(result.current).toMatchInlineSnapshot(`
		{
		  "data": [],
		  "loading": true,
		}
	`);

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
							isVertigo: true,
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

		expect(result.current).toMatchInlineSnapshot(`
		{
		  "data": [],
		  "loading": true,
		}
	`);
		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		await waitFor(() => {
			expect(result.current).toMatchInlineSnapshot(`
		{
		  "data": [],
		  "error": Response {
		    "_bodyInit": undefined,
		    "_bodyText": "",
		    "headers": Headers {
		      "map": {},
		    },
		    "ok": false,
		    "status": 503,
		    "statusText": "Service Unavailable",
		    "type": "default",
		    "url": "/gateway/api/v2/accessible-products",
		  },
		  "loading": false,
		}
	`);
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
