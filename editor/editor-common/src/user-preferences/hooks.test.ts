import { act, renderHook, waitFor } from '@testing-library/react';

import { useResolvedUserPreferences } from './hooks';
import type { PersistenceAPI } from './persistence-api';
import type { ResolvedUserPreferences } from './user-preferences';
import { UserPreferencesProvider } from './user-preferences-provider';

describe('createProseMirrorMetadata', () => {
	const defaultUserPreferences: ResolvedUserPreferences = {
		toolbarDockingPosition: 'none',
	};
	const loadUserPreferences = jest.fn().mockImplementation(() => {
		return Promise.resolve({
			toolbarDockingPosition: 'top',
		});
	});

	const updateUserPreference = jest.fn().mockImplementation((key, value) => {
		return new Promise((resolve) => {
			resolve({ [key]: value });
		});
	});

	const getInitialUserPreferences = jest.fn().mockImplementation(() => {
		return {
			toolbarDockingPosition: 'top',
		};
	});

	const persistenceAPI: PersistenceAPI = {
		loadUserPreferences,
		updateUserPreference,
	};

	it('can be initialized with the initial user preferences', async () => {
		const userPreferencesProvider = new UserPreferencesProvider(
			{ ...persistenceAPI, getInitialUserPreferences },
			defaultUserPreferences,
		);
		const { result } = renderHook(() => useResolvedUserPreferences(userPreferencesProvider));

		expect(userPreferencesProvider.isInitialized).toBe(true);
		expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'top' });
	});

	it('can be initialized with the loadUserPreferences', async () => {
		const userPreferencesProvider = new UserPreferencesProvider(
			persistenceAPI,
			defaultUserPreferences,
		);
		const { result } = renderHook(() =>
			useResolvedUserPreferences(userPreferencesProvider),
		);

		expect(userPreferencesProvider.isInitialized).toBe(false);
		expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'none' });
		await waitFor(() => {
			expect(userPreferencesProvider.isInitialized).toBe(true);
			expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'top' });
		});
	});

	it('userPreferencesProvider.updatePreference will trigger an update', async () => {
		const userPreferencesProvider = new UserPreferencesProvider(
			{ ...persistenceAPI, getInitialUserPreferences },
			defaultUserPreferences,
		);
		const { result } = renderHook(() =>
			useResolvedUserPreferences(userPreferencesProvider),
		);

		expect(userPreferencesProvider.isInitialized).toBe(true);
		expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'top' });
		userPreferencesProvider.updatePreference('toolbarDockingPosition', 'none');
		await waitFor(() => {	
			expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'none' });
		});
	});

	it('userPreferencesProvider.setDefaultPreferences will trigger an update', async () => {
		const userPreferencesProvider = new UserPreferencesProvider(
			{ ...persistenceAPI, getInitialUserPreferences: () => ({}) },
			defaultUserPreferences,
		);
		const { result } = renderHook(() =>
			useResolvedUserPreferences(userPreferencesProvider),
		);

		expect(userPreferencesProvider.isInitialized).toBe(true);
		expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'none' });

		await act(() => {
			userPreferencesProvider.setDefaultPreferences({ toolbarDockingPosition: 'top' });
		});
		expect(result.current.resolvedUserPreferences).toEqual({ toolbarDockingPosition: 'top' });
	});
});
