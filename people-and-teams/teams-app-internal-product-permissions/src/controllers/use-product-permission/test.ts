import { renderHook } from '@testing-library/react';

import { useProductPermissions } from './main';
import { useProductPermissionsStore } from './product-permission';
import { hasProductPermission } from './utils';

jest.mock('./product-permission/main');
const mockUseProductPermissionsStore = useProductPermissionsStore as jest.Mock;
const mockGetPermissions = jest.fn();

describe('hasProductPermission', () => {
	it('should return false if the product does not exist in permissions', () => {
		const permissions = {};
		expect(hasProductPermission(permissions, 'jira')).toBe(false);
	});

	it('should return true if no permissionIds are provided and at least one permission is true', () => {
		const permissions = {
			jira: {
				write: true,
				read: false,
			},
		};
		expect(hasProductPermission(permissions, 'jira')).toBe(true);
	});

	it('should return false if no permissionIds are provided and all permissions are false', () => {
		const permissions = {
			jira: {
				write: false,
				read: false,
			},
		};
		expect(hasProductPermission(permissions, 'jira')).toBe(false);
	});

	it('should return true if at least one of the provided permissionIds is true', () => {
		const permissions = {
			jira: {
				write: false,
				read: true,
			},
		};
		expect(hasProductPermission(permissions, 'jira', ['read'])).toBe(true);
	});

	it('should return false if none of the provided permissionIds are true', () => {
		const permissions = {
			jira: {
				write: false,
				read: false,
			},
		};
		expect(hasProductPermission(permissions, 'jira', ['read'])).toBe(false);
	});

	it('should return correct permissions for each product', () => {
		const permissions = {
			jira: {
				write: false,
				read: false,
			},
			loom: {
				write: true,
				read: true,
			},
		};
		expect(hasProductPermission(permissions, 'jira', ['read'])).toBe(false);
		expect(hasProductPermission(permissions, 'loom', ['read'])).toBe(true);
	});
});

describe('useProductPermissions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseProductPermissionsStore.mockReturnValue([
			{ isLoading: true, permissions: {}, error: undefined },
			{ getPermissions: mockGetPermissions },
		]);
	});

	it('should call getPermissions with provided arguments and default permissions on initial render', () => {
		const userId = 'user-1';
		const cloudId = 'cloud-1';

		renderHook(() => useProductPermissions({ userId, cloudId }));

		expect(mockGetPermissions).toHaveBeenCalledWith({
			cloudId,
			userId,
			enabled: true,
			permissionsToCheck: {
				jira: ['manage', 'write'],
				confluence: ['manage', 'write'],
				loom: ['manage', 'write'],
			},
		});
	});

	it('should call getPermissions with provided permissionsToCheck', () => {
		const userId = 'user-1';
		const cloudId = 'cloud-1';
		const permissionsToCheck = { jira: ['manage'] };

		renderHook(() => useProductPermissions({ userId, cloudId, permissionsToCheck }));

		expect(mockGetPermissions).toHaveBeenCalledWith({
			cloudId,
			userId,
			enabled: true,
			permissionsToCheck,
		});
	});

	it('should pass enabled: false to getPermissions when options.enabled is false', () => {
		const userId = 'user-1';
		const cloudId = 'cloud-1';

		renderHook(() => useProductPermissions({ userId, cloudId, options: { enabled: false } }));

		expect(mockGetPermissions).toHaveBeenCalledWith({
			cloudId,
			userId,
			enabled: false,
			permissionsToCheck: {
				jira: ['manage', 'write'],
				confluence: ['manage', 'write'],
				loom: ['manage', 'write'],
			},
		});
	});

	it('should return the state from useProductPermissionsStore', () => {
		const state = {
			isLoading: false,
			permissions: { jira: { write: true } },
			error: new Error('test error'),
		};
		mockUseProductPermissionsStore.mockReturnValue([state, { getPermissions: mockGetPermissions }]);

		const { result } = renderHook(() =>
			useProductPermissions({ userId: 'user-1', cloudId: 'cloud-1' }),
		);

		expect(result.current.loading).toBe(state.isLoading);
		expect(result.current.data).toBe(state.permissions);
		expect(result.current.error).toBe(state.error);
	});

	it('should not refetch if dependencies do not change', () => {
		const userId = 'user-1';
		const cloudId = 'cloud-1';

		const { rerender } = renderHook(() => useProductPermissions({ userId, cloudId }));

		expect(mockGetPermissions).toHaveBeenCalledTimes(1);

		rerender();

		expect(mockGetPermissions).toHaveBeenCalledTimes(1);
	});

	it('should refetch if userId changes', () => {
		let userId = 'user-1';
		const cloudId = 'cloud-1';

		const { rerender } = renderHook(({ userId }) => useProductPermissions({ userId, cloudId }), {
			initialProps: { userId },
		});

		expect(mockGetPermissions).toHaveBeenCalledTimes(1);

		userId = 'user-2';
		rerender({ userId });

		expect(mockGetPermissions).toHaveBeenCalledTimes(2);
		expect(mockGetPermissions).toHaveBeenLastCalledWith(
			expect.objectContaining({
				userId: 'user-2',
			}),
		);
	});
});
