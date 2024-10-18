import fetchMock from 'fetch-mock';

import { fg } from '@atlaskit/platform-feature-flags';
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

// ffTest requires fg to be called within the test body, and for tests where it's pointless to test,
// just no-op the test case and merely check the flag
// ffTest.both / ffTest.on / ffTest.off can't be mixed with plain ffTest, and those have a really awkward
// API that requires excessive nesting, so just use plain ffTest and no-op the test case
const noopTestCase = async () => {
	fg('enable_ptc_sharded_townsquare_calls');
};

// need a separate cloud ID because of the global const that tracks whether a cloud ID has been resolved
describe('TeamCentralCardClient', () => {
	const mockCloudIdFlagEnabledSuffix = 'flag-enabled';
	const mockCloudIdFlagDisabledSuffix = 'flag-disabled';
	const mockTeamCentralUrl = 'mock-team-central-url';
	let client: TeamCentralCardClient;

	parseAndTestGraphQLQueries([buildReportingLinesQuery('').query]);

	beforeEach(() => {
		jest.clearAllMocks();
		fetchMock.reset();
	});

	describe('constructor', () => {
		describe('successfully prefetch', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const mockCloudId = `mock-cloud-id-successful-prefetch-${mockCloudIdFlagEnabledSuffix}`;

					const expectedContainsAnyWorkspaceUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/organization/containsAnyWorkspace?cloudId=${mockCloudId}`;
					const expectedExistsWithWorkspaceTypeUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/workspace/existsWithWorkspaceType?cloudId=${mockCloudId}`;

					fetchMock.get(expectedContainsAnyWorkspaceUrl, {
						status: 200,
						body: '',
					});

					fetchMock.get(expectedExistsWithWorkspaceTypeUrl, {
						status: 200,
						body: 'GLOBAL_EXPERIENCE',
					});

					client = new TeamCentralCardClient({
						cloudId: mockCloudId,
						teamCentralUrl: mockTeamCentralUrl,
					});

					expect(await client.isTCReadyPromise).toBe(true);

					expect(fetchMock.calls().length).toBe(2);
					expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);
					expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);

					expect(await client.getIsGlobalExperienceWorkspace()).toBe(true);
				},
				async () => {
					const mockCloudId = `mock-cloud-id-successful-prefetch-${mockCloudIdFlagDisabledSuffix}`;
					const expectedContainsAnyWorkspaceUrl = `/gateway/api/watermelon/organization/containsAnyWorkspace?cloudId=${mockCloudId}`;

					fetchMock.get(expectedContainsAnyWorkspaceUrl, {
						status: 200,
						body: '',
					});

					client = new TeamCentralCardClient({
						cloudId: mockCloudId,
						teamCentralUrl: mockTeamCentralUrl,
					});

					expect(await client.isTCReadyPromise).toBe(true);

					expect(fetchMock.calls().length).toBe(1);
					expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);

					expect(await client.getIsGlobalExperienceWorkspace()).toBe(false);
				},
			);
		});

		describe('reuses prefetch of exists with workspace type', () => {
			// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const mockCloudId = `mock-cloud-id-reuse-prefetch-${mockCloudIdFlagEnabledSuffix}`;

					const expectedContainsAnyWorkspaceUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/organization/containsAnyWorkspace?cloudId=${mockCloudId}`;
					const expectedExistsWithWorkspaceTypeUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/workspace/existsWithWorkspaceType?cloudId=${mockCloudId}`;

					fetchMock.get(expectedContainsAnyWorkspaceUrl, {
						status: 200,
						body: '',
					});

					fetchMock.get(expectedExistsWithWorkspaceTypeUrl, {
						status: 200,
						body: 'GLOBAL_EXPERIENCE',
					});

					client = new TeamCentralCardClient({
						cloudId: mockCloudId,
						teamCentralUrl: mockTeamCentralUrl,
					});

					const clientAgain = new TeamCentralCardClient({
						cloudId: mockCloudId,
						teamCentralUrl: mockTeamCentralUrl,
					});

					expect(fetchMock.calls().length).toBe(2);
					expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);
					expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);

					expect(await client.getIsGlobalExperienceWorkspace()).toBe(true);
					expect(await clientAgain.getIsGlobalExperienceWorkspace()).toBe(true);

					expect(client.getIsGlobalExperienceWorkspace()).toBe(
						clientAgain.getIsGlobalExperienceWorkspace(),
					);
				},
				noopTestCase,
			);
		});

		describe('skip prefetch of exists with workspace type due to missing cloud ID', () => {
			// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					client = new TeamCentralCardClient({
						teamCentralUrl: mockTeamCentralUrl,
					});

					expect(fetchMock.calls().length).toBe(0);
					expect(await client.getIsGlobalExperienceWorkspace()).toBe(false);
				},
				noopTestCase,
			);
		});

		describe('failed prefetch of exists with workspace type', () => {
			// eslint-disable-next-line @atlaskit/platform/ensure-test-runner-arguments
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					const mockCloudId = `mock-cloud-id-failed-prefetch-${mockCloudIdFlagEnabledSuffix}`;

					const expectedContainsAnyWorkspaceUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/organization/containsAnyWorkspace?cloudId=${mockCloudId}`;
					const expectedExistsWithWorkspaceTypeUrl =
						`/gateway/api/townsquare/s/${mockCloudId}` +
						`/workspace/existsWithWorkspaceType?cloudId=${mockCloudId}`;

					fetchMock.get(expectedContainsAnyWorkspaceUrl, {
						status: 200,
						body: '',
					});

					fetchMock.get(expectedExistsWithWorkspaceTypeUrl, {
						status: 500,
						body: '',
					});

					client = new TeamCentralCardClient({
						cloudId: mockCloudId,
						teamCentralUrl: mockTeamCentralUrl,
					});

					expect(fetchMock.calls().length).toBe(2);
					expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);
					expect(await client.getIsGlobalExperienceWorkspace()).toBe(false);
				},
				noopTestCase,
			);
		});
	});

	describe('getReportingLines', () => {
		const mockCloudId = 'mock-cloud-id';
		const mockUserId = 'mock-user-id';
		const mockResponseData = { managers: [{ identifierType: 'ATLASSIAN_ID' }], reports: [] };

		describe('successfully fetching reporting lines data', () => {
			beforeEach(() => {
				client = new TeamCentralCardClient({
					cloudId: mockCloudId,
					teamCentralUrl: mockTeamCentralUrl,
				});
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
						`${mockTeamCentralUrl}?operationName=ReportingLines`,
					);
				},
			);
		});

		describe('attempting to fetch reporting lines data with team central call disabled', () => {
			ffTest(
				'enable_ptc_sharded_townsquare_calls',
				async () => {
					client = new TeamCentralCardClient({ cloudId: mockCloudId, teamCentralDisabled: true });
					client.isTCReadyPromise = Promise.resolve(true);

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual({});

					expect(directoryGraphqlQueryMock.mock.calls).toHaveLength(0);
				},
				async () => {
					client = new TeamCentralCardClient({ cloudId: mockCloudId, teamCentralUrl: undefined });
					client.isTCReadyPromise = Promise.resolve(true);

					const data = await client.getReportingLines(mockUserId);

					expect(data).toEqual({});

					expect(directoryGraphqlQueryMock.mock.calls).toHaveLength(0);
				},
			);
		});
	});
});
