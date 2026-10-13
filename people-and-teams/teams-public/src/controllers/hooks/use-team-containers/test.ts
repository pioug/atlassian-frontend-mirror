import { renderHook, waitFor } from '@testing-library/react';

import { teamsClient } from '@atlaskit/teams-client/client';

import { MOCK_CONNECTED_TEAMS_RESULT, MOCK_TEAM_CONTAINERSV2 } from './mocks';
import { useTeamContainersHook } from './use-team-containers-hook';

const fireEvent = jest.fn();

jest.mock('@atlaskit/teams-client/client', () => ({
	...jest.requireActual('@atlaskit/teams-client/client'),
	teamsClient: {
		getTeamContainers: jest.fn(),
		unlinkTeamContainer: jest.fn(),
		getConnectedTeams: jest.fn(),
		getNumberOfConnectedTeams: jest.fn(),
	},
}));

jest.mock('@atlaskit/teams-app-internal-analytics/use-analytics-events', () => ({
	...jest.requireActual('@atlaskit/teams-app-internal-analytics/use-analytics-events'),
	useAnalyticsEvents: jest.fn().mockImplementation(() => ({
		fireEvent,
	})),
}));

jest.mock('@atlaskit/analytics-next/useAnalyticsEvents', () => ({
	...jest.requireActual('@atlaskit/analytics-next/useAnalyticsEvents'),
	useAnalyticsEvents: jest.fn().mockImplementation(() => ({
		createAnalyticsEvent: jest.fn(),
	})),
}));

const fetchTeamContainersSuccessEvent = {
	action: 'succeeded',
	actionSubject: 'fetchTeamContainers',
	attributes: {
		teamId: 'team-id-124',
	},
};

const refetchTeamContainersSuccessEvent = {
	action: 'succeeded',
	actionSubject: 'refetchTeamContainers',
};

const refetchTeamContainersFailedEvent = {
	action: 'failed',
	actionSubject: 'refetchTeamContainers',
};

const fetchConnectedTeamsSuccessEvent = (containerId: string) => ({
	action: 'succeeded',
	actionSubject: 'fetchConnectedTeams',
	attributes: {
		containerId,
		numberOfTeams: 2,
	},
});

describe('useTeamContainersHook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch connectedTeams successfully', async () => {
		const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
		(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValue(mockTeams);
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValue(2);
		const { result } = renderHook(() => useTeamContainersHook());

		result.current[1].fetchNumberOfConnectedTeams('mock-container-id-v2', fireEvent);
		await waitFor(() => expect(result.current[0].connectedTeams.numberOfTeams).toEqual(2));

		result.current[1].fetchConnectedTeams('mock-container-id-v2', fireEvent);
		await waitFor(() =>
			expect(teamsClient.getConnectedTeams).toHaveBeenCalledWith('mock-container-id-v2'),
		);

		expect(result.current[0].connectedTeams).toEqual({
			containerId: 'mock-container-id-v2',
			isLoading: false,
			hasLoaded: true,
			teams: mockTeams,
			error: null,
			numberOfTeams: 2,
		});

		const event = fetchConnectedTeamsSuccessEvent('mock-container-id-v2');

		expect(fireEvent).toHaveBeenCalledWith(
			`operational.${event.actionSubject}.${event.action}`,
			event.attributes,
		);
	});

	it('can refetch team containers', async () => {
		let teamId = 'team-id-124';
		const error = new Error('Failed to fetch');

		(teamsClient.getTeamContainers as jest.Mock)
			.mockResolvedValueOnce([{ id: 'first' }])
			.mockResolvedValueOnce([{ id: 'second' }])
			.mockRejectedValueOnce(error);

		const { result } = renderHook(() => useTeamContainersHook());

		await result.current[1].fetchTeamContainers(teamId, fireEvent);
		expect(result.current[0].teamContainers).toEqual([{ id: 'first' }]);
		expect(fireEvent).toHaveBeenNthCalledWith(
			1,
			`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
			{
				teamId: 'team-id-124',
			},
		);

		await result.current[1].refetchTeamContainers(fireEvent);
		expect(result.current[0].teamContainers).toEqual([{ id: 'second' }]);
		expect(fireEvent).toHaveBeenNthCalledWith(
			2,
			`operational.${refetchTeamContainersSuccessEvent.actionSubject}.${refetchTeamContainersSuccessEvent.action}`,
			{
				teamId: 'team-id-124',
			},
		);

		//@note: running this test alone because react-sweet-state state can conflict when tests run together
		await result.current[1].refetchTeamContainers(fireEvent);
		expect(fireEvent).toHaveBeenNthCalledWith(
			3,
			`operational.${refetchTeamContainersFailedEvent.actionSubject}.${refetchTeamContainersFailedEvent.action}`,
			{
				teamId: 'team-id-124',
				error: {
					message: error.message,
					stack: expect.stringContaining(error.stack || ''),
				},
			},
		);
		expect(result.current[0].teamContainers).toEqual([{ id: 'second' }]);
	});
});

describe('useTeamContainersHook with cypher query v2', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should unlink team containers successfully', async () => {
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: {
				errors: [],
			},
		});
		const { result } = renderHook(() => useTeamContainersHook());

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce([{ id: '2' }, { id: '3' }]);
		await result.current[1].fetchTeamContainers('team-id-126', fireEvent);

		const containerId =
			MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

		await result.current[1].unlinkTeamContainers('team-id-126', containerId);

		expect(result.current[0].unlinkError).toBeNull();
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-126', containerId);
		expect(result.current[0].teamContainers.length).toEqual(1);
		expect(fireEvent).toHaveBeenCalledWith(
			`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
			{
				teamId: 'team-id-126',
			},
		);
	});

	it('should skip fetching team containers if unlinking fails', async () => {
		const mockError = new Error('Failed to unlink');
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: {
				errors: [mockError],
			},
		});
		const { result } = renderHook(() => useTeamContainersHook());

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERSV2);
		await result.current[1].fetchTeamContainers('team-id-127', fireEvent);

		const containerId =
			MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

		await result.current[1].unlinkTeamContainers('team-id-127', containerId);

		expect(result.current[0].unlinkError).toEqual(mockError);
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-127', containerId);
		expect(fireEvent).toHaveBeenCalledWith(
			`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
			{
				teamId: 'team-id-127',
			},
		);
	});
});
