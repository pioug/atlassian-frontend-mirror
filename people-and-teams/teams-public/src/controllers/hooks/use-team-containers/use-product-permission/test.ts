import { renderHook } from '@testing-library/react-hooks';

import { useProductPermissionsStore } from '../../../product-permission/main';

import { useProductPermissions } from './index';

jest.mock('../../../product-permission/main', () => ({
	useProductPermissionsStore: jest.fn(),
}));

describe('useProductPermissionsService', () => {
	let mockUseProductPermissionsStore: jest.Mock;
	let mockGetPermissions: jest.Mock;

	beforeEach(() => {
		mockUseProductPermissionsStore = useProductPermissionsStore as jest.Mock;
		mockGetPermissions = jest.fn();

		mockUseProductPermissionsStore.mockReturnValue([
			{ isLoading: false, permissions: [], error: null },
			{ getPermissions: mockGetPermissions },
		]);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return loading state', () => {
		mockUseProductPermissionsStore.mockReturnValueOnce([
			{ isLoading: true, permissions: [], error: null },
			{ getPermissions: mockGetPermissions },
		]);

		const { result } = renderHook(() =>
			useProductPermissions('user-id', 'cloud-id', 'write', { enabled: true }),
		);

		expect(result.current.loading).toBe(true);
	});

	test('should return error state', () => {
		const error = new Error('Failed to fetch permissions');
		mockUseProductPermissionsStore.mockReturnValueOnce([
			{ isLoading: false, permissions: [], error },
			{ getPermissions: mockGetPermissions },
		]);

		const { result } = renderHook(() =>
			useProductPermissions('user-id', 'cloud-id', 'write', { enabled: true }),
		);

		expect(result.current.error).toBe(error);
	});
});
