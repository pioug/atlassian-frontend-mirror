import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
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
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { AvailableSitesProductType, type AccessibleProduct, type AvailableSite } from './types';

describe('useAvailableSites', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it('should return loading status and the result', async () => {
		mockAvailableSites();
		const { result, waitForNextUpdate } = renderHook(() => useAvailableSites());

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": [],
        "loading": true,
      }
    `);

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.data.length).toBeGreaterThan(0);
	});

	it('should return loading status and the result', async () => {
		mockAvailableSitesWithError();
		const spy = jest.fn();
		const { result, waitForNextUpdate } = renderHook(() => useAvailableSites(), {
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

		await waitForNextUpdate();

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
		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": [],
        "error": [Error: unknown error],
        "loading": false,
      }
    `);
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
							workspaceUrl: 'https://customsite-1.atlassian.net',
						},
						{
							cloudId: '22222',
							vortexMode: 'ENABLED',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 2',
							workspaceUrl: 'https://customsite-2.atlassian.net',
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
							workspaceUrl: 'https://customsite-1.atlassian.net',
						},
						{
							cloudId: '33333',
							vortexMode: 'ENABLED',
							workspaceAvatarUrl: 'www.avatarurl.com',
							workspaceDisplayName: 'custom site 3',
							workspaceUrl: 'https://customsite-3.atlassian.net',
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
							workspaceUrl: 'https://customsite-2.atlassian.net',
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
	ffTest.on('navx-1819-link-create-confluence-site-migration', '', () => {
		beforeEach(() => {
			fetchMock.restore();
		});

		it('should return loading status and the result', async () => {
			mockAccessibleProducts();
			const { result, waitForNextUpdate } = renderHook(() => useAvailableSitesV2({}));

			expect(result.current).toMatchInlineSnapshot(`
      {
        "data": [],
        "loading": true,
      }
    `);

			await waitForNextUpdate();

			expect(result.current.loading).toBe(false);
			expect(result.current.data.length).toBeGreaterThan(0);
		});

		it('should return loading status and the result', async () => {
			mockAccessibleProductsWithError();
			const spy = jest.fn();
			const { result, waitForNextUpdate } = renderHook(() => useAvailableSitesV2({}), {
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

			await waitForNextUpdate();

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

	ffTest.off('navx-1819-link-create-confluence-site-migration', '', () => {
		beforeEach(() => {
			fetchMock.restore();
		});

		it('should return loading status and the result', async () => {
			mockAvailableSites();
			const { result, waitForNextUpdate } = renderHook(() => useAvailableSitesV2({}));

			expect(result.current).toMatchInlineSnapshot(`
      {
        "data": [],
        "loading": true,
      }
    `);

			await waitForNextUpdate();

			expect(result.current.loading).toBe(false);
			expect(result.current.data.length).toBeGreaterThan(0);
		});

		it('should return loading status and the result', async () => {
			mockAvailableSitesWithError();
			const spy = jest.fn();
			const { result, waitForNextUpdate } = renderHook(() => useAvailableSitesV2({}), {
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

			await waitForNextUpdate();

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
          "url": "/gateway/api/available-sites",
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
