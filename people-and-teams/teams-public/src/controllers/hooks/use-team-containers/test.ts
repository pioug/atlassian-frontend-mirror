import { renderHook } from '@testing-library/react-hooks';

import { teamsClient } from '../../../services';
import { MOCK_TEAM_CONTAINERS } from '../../../services/agg-client/mocks';

import { useTeamContainers } from './index';

jest.mock('../../../services', () => ({
	teamsClient: {
		getTeamContainers: jest.fn(),
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
