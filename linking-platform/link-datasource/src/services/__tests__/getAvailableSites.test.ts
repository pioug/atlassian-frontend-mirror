import fetchMock from 'fetch-mock/cjs/client';

import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';

import { getAvailableSites } from '../getAvailableSites';

describe('getAvailableSites', () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	it('should return an array of jira sites', async () => {
		const mock = fetchMock.post({
			url: '/gateway/api/available-sites',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: {
				products: [
					'jira-software.ondemand',
					'jira-core.ondemand',
					'jira-incident-manager.ondemand',
					'jira-product-discovery',
					'jira-servicedesk.ondemand',
				],
			},
			response: {
				sites: mockSiteData,
			},
		});

		const jiraSites = await getAvailableSites('jira');

		expect(mock.calls()).toHaveLength(1);

		expect(mock.calls()[0][1].body).toEqual(
			'{"products":["jira-software.ondemand","jira-core.ondemand","jira-incident-manager.ondemand","jira-product-discovery","jira-servicedesk.ondemand"]}',
		);
		expect(mock.done()).toBe(true);

		expect(jiraSites).toEqual(mockSiteData);
	});

	it('should return an array of confluence sites', async () => {
		const mockConfluenceSiteData = mockSiteData.slice(1, 3);
		const mock = fetchMock.post({
			url: '/gateway/api/available-sites',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: {
				products: ['confluence.ondemand'],
			},
			response: {
				sites: mockConfluenceSiteData,
			},
		});

		const confluenceSites = await getAvailableSites('confluence');

		expect(mock.calls()).toHaveLength(1);
		expect(mock.calls()[0][1].body).toEqual('{"products":["confluence.ondemand"]}');
		expect(mock.done()).toBe(true);

		expect(confluenceSites).toEqual(mockConfluenceSiteData);
	});

	const scenarios = [['jira'], ['confluence']] as const;

	describe.each(scenarios)('when calling the function with %s argument', (arg) => {
		it('should throw if response is 500', async () => {
			expect.assertions(3);
			const mock = fetchMock.post('/gateway/api/available-sites', {
				body: 'penguins jumping high',
				status: 500,
			});

			try {
				await getAvailableSites(arg);
			} catch (e) {
				expect(e).toEqual(new Error('penguins jumping high'));
			}
			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
		});

		it('should throw if response is 401', async () => {
			expect.assertions(3);
			const mock = fetchMock.post('/gateway/api/available-sites', {
				status: 401,
			});

			try {
				await getAvailableSites(arg);
			} catch (e) {
				expect(e).toEqual(new Error('Something went wrong'));
			}
			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
		});
	});
});
