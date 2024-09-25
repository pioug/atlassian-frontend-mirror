import fetchMock from 'fetch-mock/cjs/client';

import { isFedRamp } from '@atlaskit/atlassian-context';

import ProfileCardClient from '../../client/ProfileCardClient';
import TeamCentralCardClient from '../../client/TeamCentralCardClient';
import { type ReportingLinesUser } from '../../types';

const EXAMPLE_TEAM_CENTRAL_URL = 'https://team.atlassian.com';
const EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL =
	EXAMPLE_TEAM_CENTRAL_URL + '/?operationName=ReportingLines';
const EXAMPLE_TEAM_CENTRAL_FEATURE_URL =
	EXAMPLE_TEAM_CENTRAL_URL + '/?operationName=isFeatureKeyEnabled';
const WORKSPACE_TEAM_CENTRAL_URL =
	'/gateway/api/watermelon/organization/containsAnyWorkspace?cloudId=';
const EXAMPLE_REPORTING_LINE_USER: ReportingLinesUser = {
	accountIdentifier: 'abcd',
	identifierType: 'ATLASSIAN_ID',
	pii: {
		name: 'name',
		picture: 'picture',
	},
};

jest.mock('@atlaskit/atlassian-context', () => ({
	...jest.requireActual('@atlaskit/atlassian-context'),
	isFedRamp: jest.fn(),
}));

function mockReportingLines(promise: Promise<string>) {
	fetchMock.post(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL, () => promise, {
		method: 'POST',
		overwriteRoutes: true,
	});
}

function mockHasWorkspace(status: number, cloudId: string) {
	fetchMock.mock(WORKSPACE_TEAM_CENTRAL_URL + cloudId, status, {
		method: 'GET',
		overwriteRoutes: true,
	});
}

function mockCheckFeatureFlag(promise: Promise<string>) {
	fetchMock.post(EXAMPLE_TEAM_CENTRAL_FEATURE_URL, () => promise, {
		method: 'POST',
		overwriteRoutes: true,
	});
}

function initClient() {
	return new TeamCentralCardClient({
		cacheSize: 10,
		cacheMaxAge: 5000,
		teamCentralUrl: EXAMPLE_TEAM_CENTRAL_URL,
	});
}

function initProfileCardClient(cloudId: string) {
	const teamCentralClient = new TeamCentralCardClient({
		cacheSize: 10,
		cacheMaxAge: 5000,
		teamCentralUrl: EXAMPLE_TEAM_CENTRAL_URL,
		teamCentralBaseUrl: EXAMPLE_TEAM_CENTRAL_URL,
		cloudId: cloudId,
	});
	return new ProfileCardClient(
		{ url: EXAMPLE_TEAM_CENTRAL_URL, cloudId: cloudId },
		{ teamCentralClient },
	);
}

function initProfileCardClientWithNoCloudId() {
	const teamCentralClient = new TeamCentralCardClient({
		cacheSize: 10,
		cacheMaxAge: 5000,
		teamCentralUrl: EXAMPLE_TEAM_CENTRAL_URL,
		teamCentralBaseUrl: EXAMPLE_TEAM_CENTRAL_URL,
	});
	return new ProfileCardClient({ url: EXAMPLE_TEAM_CENTRAL_URL }, { teamCentralClient });
}

describe('TeamCentralCardClient', () => {
	const hasWorkspaceCloudId = 'test-has-workspace';
	const hasNoWorkspaceCloudId = 'test-has-no-workspace';
	const mockIsFedRamp = isFedRamp as jest.Mock;

	beforeEach(() => {
		mockReportingLines(
			Promise.resolve(
				JSON.stringify({
					data: {
						reportingLines: {
							managers: [EXAMPLE_REPORTING_LINE_USER],
							reports: [EXAMPLE_REPORTING_LINE_USER, EXAMPLE_REPORTING_LINE_USER],
						},
					},
				}),
			),
		);
		mockHasWorkspace(200, hasWorkspaceCloudId);
		mockCheckFeatureFlag(
			Promise.resolve(
				JSON.stringify({
					data: {
						isFeatureEnabled: {
							enabled: true,
						},
					},
				}),
			),
		);
	});

	afterEach(() => {
		fetchMock.reset();
		mockIsFedRamp.mockRestore();
	});

	it('can make successful request', async () => {
		const client = initClient();
		const reportingLines = await client.getReportingLines('user');
		expect(reportingLines.managers).toHaveLength(1);
		expect(reportingLines.reports).toHaveLength(2);
		expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL)).toHaveLength(1);

		// Loads from cache
		await client.getReportingLines('user');
		expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL)).toHaveLength(1);
	});

	it('failure should return empty data because reporting lines is not part of the critical path', async () => {
		mockReportingLines(Promise.reject());
		const client = initClient();
		const reportingLines = await client.getReportingLines('user');
		expect(reportingLines).toEqual({});
		expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL)).toHaveLength(1);
	});

	it('auth failure should trip the circuit breaker', async () => {
		const authError: Error & { status?: number } = new Error();
		authError.status = 403;
		mockReportingLines(Promise.reject(authError));
		const client = initClient();
		const reportingLines = await client.getReportingLines('user');
		expect(reportingLines).toEqual({});
		expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL)).toHaveLength(1);

		// Will not make any further calls
		await client.getReportingLines('user');
		expect(fetchMock.calls(EXAMPLE_TEAM_CENTRAL_REPORTING_LINES_URL)).toHaveLength(1);
	});

	it('workspace exists should resolve reporting lines', async () => {
		const client = initProfileCardClient(hasWorkspaceCloudId);
		const reportingLines = await client.getReportingLines('user');
		expect(reportingLines.managers).toHaveLength(1);
		expect(reportingLines.reports).toHaveLength(2);
		expect(fetchMock.calls(WORKSPACE_TEAM_CENTRAL_URL + hasWorkspaceCloudId)).toHaveLength(1);
	});

	it('workspace does not exist should not resolve reporting lines', async () => {
		mockHasWorkspace(404, hasNoWorkspaceCloudId);
		const client = initProfileCardClient(hasNoWorkspaceCloudId);
		const reportingLines = await client.getReportingLines('user');
		expect(reportingLines.managers).toHaveLength(0);
		expect(reportingLines.reports).toHaveLength(0);
	});

	it('workspace exists should show give kudos', async () => {
		const client = initProfileCardClient(hasWorkspaceCloudId);
		const shouldShowGiveKudos = await client.shouldShowGiveKudos();
		expect(shouldShowGiveKudos).toEqual(true);
	});

	it('workspace does not exist should not show give kudos', async () => {
		mockHasWorkspace(404, hasNoWorkspaceCloudId);
		const client = initProfileCardClient(hasNoWorkspaceCloudId);
		const shouldShowGiveKudos = await client.shouldShowGiveKudos();
		expect(shouldShowGiveKudos).toEqual(false);
	});

	it('workspace should not be called if fedramp', () => {
		mockIsFedRamp.mockReturnValue(true);

		initProfileCardClient(hasWorkspaceCloudId);
		expect(fetchMock.called(WORKSPACE_TEAM_CENTRAL_URL + hasWorkspaceCloudId)).toBeFalsy();
	});

	it('workspace should be called if not fedramp', () => {
		mockIsFedRamp.mockReturnValue(false);

		initProfileCardClient(hasWorkspaceCloudId);
		expect(fetchMock.calls(WORKSPACE_TEAM_CENTRAL_URL + hasWorkspaceCloudId)).toBeTruthy();
	});

	it('cloudId not passed in should still check to show give kudos', async () => {
		const client = initProfileCardClientWithNoCloudId();
		const shouldShowGiveKudos = await client.shouldShowGiveKudos();
		expect(shouldShowGiveKudos).toEqual(true);
	});
});
