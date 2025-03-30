import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import { teamsClient } from '../../../services';
import {
	MOCK_CONNECTED_TEAMS_RESULT,
	MOCK_TEAM_CONTAINERS,
} from '../../../services/agg-client/mocks';

import { useConnectedTeams, useTeamContainers, useTeamContainersHook } from './index';

jest.mock('../../../services', () => ({
	teamsClient: {
		getTeamContainers: jest.fn(),
		unlinkTeamContainer: jest.fn(),
		getConnectedTeams: jest.fn(),
		getNumberOfConnectedTeams: jest.fn(),
	},
}));

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

	it('should fetch and set team containers successfully', async () => {
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);

		const { result, waitForNextUpdate } = renderHook(() => useTeamContainers('team-id-124'));

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.teamContainers).toEqual(MOCK_TEAM_CONTAINERS);
		expect(result.current.error).toBeNull();
	});

	it('should handle errors during fetch', async () => {
		const mockError = new Error('Failed to fetch');
		(teamsClient.getTeamContainers as jest.Mock).mockRejectedValueOnce(mockError);

		const { result, waitForNextUpdate } = renderHook(() => useTeamContainers('team-id-125'));

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.teamContainers).toEqual([]);
		expect(result.current.error).toEqual(mockError);
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

	it('should fetch and set number of connected teams successfully', async () => {
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValueOnce(2);

		const { result } = renderHook(() => useConnectedTeams());

		act(() => {
			result.current.fetchNumberOfConnectedTeams('mock-container-id');
		});
		await waitFor(() => expect(result.current.numberOfTeams).toEqual(2));
		expect(result.current.isLoading).toBe(false);

		expect(result.current.error).toBeNull();
	});

	it('should fetch and set connected teams successfully', async () => {
		const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
		(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValueOnce(mockTeams);

		const { result } = renderHook(() => useConnectedTeams());

		act(() => {
			result.current.fetchConnectedTeams('mock-container-id');
		});
		await waitFor(() => expect(result.current.teams).toEqual(mockTeams));
		expect(result.current.isLoading).toBe(false);

		expect(result.current.error).toBeNull();
	});

	it('should handle errors during fetch', async () => {
		const mockError = new Error('Failed to fetch');
		(teamsClient.getConnectedTeams as jest.Mock).mockRejectedValueOnce(mockError);

		const { result } = renderHook(() => useConnectedTeams());
		act(() => {
			result.current.fetchConnectedTeams('mock-container-id-fail');
		});
		await waitFor(() => expect(result.current.error).toEqual(mockError));

		expect(result.current.isLoading).toBe(false);
		expect(result.current.teams).toEqual([]);
	});
});

describe('useTeamContainersHook', () => {
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

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce([{ id: '1' }, { id: '2' }]);
		await result.current[1].fetchTeamContainers('team-id-126', fireAnalytics);

		const containerId = MOCK_TEAM_CONTAINERS.graphStore.cypherQuery.edges[0].node.to.id;

		await result.current[1].unlinkTeamContainers('team-id-126', containerId);

		expect(result.current[0].unlinkError).toBeNull();
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-126', containerId);
		expect(result.current[0].teamContainers.length).toEqual(1);
		expect(fireAnalytics).toHaveBeenCalledWith('succeeded', 'fetchTeamContainers');
	});

	it('should skip fetching team containers if unlinking fails', async () => {
		const mockError = new Error('Failed to unlink');
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: {
				errors: [mockError],
			},
		});
		const { result } = renderHook(() => useTeamContainersHook());

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);
		await result.current[1].fetchTeamContainers('team-id-127', fireAnalytics);

		const containerId = MOCK_TEAM_CONTAINERS.graphStore.cypherQuery.edges[0].node.to.id;

		await result.current[1].unlinkTeamContainers('team-id-127', containerId);

		expect(result.current[0].unlinkError).toEqual(mockError);
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-127', containerId);
		expect(fireAnalytics).toHaveBeenCalledWith('succeeded', 'fetchTeamContainers');
	});

	it('should fetch connectedTeams successfully', async () => {
		const mockTeams = [MOCK_CONNECTED_TEAMS_RESULT];
		(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValueOnce(mockTeams);
		const { result } = renderHook(() => useTeamContainersHook());

		act(() => {
			result.current[1].fetchConnectedTeams('mock-container-id', fireAnalytics);
		});
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
});
