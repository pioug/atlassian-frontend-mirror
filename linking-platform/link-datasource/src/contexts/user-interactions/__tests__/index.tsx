import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react';

import { DatasourceAction } from '../../../analytics/types';
import { UserInteractionsProvider, useUserInteractions } from '../index';

const wrapper: RenderHookOptions<{ children: React.ReactNode }>['wrapper'] = ({ children }) => (
	<UserInteractionsProvider>{children}</UserInteractionsProvider>
);

describe('UserInteractionsProvider', () => {
	test('useUserInteractions returns an object to update and retrieve current actions when wrapped in a context', () => {
		const { result } = renderHook(() => useUserInteractions(), {
			wrapper,
		});
		expect(result.current.get()).toEqual([]);

		result.current.add(DatasourceAction.COLUMN_ADDED);
		result.current.add(DatasourceAction.COLUMN_ADDED);
		result.current.add(DatasourceAction.COLUMN_REMOVED);
		result.current.add(DatasourceAction.COLUMN_REMOVED);

		expect(result.current.get()).toEqual([
			DatasourceAction.COLUMN_ADDED,
			DatasourceAction.COLUMN_REMOVED,
		]);
	});

	test('useUserInteractions throws if the render is not wrapped in a Context', () => {
		expect(() => renderHook(() => useUserInteractions())).toThrow(
			new Error('useUserInteractions() must be wrapped in <UserInteractionsProvider>'),
		);
	});
});
