import { renderHook, waitFor } from '@testing-library/react';

import { teamsClient } from '@atlaskit/teams-client';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { MOCK_CONNECTED_TEAMS_RESULT, MOCK_TEAM_CONTAINERS, MOCK_TEAM_CONTAINERSV2 } from './mocks';

import { useConnectedTeams, useTeamContainers, useTeamContainersHook } from './index';

const fireEventNext = jest.fn();
const fireOperationalEvent = jest.fn();

jest.mock('@atlaskit/teams-client', () => ({
	teamsClient: {
		getTeamContainers: jest.fn(),
		unlinkTeamContainer: jest.fn(),
		getConnectedTeams: jest.fn(),
		getNumberOfConnectedTeams: jest.fn(),
	},
}));

jest.mock('@atlaskit/teams-app-internal-analytics', () => ({
	useAnalyticsEvents: jest.fn().mockImplementation(() => ({
		fireEvent: fireEventNext,
	})),
}));

jest.mock('../../../common/utils/analytics', () => ({
	...jest.requireActual('../../../common/utils/analytics'),
	usePeopleAndTeamAnalytics: jest.fn().mockImplementation(() => ({
		fireOperationalEvent,
	})),
}));

const fetchTeamContainersSuccessEvent = {
	action: 'succeeded',
	actionSubject: 'fetchTeamContainers',
	attributes: {
		teamId: 'team-id-124',
	},
};

const fetchTeamContainersFailedEvent = {
	action: 'failed',
	actionSubject: 'fetchTeamContainers',
	attributes: {
		teamId: 'team-id-125',
		error: {
			message: 'Failed to fetch',
			stack: expect.stringContaining('Failed to fetch'),
		},
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

const fetchNumberOfConnectedTeamsSuccessEvent = (containerId: string) => ({
	action: 'succeeded',
	actionSubject: 'fetchNumberOfConnectedTeams',
	attributes: {
		containerId,
		numberOfTeams: 2,
	},
});

const fetchConnectedTeamsFailedEvent = (containerId: string) => ({
	action: 'failed',
	actionSubject: 'fetchConnectedTeams',
	attributes: {
		containerId,
		numberOfTeams: 2,
		error: {
			message: 'Failed to fetch',
			stack: expect.stringContaining('Failed to fetch'),
		},
	},
});

describe('useTeamContainers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should initialize with loading true and empty containers', () => {
		const { result } = renderHook(() => useTeamContainers('team-id-123'));

		expect(result.current.loading).toBe(true);
		expect(result.current.teamContainers).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	ffTest.off('ptc-enable-teams-public-analytics-refactor', 'false', () => {
		it('should fetch and set team containers successfully', async () => {
			(teamsClient.getTeamContainers as jest.Mock).mockImplementation(() => Promise.resolve(MOCK_TEAM_CONTAINERS));

			const { result } = renderHook(() => useTeamContainers('team-id-124'));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.teamContainers).toEqual(MOCK_TEAM_CONTAINERS);
				expect(result.current.error).toBeNull();
				expect(fireOperationalEvent).toHaveBeenCalledWith(
					expect.any(Function),
					fetchTeamContainersSuccessEvent,
				);
			});
		});

		it('should handle errors during fetch', async () => {
			const mockError = new Error('Failed to fetch');
			(teamsClient.getTeamContainers as jest.Mock).mockImplementation(() => Promise.reject(mockError));

			const { result } = renderHook(() => useTeamContainers('team-id-125'));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.teamContainers).toEqual([]);
				expect(result.current.error).toEqual(mockError);
				expect(fireOperationalEvent).toHaveBeenCalledWith(
					expect.any(Function),
					fetchTeamContainersFailedEvent,
				);
			});
		});
	});

	ffTest.on('ptc-enable-teams-public-analytics-refactor', 'true', () => {
		it('should fetch and set team containers successfully', async () => {
			(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);

			const { result } = renderHook(() => useTeamContainers('team-id-124'));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.teamContainers).toEqual(MOCK_TEAM_CONTAINERS);
				expect(result.current.error).toBeNull();
				expect(fireEventNext).toHaveBeenCalledWith(
					`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
					fetchTeamContainersSuccessEvent.attributes,
				);
			});
		});

		it('should handle errors during fetch', async () => {
			const mockError = new Error('Failed to fetch');
			(teamsClient.getTeamContainers as jest.Mock).mockRejectedValueOnce(mockError);

			const { result } = renderHook(() => useTeamContainers('team-id-125'));

			await waitFor(() => {
				expect(result.current.loading).toBe(false);
				expect(result.current.teamContainers).toEqual([]);
				expect(result.current.error).toEqual(mockError);
				expect(fireEventNext).toHaveBeenCalledWith(
					`operational.${fetchTeamContainersFailedEvent.actionSubject}.${fetchTeamContainersFailedEvent.action}`,
					fetchTeamContainersFailedEvent.attributes,
				);
			});
		});
	});
});

describe('useConnectedTeams', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return initial connectedTeamsState', () => {
		const { result } = renderHook(() => useConnectedTeams());

		expect(result.current.isLoading).toBe(false);
		expect(result.current.teams).toEqual(undefined);
		expect(result.current.numberOfTeams).toEqual(undefined);
		expect(result.current.error).toBeNull();
	});

	ffTest.off('ptc-enable-teams-public-analytics-refactor', 'false', () => {
		it('should fetch and set number of connected teams successfully', async () => {
			(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValueOnce(2);

			const { result } = renderHook(() => useConnectedTeams());

			result.current.fetchNumberOfConnectedTeams('mock-container-id');
			await waitFor(() => expect(result.current.numberOfTeams).toEqual(2));
			expect(result.current.isLoading).toBe(false);

			expect(result.current.error).toBeNull();
			expect(fireOperationalEvent).toHaveBeenCalledWith(
				expect.any(Function),
				fetchNumberOfConnectedTeamsSuccessEvent('mock-container-id'),
			);
		});

		it('should fetch and set connected teams successfully', async () => {
			const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
			(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValueOnce(mockTeams);

			const { result } = renderHook(() => useConnectedTeams());

			result.current.fetchConnectedTeams('mock-container-id');
			await waitFor(() => expect(result.current.teams).toEqual(mockTeams));
			expect(result.current.isLoading).toBe(false);

			expect(result.current.error).toBeNull();
			expect(fireOperationalEvent).toHaveBeenCalledWith(
				expect.any(Function),
				fetchConnectedTeamsSuccessEvent('mock-container-id'),
			);
		});

		it('should handle errors during fetch', async () => {
			const mockError = new Error('Failed to fetch');
			(teamsClient.getConnectedTeams as jest.Mock).mockRejectedValueOnce(mockError);

			const { result } = renderHook(() => useConnectedTeams());
			result.current.fetchConnectedTeams('mock-container-id-fail');
			await waitFor(() => expect(result.current.error).toEqual(mockError));

			expect(result.current.isLoading).toBe(false);
			expect(result.current.teams).toEqual([]);
			expect(fireOperationalEvent).toHaveBeenCalledWith(
				expect.any(Function),
				fetchConnectedTeamsFailedEvent('mock-container-id-fail'),
			);
		});
	});

	ffTest.on('ptc-enable-teams-public-analytics-refactor', 'true', () => {
		it('should fetch and set number of connected teams successfully', async () => {
			(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValueOnce(2);

			const { result } = renderHook(() => useConnectedTeams());

			result.current.fetchNumberOfConnectedTeams('mock-container-id');
			await waitFor(() => expect(result.current.numberOfTeams).toEqual(2));
			expect(result.current.isLoading).toBe(false);

			expect(result.current.error).toBeNull();
			const event = fetchNumberOfConnectedTeamsSuccessEvent('mock-container-id');
			expect(fireEventNext).toHaveBeenCalledWith(
				`operational.${event.actionSubject}.${event.action}`,
				event.attributes,
			);
		});

		it('should fetch and set connected teams successfully', async () => {
			const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
			(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValueOnce(mockTeams);

			const { result } = renderHook(() => useConnectedTeams());

			result.current.fetchConnectedTeams('mock-container-id');
			await waitFor(() => expect(result.current.teams).toEqual(mockTeams));
			expect(result.current.isLoading).toBe(false);

			expect(result.current.error).toBeNull();
			const event = fetchConnectedTeamsSuccessEvent('mock-container-id');
			expect(fireEventNext).toHaveBeenCalledWith(
				`operational.${event.actionSubject}.${event.action}`,
				event.attributes,
			);
		});

		it('should handle errors during fetch', async () => {
			const mockError = new Error('Failed to fetch');
			(teamsClient.getConnectedTeams as jest.Mock).mockRejectedValueOnce(mockError);

			const { result } = renderHook(() => useConnectedTeams());
			result.current.fetchConnectedTeams('mock-container-id-fail');
			await waitFor(() => expect(result.current.error).toEqual(mockError));

			expect(result.current.isLoading).toBe(false);
			expect(result.current.teams).toEqual([]);
			const event = fetchConnectedTeamsFailedEvent('mock-container-id-fail');
			expect(fireEventNext).toHaveBeenCalledWith(
				`operational.${event.actionSubject}.${event.action}`,
				event.attributes,
			);
		});
	});
});

ffTest.off('ptc-enable-teams-public-analytics-refactor', 'false', () => {
	describe('useTeamContainersHook', () => {
		const fireAnalytics = jest.fn();
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should fetch connectedTeams successfully', async () => {
			const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
			(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValueOnce(mockTeams);
			const { result } = renderHook(() => useTeamContainersHook());

			result.current[1].fetchConnectedTeams('mock-container-id', fireAnalytics, fireEventNext);
			await waitFor(() =>
				expect(teamsClient.getConnectedTeams).toHaveBeenCalledWith('mock-container-id'),
			);

			expect(result.current[0].connectedTeams).toEqual({
				containerId: 'mock-container-id',
				isLoading: false,
				hasLoaded: true,
				teams: mockTeams,
				error: null,
				numberOfTeams: 2,
			});

			expect(fireAnalytics).toHaveBeenCalledWith({
				action: 'succeeded',
				actionSubject: 'fetchConnectedTeams',
				containerId: 'mock-container-id',
				numberOfTeams: 2,
			});
		});

		it('can refetch team containers', async () => {
			const fireAnalytics = jest.fn();
			let teamId = 'team-id-124';
			const error = new Error('Failed to fetch');

			(teamsClient.getTeamContainers as jest.Mock)
				.mockResolvedValueOnce([{ id: 'first' }])
				.mockResolvedValueOnce([{ id: 'second' }])
				.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useTeamContainersHook());

			await result.current[1].fetchTeamContainers(teamId, fireAnalytics, fireEventNext);
			expect(result.current[0].teamContainers).toEqual([{ id: 'first' }]);
			expect(fireAnalytics).toHaveBeenNthCalledWith(
				1,
				fetchTeamContainersSuccessEvent.action,
				fetchTeamContainersSuccessEvent.actionSubject,
			);

			await result.current[1].refetchTeamContainers(fireAnalytics, fireEventNext);
			expect(result.current[0].teamContainers).toEqual([{ id: 'second' }]);
			expect(fireAnalytics).toHaveBeenNthCalledWith(
				2,
				refetchTeamContainersSuccessEvent.action,
				refetchTeamContainersSuccessEvent.actionSubject,
			);

			//@note: running this test alone because react-sweet-state state can conflict when tests run together
			await result.current[1].refetchTeamContainers(fireAnalytics, fireEventNext);
			expect(fireAnalytics).toHaveBeenNthCalledWith(
				3,
				refetchTeamContainersFailedEvent.action,
				refetchTeamContainersFailedEvent.actionSubject,
				error,
			);
			expect(result.current[0].teamContainers).toEqual([{ id: 'second' }]);
		});
	});

	describe('useTeamContainersHook with cypher query v2', () => {
		const fireAnalytics = jest.fn();
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

			(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce([
				{ id: '2' },
				{ id: '3' },
			]);
			await result.current[1].fetchTeamContainers('team-id-126', fireAnalytics, fireEventNext);

			const containerId =
				MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

			await result.current[1].unlinkTeamContainers('team-id-126', containerId);

			expect(result.current[0].unlinkError).toBeNull();
			expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-126', containerId);
			expect(result.current[0].teamContainers.length).toEqual(1);
			expect(fireAnalytics).toHaveBeenCalledWith(
				fetchTeamContainersSuccessEvent.action,
				fetchTeamContainersSuccessEvent.actionSubject,
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
			await result.current[1].fetchTeamContainers('team-id-127', fireAnalytics, fireEventNext);

			const containerId =
				MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

			await result.current[1].unlinkTeamContainers('team-id-127', containerId);

			expect(result.current[0].unlinkError).toEqual(mockError);
			expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-127', containerId);
			expect(fireAnalytics).toHaveBeenCalledWith(
				fetchTeamContainersSuccessEvent.action,
				fetchTeamContainersSuccessEvent.actionSubject,
			);
		});
	});
});

ffTest.on('ptc-enable-teams-public-analytics-refactor', 'true', () => {
	describe('useTeamContainersHook', () => {
		const fireAnalytics = jest.fn();
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should fetch connectedTeams successfully', async () => {
			const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
			(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValue(mockTeams);
			const { result } = renderHook(() => useTeamContainersHook());

			result.current[1].fetchConnectedTeams('mock-container-id-v2', fireAnalytics, fireEventNext);
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

			expect(fireEventNext).toHaveBeenCalledWith(
				`operational.${event.actionSubject}.${event.action}`,
				event.attributes,
			);
		});

		it('can refetch team containers', async () => {
			const fireAnalytics = jest.fn();
			let teamId = 'team-id-124';
			const error = new Error('Failed to fetch');

			(teamsClient.getTeamContainers as jest.Mock)
				.mockResolvedValueOnce([{ id: 'first' }])
				.mockResolvedValueOnce([{ id: 'second' }])
				.mockRejectedValueOnce(error);

			const { result } = renderHook(() => useTeamContainersHook());

			await result.current[1].fetchTeamContainers(teamId, fireAnalytics, fireEventNext);
			expect(result.current[0].teamContainers).toEqual([{ id: 'first' }]);
			expect(fireEventNext).toHaveBeenNthCalledWith(
				1,
				`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
				{
					teamId: 'team-id-124',
				},
			);

			await result.current[1].refetchTeamContainers(fireAnalytics, fireEventNext);
			expect(result.current[0].teamContainers).toEqual([{ id: 'second' }]);
			expect(fireEventNext).toHaveBeenNthCalledWith(
				2,
				`operational.${refetchTeamContainersSuccessEvent.actionSubject}.${refetchTeamContainersSuccessEvent.action}`,
				{
					teamId: 'team-id-124',
				},
			);

			//@note: running this test alone because react-sweet-state state can conflict when tests run together
			await result.current[1].refetchTeamContainers(fireAnalytics, fireEventNext);
			expect(fireEventNext).toHaveBeenNthCalledWith(
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
		const fireAnalytics = jest.fn();
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

			(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce([
				{ id: '2' },
				{ id: '3' },
			]);
			await result.current[1].fetchTeamContainers('team-id-126', fireAnalytics, fireEventNext);

			const containerId =
				MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

			await result.current[1].unlinkTeamContainers('team-id-126', containerId);

			expect(result.current[0].unlinkError).toBeNull();
			expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-126', containerId);
			expect(result.current[0].teamContainers.length).toEqual(1);
			expect(fireEventNext).toHaveBeenCalledWith(
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
			await result.current[1].fetchTeamContainers('team-id-127', fireAnalytics, fireEventNext);

			const containerId =
				MOCK_TEAM_CONTAINERSV2.graphStore.cypherQueryV2.edges[0].node.columns[0].value.data.id;

			await result.current[1].unlinkTeamContainers('team-id-127', containerId);

			expect(result.current[0].unlinkError).toEqual(mockError);
			expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-127', containerId);
			expect(fireEventNext).toHaveBeenCalledWith(
				`operational.${fetchTeamContainersSuccessEvent.actionSubject}.${fetchTeamContainersSuccessEvent.action}`,
				{
					teamId: 'team-id-127',
				},
			);
		});
	});
});
