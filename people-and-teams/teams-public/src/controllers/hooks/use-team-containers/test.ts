import { renderHook } from '@testing-library/react-hooks';

import { teamsClient } from '../../../services';
import { MOCK_TEAM_CONTAINERS } from '../../../services/agg-client/mocks';

import { useTeamContainers, useTeamContainersHook } from './index';

jest.mock('../../../services', () => ({
	teamsClient: {
		getTeamContainers: jest.fn(),
		unlinkTeamContainer: jest.fn(),
	},
}));

describe('useTeamContainers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should initialize with loading true and empty containers', () => {
		const { result } = renderHook(() => useTeamContainers('team-id-123'));

		expect(result.current.loading).toBe(true);
		expect(result.current.teamContainers).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	test('should fetch and set team containers successfully', async () => {
		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);

		const { result, waitForNextUpdate } = renderHook(() => useTeamContainers('team-id-123'));

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.teamContainers).toEqual(MOCK_TEAM_CONTAINERS);
		expect(result.current.error).toBeNull();
	});

	test('should handle errors during fetch', async () => {
		const mockError = new Error('Failed to fetch');
		(teamsClient.getTeamContainers as jest.Mock).mockRejectedValueOnce(mockError);

		const { result, waitForNextUpdate } = renderHook(() => useTeamContainers('team-id-123'));

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.teamContainers).toEqual([]);
		expect(result.current.error).toEqual(mockError);
	});
});

describe('useTeamContainersHook', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should unlink team containers successfully', async () => {
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: {
				errors: [],
			},
		});
		const { result } = renderHook(() => useTeamContainersHook());

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);
		await result.current[1].fetchTeamContainers('team-id-123');

		const containerId = MOCK_TEAM_CONTAINERS.graphStore.cypherQuery.edges[0].node.to.id;

		await result.current[1].unlinkTeamContainers('team-id-123', containerId);

		expect(result.current[0].unlinkError).toBeNull();
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-123', containerId);
		expect(teamsClient.getTeamContainers).toHaveBeenCalledWith('team-id-123');
	});

	test('should skip fetching team containers if unlinking fails', async () => {
		const mockError = new Error('Failed to unlink');
		(teamsClient.unlinkTeamContainer as jest.Mock).mockResolvedValueOnce({
			deleteTeamConnectedToContainer: {
				errors: [mockError],
			},
		});
		const { result } = renderHook(() => useTeamContainersHook());

		(teamsClient.getTeamContainers as jest.Mock).mockResolvedValueOnce(MOCK_TEAM_CONTAINERS);
		await result.current[1].fetchTeamContainers('team-id-123');

		const containerId = MOCK_TEAM_CONTAINERS.graphStore.cypherQuery.edges[0].node.to.id;

		await result.current[1].unlinkTeamContainers('team-id-123', containerId);

		expect(result.current[0].unlinkError).toEqual(mockError);
		expect(teamsClient.unlinkTeamContainer).toHaveBeenCalledWith('team-id-123', containerId);
		expect(teamsClient.getTeamContainers).toHaveBeenCalledTimes(1);
	});
});
