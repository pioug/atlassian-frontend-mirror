import { renderHook, waitFor } from '@atlassian/testing-library';

jest.mock('../../../services/current-site-cloud-id', () => ({
	...jest.requireActual('../../../services/current-site-cloud-id'),
	getCurrentSiteCloudId: jest.fn(),
}));

import { getCurrentSiteCloudId } from '../../../services/current-site-cloud-id';
import useCurrentSiteCloudId from '../index';

const mockGetCurrentSiteCloudId = getCurrentSiteCloudId as jest.MockedFunction<
	typeof getCurrentSiteCloudId
>;

describe('useCurrentSiteCloudId', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockGetCurrentSiteCloudId.mockResolvedValue('tenant-123');
	});

	it('starts loading and resolves cloud id from service', async () => {
		const hookResult = renderHook(() => useCurrentSiteCloudId());

		expect(hookResult.current.isLoading).toBe(true);
		expect(hookResult.current.cloudId).toBeUndefined();

		await waitFor(() => {
			expect(hookResult.current.isLoading).toBe(false);
		});

		expect(hookResult.current.cloudId).toBe('tenant-123');
		expect(mockGetCurrentSiteCloudId).toHaveBeenCalledTimes(1);
	});

	it('stops loading when service resolves undefined', async () => {
		mockGetCurrentSiteCloudId.mockResolvedValueOnce(undefined);

		const hookResult = renderHook(() => useCurrentSiteCloudId());

		await waitFor(() => {
			expect(hookResult.current.isLoading).toBe(false);
		});

		expect(hookResult.current.cloudId).toBeUndefined();
		expect(mockGetCurrentSiteCloudId).toHaveBeenCalledTimes(1);
	});

});
