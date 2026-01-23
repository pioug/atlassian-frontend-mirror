import { teamsClient } from '@atlaskit/teams-client';
import { renderHook, waitFor } from '@atlassian/testing-library';


import { MOCK_CONNECTED_TEAMS_RESULT } from './mocks';
import { useConnectedTeams, useTeamContainers } from './multi-team';

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

describe('useTeamContainers (multi-team)', () => {
	const teamId1 = 'team-id-123';
	const mockContainers1 = [
		{
			id: 'container-1',
			type: 'ConfluenceSpace' as const,
			name: 'Confluence Space 1',
			icon: null,
			link: 'https://example.com/confluence1',
		},
	];
	const mockContainers2 = [
		{
			id: 'container-2',
			type: 'JiraProject' as const,
			name: 'Jira Project 2',
			icon: null,
			link: 'https://example.com/jira2',
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue(mockContainers1);
	});

	it('should initialize with empty containers for a new team', () => {
		const hookResult = renderHook(() => useTeamContainers(teamId1, false));

		expect(hookResult.current.loading).toBe(false);
		expect(hookResult.current.teamContainers).toEqual([]);
		expect(hookResult.current.hasLoaded).toBe(false);
		expect(hookResult.current.error).toBeNull();
		expect(hookResult.current.teamId).toBeNull();
		expect(hookResult.current.unlinkError).toBeNull();
	});

	it('should fetch and set team containers successfully', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-success-1';
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});
		expect(hookResult.current.loading).toBe(false);
		expect(hookResult.current.teamContainers).toEqual(mockContainers1);
		expect(hookResult.current.error).toBeNull();
		expect(hookResult.current.teamId).toBe(uniqueTeamId);
	});

	it('should handle errors during fetch', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-error-2';
		const mockError = new Error('Failed to fetch');
		(teamsClient.getTeamContainers as jest.Mock).mockRejectedValueOnce(mockError);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});
		expect(hookResult.current.loading).toBe(false);
		expect(hookResult.current.error).toEqual(mockError);
		expect(hookResult.current.teamContainers).toEqual([]);
	});

	it('should maintain separate state for multiple teams', async () => {
		// Use unique teamIds to avoid state from previous tests
		const uniqueTeamId1 = 'team-id-multi-1-3';
		const uniqueTeamId2 = 'team-id-multi-2-4';
		(teamsClient.getTeamContainers as jest.Mock)
			.mockResolvedValueOnce(mockContainers1)
			.mockResolvedValueOnce(mockContainers2);

		// Fetch for team 1
		const hookResult1 = renderHook(() => useTeamContainers(uniqueTeamId1));
		await waitFor(() => {
			expect(hookResult1.current.teamContainers).toEqual(mockContainers1);
		});
		expect(hookResult1.current.teamId).toBe(uniqueTeamId1);

		// Fetch for team 2
		const hookResult2 = renderHook(() => useTeamContainers(uniqueTeamId2));
		await waitFor(() => {
			expect(hookResult2.current.teamContainers).toEqual(mockContainers2);
		});
		expect(hookResult2.current.teamId).toBe(uniqueTeamId2);

		// Verify team 1's state is still intact
		expect(hookResult1.current.teamContainers).toEqual(mockContainers1);
		expect(hookResult1.current.teamId).toBe(uniqueTeamId1);
	});

	it('should not fetch if team is already loaded', async () => {
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);

		const hookResult = renderHook(() => useTeamContainers(teamId1));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		// Clear mocks and re-render with same teamId
		jest.clearAllMocks();
		const hookResult2 = renderHook(() => useTeamContainers(teamId1));

		// Should not fetch again
		expect(teamsClient.getTeamContainers).not.toHaveBeenCalled();
		expect(hookResult2.current.teamContainers).toEqual(mockContainers1);
	});

	it('should not fetch if team is currently loading', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-loading-5';
		let resolvePromise: (value: any) => void;
		const pendingPromise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		(teamsClient.getTeamContainers as jest.Mock).mockReturnValueOnce(pendingPromise);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		// Wait for loading to start
		await waitFor(() => {
			expect(hookResult.current.loading).toBe(true);
		});

		// Try to fetch again while loading
		jest.clearAllMocks();
		const hookResult2 = renderHook(() => useTeamContainers(uniqueTeamId));

		// Should not fetch again and should show loading state
		expect(teamsClient.getTeamContainers).not.toHaveBeenCalled();
		expect(hookResult2.current.loading).toBe(true);

		// Resolve the pending promise
		resolvePromise!(mockContainers1);
		await waitFor(() => {
			expect(hookResult2.current.loading).toBe(false);
		});
	});

	it('should refetch team containers', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-refetch-6';
		(teamsClient.getTeamContainers as jest.Mock)
			.mockResolvedValueOnce(mockContainers1)
			.mockResolvedValueOnce(mockContainers2);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.teamContainers).toEqual(mockContainers1);
		});

		await hookResult.current.refetchTeamContainers();

		await waitFor(() => {
			expect(hookResult.current.teamContainers).toEqual(mockContainers2);
		});
	});

	it('should add team container', async () => {
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);

		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-add-7';
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		const newContainer = {
			id: 'container-new',
			type: 'ConfluenceSpace' as const,
			name: 'New Container',
			icon: null,
			link: 'https://example.com/new',
		};

		hookResult.current.addTeamContainer(newContainer);

		await waitFor(() => {
			expect(hookResult.current.teamContainers).toHaveLength(2);
		});
		expect(hookResult.current.teamContainers).toContainEqual(newContainer);
	});

	it('should not add duplicate container', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-duplicate-8';
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		const existingContainer = mockContainers1[0];

		hookResult.current.addTeamContainer(existingContainer);

		await waitFor(() => {
			expect(hookResult.current.teamContainers).toHaveLength(1);
		});
	});

	it('should unlink team container', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-unlink-9';
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: { errors: [] },
		});

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		await hookResult.current.unlinkTeamContainers('container-1');

		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith(uniqueTeamId, 'container-1');
		await waitFor(() => {
			expect(hookResult.current.teamContainers).toEqual([]);
		});
	});

	it('should handle unlink error', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-unlink-error-10';
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(mockContainers1);
		const mockError = { message: 'Unlink failed', code: 'ERROR' };
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: { errors: [mockError] },
		});

		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId));

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		await hookResult.current.unlinkTeamContainers('container-1');

		await waitFor(() => {
			expect(hookResult.current.unlinkError).toEqual(mockError);
		});
	});

	it('should not show another team containers when switching teams', async () => {
		// Use unique teamIds to avoid state from previous tests
		const uniqueTeamId1 = 'team-id-switch-1-11';
		const uniqueTeamId2 = 'team-id-switch-2-12';
		// Reset mock to ensure clean state
		(teamsClient.getTeamContainers as jest.Mock).mockReset();
		(teamsClient.getTeamContainers as jest.Mock)
			.mockResolvedValueOnce(mockContainers1)
			.mockResolvedValueOnce(mockContainers2);

		// Fetch for team 1
		const hookResult1 = renderHook((teamId: string) => useTeamContainers(teamId), {
			args: [uniqueTeamId1],
		});
		await waitFor(() => {
			expect(hookResult1.current.teamContainers).toEqual(mockContainers1);
		});
		expect(hookResult1.current.teamId).toBe(uniqueTeamId1);

		// Switch to team 2
		hookResult1.update(uniqueTeamId2);
		// After switching, wait for containers to be cleared
		// The hook should immediately show empty containers for the new team
		await waitFor(() => {
			// Should show empty containers (either initial state or cleared state)
			expect(hookResult1.current.teamContainers.length).toBe(0);
		});

		// Wait for team 2's containers to load
		// The loading state might be true briefly, or the fetch might complete very quickly
		await waitFor(() => {
			expect(hookResult1.current.teamContainers).toEqual(mockContainers2);
		});
		expect(hookResult1.current.teamId).toBe(uniqueTeamId2);
	});

	it('should handle race condition when teamId changes quickly', async () => {
		// Use unique teamIds to avoid state from previous tests
		const uniqueTeamId1 = 'team-id-race-1-13';
		const uniqueTeamId2 = 'team-id-race-2-14';
		let resolveTeam1: (value: any) => void;
		let resolveTeam2: (value: any) => void;

		const promise1 = new Promise((resolve) => {
			resolveTeam1 = resolve;
		});
		const promise2 = new Promise((resolve) => {
			resolveTeam2 = resolve;
		});

		// Reset mock to ensure clean state
		(teamsClient.getTeamContainers as jest.Mock).mockReset();
		(teamsClient.getTeamContainers as jest.Mock)
			.mockReturnValueOnce(promise1)
			.mockReturnValueOnce(promise2);

		const hookResult = renderHook((teamId: string) => useTeamContainers(teamId), {
			args: [uniqueTeamId1],
		});

		// Start fetch for team 1 - wait a bit for the fetch to start and loading to be set
		await waitFor(() => {
			expect(hookResult.current.loading).toBe(true);
		});

		// Switch to team 2 before team 1 completes
		hookResult.update(uniqueTeamId2);
		// After switching, wait for state to update to show loading for team 2
		await waitFor(() => {
			expect(hookResult.current.loading).toBe(true);
		});
		await waitFor(() => {
			expect(hookResult.current.teamContainers.length).toBe(0);
		});

		// Resolve team 1's fetch (should be ignored)
		resolveTeam1!(mockContainers1);
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Resolve team 2's fetch (should be used)
		resolveTeam2!(mockContainers2);
		await waitFor(() => {
			expect(hookResult.current.teamContainers).toEqual(mockContainers2);
		});
		expect(hookResult.current.teamId).toBe(uniqueTeamId2);
	});

	it('should not fetch when enable is false', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-unique-15';
		const hookResult = renderHook(() => useTeamContainers(uniqueTeamId, false));

		// Wait a bit to ensure no fetch happens
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(teamsClient.getTeamContainers).not.toHaveBeenCalled();
		expect(hookResult.current.loading).toBe(false);
		expect(hookResult.current.teamContainers).toEqual([]);
	});
});

describe('useConnectedTeams (multi-team)', () => {
	const teamId1 = 'team-id-123';
	const containerId1 = 'container-1';
	const containerId2 = 'container-2';

	beforeEach(() => {
		jest.clearAllMocks();
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValue(2);
		(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValue(MOCK_CONNECTED_TEAMS_RESULT);
	});

	it('should initialize with default connected teams state', () => {
		const hookResult = renderHook(() => useConnectedTeams(teamId1));

		expect(hookResult.current.containerId).toBeUndefined();
		expect(hookResult.current.isLoading).toBe(false);
		expect(hookResult.current.hasLoaded).toBe(false);
		expect(hookResult.current.teams).toBeUndefined();
		expect(hookResult.current.error).toBeNull();
		expect(hookResult.current.numberOfTeams).toBeUndefined();
	});

	it('should fetch number of connected teams', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-fetch-number-16';
		// Initialize team state first - reset and set up fresh
		(teamsClient.getTeamContainers as jest.Mock).mockReset();
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValue(5);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchNumberOfConnectedTeams(containerId1);

		expect(teamsClient.getNumberOfConnectedTeams).toHaveBeenCalledWith(containerId1);
		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});
		expect(hookResult.current.containerId).toBe(containerId1);
		expect(hookResult.current.numberOfTeams).toBe(5);
	});

	it('should fetch connected teams', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-fetch-teams-17';
		// Initialize team state first - reset and set up fresh
		(teamsClient.getTeamContainers as jest.Mock).mockReset();
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getConnectedTeams as jest.Mock).mockResolvedValue(MOCK_CONNECTED_TEAMS_RESULT);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchConnectedTeams(containerId1);

		expect(teamsClient.getConnectedTeams).toHaveBeenCalledWith(containerId1);
		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});
		expect(hookResult.current.containerId).toBe(containerId1);
		expect(hookResult.current.teams).toEqual(MOCK_CONNECTED_TEAMS_RESULT);
		expect(hookResult.current.isLoading).toBe(false);
	});

	it('should maintain separate connected teams state for multiple teams', async () => {
		// Use unique teamIds to avoid state from previous tests
		const uniqueTeamId1 = 'team-id-connected-1-18';
		const uniqueTeamId2 = 'team-id-connected-2-19';
		// Initialize team states first
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getNumberOfConnectedTeams as jest.Mock)
			.mockResolvedValueOnce(3)
			.mockResolvedValueOnce(7);

		// Initialize team 1 state
		const containersResult1 = renderHook(() => useTeamContainers(uniqueTeamId1));
		await waitFor(() => {
			expect(containersResult1.current.hasLoaded).toBe(true);
		});

		// Fetch for team 1
		const hookResult1 = renderHook(() => useConnectedTeams(uniqueTeamId1));

		await hookResult1.current.fetchNumberOfConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult1.current.hasLoaded).toBe(true);
		});
		expect(hookResult1.current.numberOfTeams).toBe(3);
		expect(hookResult1.current.containerId).toBe(containerId1);

		// Initialize team 2 state
		const containersResult2 = renderHook(() => useTeamContainers(uniqueTeamId2));
		await waitFor(() => {
			expect(containersResult2.current.hasLoaded).toBe(true);
		});

		// Fetch for team 2
		const hookResult2 = renderHook(() => useConnectedTeams(uniqueTeamId2));

		await hookResult2.current.fetchNumberOfConnectedTeams(containerId2);

		await waitFor(() => {
			expect(hookResult2.current.hasLoaded).toBe(true);
		});
		expect(hookResult2.current.numberOfTeams).toBe(7);
		expect(hookResult2.current.containerId).toBe(containerId2);

		// Verify team 1's state is still intact
		expect(hookResult1.current.numberOfTeams).toBe(3);
		expect(hookResult1.current.containerId).toBe(containerId1);
	});

	it('should not fetch if containerId is the same', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-same-container-20';
		// Initialize team state first - use mockResolvedValue to ensure it's always available
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockResolvedValue(2);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		// Wait for the fetch to complete
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchNumberOfConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult.current.numberOfTeams).toBe(2);
		});

		jest.clearAllMocks();

		await hookResult.current.fetchNumberOfConnectedTeams(containerId1);

		// Should not fetch again
		expect(teamsClient.getNumberOfConnectedTeams).not.toHaveBeenCalled();
	});

	it('should not fetch connected teams if already loaded for same container', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-already-loaded-21';
		// Initialize team state first
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult.current.hasLoaded).toBe(true);
		});

		jest.clearAllMocks();

		await hookResult.current.fetchConnectedTeams(containerId1);

		// Should not fetch again
		expect(teamsClient.getConnectedTeams).not.toHaveBeenCalled();
	});

	it('should handle fetch error for connected teams', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-error-teams-22';
		// Initialize team state first
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		const mockError = new Error('Failed to fetch');
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getConnectedTeams as jest.Mock).mockRejectedValue(mockError);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult.current.error).toEqual(mockError);
		});
		expect(hookResult.current.hasLoaded).toBe(false);
		expect(hookResult.current.teams).toEqual([]);
	});

	it('should handle fetch error for number of connected teams', async () => {
		// Use a unique teamId to avoid state from previous tests
		const uniqueTeamId = 'team-id-error-number-23';
		// Initialize team state first - ensure mock is set before any calls
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		const mockError = new Error('Failed to fetch');
		// Clear any previous mocks from beforeEach and set up fresh
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockReset();
		(teamsClient.getNumberOfConnectedTeams as jest.Mock).mockRejectedValue(mockError);

		// Initialize team state
		const containersResult = renderHook(() => useTeamContainers(uniqueTeamId));
		await waitFor(() => {
			expect(containersResult.current.hasLoaded).toBe(true);
		});

		const hookResult = renderHook(() => useConnectedTeams(uniqueTeamId));

		await hookResult.current.fetchNumberOfConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult.current.error).toEqual(mockError);
		});
		expect(hookResult.current.containerId).toBe(containerId1);
	});

	it('should return connected teams for specific team only', async () => {
		// Use unique teamIds to avoid state from previous tests
		const uniqueTeamId1 = 'team-id-specific-1-24';
		const uniqueTeamId2 = 'team-id-specific-2-25';
		const emptyTeamsResult: typeof MOCK_CONNECTED_TEAMS_RESULT = [];
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValue([]);
		(teamsClient.getConnectedTeams as jest.Mock)
			.mockResolvedValueOnce(MOCK_CONNECTED_TEAMS_RESULT)
			.mockResolvedValueOnce(emptyTeamsResult);

		// Initialize team 1 state by fetching containers first
		const containersResult1 = renderHook(() => useTeamContainers(uniqueTeamId1));
		await waitFor(() => {
			expect(containersResult1.current.hasLoaded).toBe(true);
		});

		// Fetch for team 1
		const hookResult1 = renderHook(() => useConnectedTeams(uniqueTeamId1));

		await hookResult1.current.fetchConnectedTeams(containerId1);

		await waitFor(() => {
			expect(hookResult1.current.hasLoaded).toBe(true);
		});
		expect(hookResult1.current.teams).toEqual(MOCK_CONNECTED_TEAMS_RESULT);
		expect(hookResult1.current.containerId).toBe(containerId1);

		// Initialize team 2 state by fetching containers first
		const containersResult2 = renderHook(() => useTeamContainers(uniqueTeamId2));
		await waitFor(() => {
			expect(containersResult2.current.hasLoaded).toBe(true);
		});

		// Fetch for team 2
		const hookResult2 = renderHook(() => useConnectedTeams(uniqueTeamId2));

		await hookResult2.current.fetchConnectedTeams(containerId2);

		await waitFor(() => {
			expect(hookResult2.current.hasLoaded).toBe(true);
		});
		expect(hookResult2.current.teams).toEqual(emptyTeamsResult);
		expect(hookResult2.current.containerId).toBe(containerId2);

		// Verify team 1's state is still intact
		expect(hookResult1.current.teams).toEqual(MOCK_CONNECTED_TEAMS_RESULT);
		expect(hookResult1.current.containerId).toBe(containerId1);
	});
});
