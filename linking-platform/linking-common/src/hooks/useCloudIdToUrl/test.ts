import fetchMock from 'fetch-mock/cjs/client';
import { renderHook } from '@testing-library/react-hooks';

import {
	mockAvailableSites,
	mockAvailableSitesForGatewayUrl,
} from '../../common/mocks/mockAvailableSites';
import { useCloudIdToUrl } from '.';

describe('useCloudIdToUrl', () => {
	beforeEach(() => {
		fetchMock.restore();
	});

	it('should return loading status and the result', async () => {
		mockAvailableSites();
		const { result, waitForNextUpdate } = renderHook(() =>
			useCloudIdToUrl('0131afab-28cf-45ea-a211-963f638f99bc'),
		);

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": undefined,
        "loading": true,
      }
    `);

		await waitForNextUpdate();

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": "https://customdomains.jira-dev.com",
        "error": undefined,
        "loading": false,
      }
    `);
	});

	it('should fetch relevant sites and return a different result when gatewayBaseUrl passed', async () => {
		mockAvailableSitesForGatewayUrl('https://customgatewaybaseurl.com');
		const { result, waitForNextUpdate } = renderHook(() =>
			useCloudIdToUrl('cloudid-for-custom-baseurl', 'https://customgatewaybaseurl.com'),
		);

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": undefined,
        "loading": true,
      }
    `);

		await waitForNextUpdate();

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": "https://custom-domain-for-custom-baseurl.jira-dev.com",
        "error": undefined,
        "loading": false,
      }
    `);
	});

	it('should return undefined if nothing matched', async () => {
		mockAvailableSites();
		const { result, waitForNextUpdate } = renderHook(() => useCloudIdToUrl('nothing-match-me'));

		await waitForNextUpdate();

		expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": undefined,
        "loading": false,
      }
    `);
	});
});
