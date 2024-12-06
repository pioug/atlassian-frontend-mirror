import fetchMock from 'fetch-mock';

import { parseAndTestGraphQLQueries } from '@atlassian/ptc-test-utils/graphql-jest';

import { getOrgIdForCloudIdFromAGG } from '../getOrgIdForCloudIdFromAGG';
import { directoryGraphqlQuery } from '../graphqlUtils';
import TeamCentralCardClient, { buildReportingLinesQuery } from '../TeamCentralCardClient';

jest.mock('../getOrgIdForCloudIdFromAGG', () => ({
	...jest.requireActual('../getOrgIdForCloudIdFromAGG'),
	getOrgIdForCloudIdFromAGG: jest.fn(),
}));

jest.mock('../graphqlUtils', () => {
	const original = jest.requireActual('../graphqlUtils');
	return {
		...original,
		directoryGraphqlQuery: jest.fn(),
	};
});

const mockDirectoryGraphqlQuery = directoryGraphqlQuery as jest.Mock;
const mockGetOrgIdForCloudIdFromAGG = getOrgIdForCloudIdFromAGG as jest.Mock;

// need a separate cloud ID because of the global const that tracks whether a cloud ID has been resolved
describe('TeamCentralCardClient', () => {
	const mockCloudIdFlagEnabledSuffix = 'flag-enabled';
	const mockGatewayGraphqlUrl = 'mock-gateway-graphql-url';
	const mockOrgId = 'mock-org-id';
	let client: TeamCentralCardClient;

	parseAndTestGraphQLQueries([buildReportingLinesQuery('').query]);

	beforeEach(() => {
		jest.clearAllMocks();
		fetchMock.reset();
	});

	describe('constructor', () => {
		it('successfully prefetch', async () => {
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

			mockGetOrgIdForCloudIdFromAGG.mockResolvedValue(mockOrgId);

			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			expect(fetchMock.calls().length).toBe(2);

			expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);
			expect(await client.isTCReadyPromise).toBe(true);

			expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);
			expect(await client.getIsGlobalExperienceWorkspace()).toBe(true);

			expect(mockGetOrgIdForCloudIdFromAGG).toHaveBeenCalledTimes(1);
			expect(mockGetOrgIdForCloudIdFromAGG).toHaveBeenCalledWith(
				mockGatewayGraphqlUrl,
				mockCloudId,
			);
			expect(await client.getOrgId()).toBe(mockOrgId);
		});

		it('reuses prefetch', async () => {
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

			mockGetOrgIdForCloudIdFromAGG.mockResolvedValue(mockOrgId);

			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			const clientAgain = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			expect(fetchMock.calls().length).toBe(2);

			expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);
			expect(await client.isTCReadyPromise).toBe(true);
			expect(await clientAgain.isTCReadyPromise).toBe(true);
			expect(client.isTCReadyPromise).toBe(clientAgain.isTCReadyPromise);

			expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);
			expect(await client.getIsGlobalExperienceWorkspace()).toBe(true);
			expect(await clientAgain.getIsGlobalExperienceWorkspace()).toBe(true);
			expect(client.getIsGlobalExperienceWorkspace()).toBe(
				clientAgain.getIsGlobalExperienceWorkspace(),
			);

			expect(mockGetOrgIdForCloudIdFromAGG).toHaveBeenCalledTimes(1);
			expect(await client.getOrgId()).toBe(mockOrgId);
			expect(await clientAgain.getOrgId()).toBe(mockOrgId);
			expect(client.getOrgId()).toBe(clientAgain.getOrgId());
		});

		it('skip prefetch due to missing cloud ID', async () => {
			client = new TeamCentralCardClient({
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			expect(fetchMock.calls().length).toBe(0);

			expect(await client.isTCReadyPromise).toBe(true);

			expect(await client.getIsGlobalExperienceWorkspace()).toBe(false);

			expect(mockGetOrgIdForCloudIdFromAGG).not.toHaveBeenCalled();
			expect(await client.getOrgId()).toBe(null);

			expect(await client.checkWorkspaceExists()).toBe(true);
		});

		it('should skip prefetching org ID if provided in options', async () => {
			const mockCloudId = `mock-cloud-id-successful-skip-prefetch-${mockCloudIdFlagEnabledSuffix}`;

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
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
				orgId: mockOrgId,
			});

			expect(fetchMock.calls().length).toBe(2);

			expect(fetchMock.calls()[0][0]).toBe(expectedContainsAnyWorkspaceUrl);
			expect(await client.isTCReadyPromise).toBe(true);

			expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);
			expect(await client.getIsGlobalExperienceWorkspace()).toBe(true);

			expect(mockGetOrgIdForCloudIdFromAGG).not.toHaveBeenCalled();
			expect(await client.getOrgId()).toBe(mockOrgId);
		});

		it('should not cache org ID provided in options to minimise blast radius of bad org ID being passed in', async () => {
			const mockCloudId = `mock-cloud-id-successful-minimise-blast-radius-${mockCloudIdFlagEnabledSuffix}`;
			const mockOrgIdButDifferent = `${mockOrgId}-but-different`;
			const mockOrgIdButCorrect = `${mockOrgId}-but-correct`;

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

			mockGetOrgIdForCloudIdFromAGG.mockResolvedValue(mockOrgIdButCorrect);

			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
				orgId: mockOrgId,
			});

			const clientWithOrgIdButDifferent = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
				orgId: mockOrgIdButDifferent,
			});

			const clientResolvesOrgIdButCorrect = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			expect(mockGetOrgIdForCloudIdFromAGG).toHaveBeenCalledTimes(1);
			expect(await client.getOrgId()).toBe(mockOrgId);
			expect(await clientWithOrgIdButDifferent.getOrgId()).toBe(mockOrgIdButDifferent);
			expect(await clientResolvesOrgIdButCorrect.getOrgId()).toBe(mockOrgIdButCorrect);
		});

		it('failed prefetch of exists with workspace type', async () => {
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
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			expect(fetchMock.calls().length).toBe(2);
			expect(fetchMock.calls()[1][0]).toBe(expectedExistsWithWorkspaceTypeUrl);
			expect(await client.getIsGlobalExperienceWorkspace()).toBe(false);
		});
	});

	describe('getReportingLines', () => {
		const mockCloudId = 'mock-cloud-id';
		const mockUserId = 'mock-user-id';
		const mockResponseData = { managers: [{ identifierType: 'ATLASSIAN_ID' }], reports: [] };

		it('successfully fetching reporting lines data', async () => {
			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			client.isTCReadyPromise = Promise.resolve(true);

			mockDirectoryGraphqlQuery.mockResolvedValue({ reportingLines: mockResponseData });

			const data = await client.getReportingLines(mockUserId);

			expect(data).toEqual(mockResponseData);

			expect(mockDirectoryGraphqlQuery.mock.calls[0][0]).toBe(
				`/gateway/api/watermelon/graphql?operationName=ReportingLines`,
			);
		});

		it('failure should return empty data because reporting lines is not part of the critical path', async () => {
			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			client.isTCReadyPromise = Promise.resolve(true);

			mockDirectoryGraphqlQuery.mockRejectedValue(undefined);

			const data = await client.getReportingLines(mockUserId);

			expect(data).toEqual({});

			expect(mockDirectoryGraphqlQuery.mock.calls[0][0]).toBe(
				`/gateway/api/watermelon/graphql?operationName=ReportingLines`,
			);
		});

		it('auth failure should trip the circuit breaker', async () => {
			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			client.isTCReadyPromise = Promise.resolve(true);

			const authError: Error & { status?: number } = new Error();
			authError.status = 403;

			mockDirectoryGraphqlQuery.mockRejectedValue(authError);

			const data = await client.getReportingLines(mockUserId);

			expect(data).toEqual({});

			expect(mockDirectoryGraphqlQuery).toHaveBeenCalledTimes(1);

			const repeatData = await client.getReportingLines(mockUserId);

			expect(repeatData).toEqual({});

			expect(mockDirectoryGraphqlQuery).toHaveBeenCalledTimes(1);
		});

		it('workspace does not exist should not resolve reporting lines', async () => {
			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
			});

			client.isTCReadyPromise = Promise.resolve(false);

			const data = await client.getReportingLines(mockUserId);

			expect(data).toEqual({
				managers: [],
				reports: [],
			});

			expect(mockDirectoryGraphqlQuery).toHaveBeenCalledTimes(0);
		});

		it('attempting to fetch reporting lines data with team central call disabled', async () => {
			client = new TeamCentralCardClient({
				cloudId: mockCloudId,
				gatewayGraphqlUrl: mockGatewayGraphqlUrl,
				teamCentralDisabled: true,
			});
			client.isTCReadyPromise = Promise.resolve(true);

			const data = await client.getReportingLines(mockUserId);

			expect(data).toEqual({});

			expect(mockDirectoryGraphqlQuery.mock.calls).toHaveLength(0);
		});
	});
});
