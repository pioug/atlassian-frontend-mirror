import fetchMock from 'fetch-mock';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { directoryGraphqlQuery } from '../graphqlUtils';
import TeamCentralCardClient, { buildReportingLinesQuery } from '../TeamCentralCardClient';

jest.mock('../graphqlUtils', () => {
	const original = jest.requireActual('../graphqlUtils');
	return {
		...original,
		directoryGraphqlQuery: jest.fn(),
	};
});

const directoryGraphqlQueryMock = directoryGraphqlQuery as jest.Mock;

describe('TeamCentralCardClient', () => {
	const mockCloudId = 'mock-cloud-id';
	const mockOptions = {
		cloudId: mockCloudId,
		teamCentralUrl: 'mock-team-central-url',
	};
	let client: TeamCentralCardClient;

	parseAndTestGraphQLQueries([buildReportingLinesQuery('').query]);

	beforeEach(() => {
		jest.clearAllMocks();
		fetchMock.reset();
	});

	describe('constructor', () => {
		ffTest(
			'enable_ptc_sharded_townsquare_calls',
			async () => {
				const expectedUrl =
					`/gateway/api/townsquare/s/${mockCloudId}` +
					`/organization/containsAnyWorkspace?cloudId=${mockCloudId}`;

				fetchMock.get(expectedUrl, {
					status: 200,
					body: '',
				});

				client = new TeamCentralCardClient(mockOptions);

				expect((await client.isTCReadyPromise).valueOf()).toBe(true);

				expect(fetchMock.calls()[0][0]).toBe(expectedUrl);
			},
			async () => {
				// need a separate cloud ID because of the global const that tracks whether a cloud ID has been resolved
				const mockCloudIdFlagDisabled = `${mockCloudId}-flag-disabled`;
				const expectedUrl = `/gateway/api/watermelon/organization/containsAnyWorkspace?cloudId=${mockCloudIdFlagDisabled}`;

				fetchMock.get(expectedUrl, {
					status: 200,
					body: '',
				});

				client = new TeamCentralCardClient({ ...mockOptions, cloudId: mockCloudIdFlagDisabled });

				expect((await client.isTCReadyPromise).valueOf()).toBe(true);

				expect(fetchMock.calls()[0][0]).toBe(expectedUrl);
			},
		);
	});

	describe('getReportingLines', () => {
		const mockUserId = 'mock-user-id';
		const mockResponseData = { managers: [{ identifierType: 'ATLASSIAN_ID' }], reports: [] };

		describe('successfully fetching reporting lines data', () => {
			beforeEach(() => {
				client = new TeamCentralCardClient(mockOptions);
			});

			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					client.isTCReadyPromise = Promise.resolve(true);

					directoryGraphqlQueryMock.mockResolvedValue({ reportingLines: mockResponseData });

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual(mockResponseData);

					expect(directoryGraphqlQueryMock.mock.calls[0][0]).toBe(
						`/gateway/api/watermelon/graphql?operationName=ReportingLines`,
					);
				},
				async () => {
					client.isTCReadyPromise = Promise.resolve(true);

					directoryGraphqlQueryMock.mockResolvedValue({ reportingLines: mockResponseData });

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual(mockResponseData);

					expect(directoryGraphqlQueryMock.mock.calls[0][0]).toBe(
						`${mockOptions.teamCentralUrl}?operationName=ReportingLines`,
					);
				},
			);
		});

		describe('attempting to fetch reporting lines data with team central call disabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					client = new TeamCentralCardClient({ ...mockOptions, teamCentralDisabled: true });
					client.isTCReadyPromise = Promise.resolve(true);

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual({});

					expect(directoryGraphqlQueryMock.mock.calls).toHaveLength(0);
				},
				async () => {
					client = new TeamCentralCardClient({ ...mockOptions, teamCentralUrl: undefined });
					client.isTCReadyPromise = Promise.resolve(true);

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual({});

					expect(directoryGraphqlQueryMock.mock.calls).toHaveLength(0);
				},
			);
		});
	});
});
