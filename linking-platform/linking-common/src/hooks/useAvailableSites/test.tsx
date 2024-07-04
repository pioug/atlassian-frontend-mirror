import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import '@atlaskit/link-test-helpers/jest';

import {
	mockAvailableSites,
	mockAvailableSitesWithError,
	mockRestore,
} from '../../common/mocks/mockAvailableSites';
import { useAvailableSites, useAvailableSitesV2 } from '.';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { getOperationFailedAttributes } from './utils';

describe('useAvailableSites', () => {
	beforeEach(() => {
		mockRestore();
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

describe('useAvailableSitesV2', () => {
	beforeEach(() => {
		mockRestore();
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
