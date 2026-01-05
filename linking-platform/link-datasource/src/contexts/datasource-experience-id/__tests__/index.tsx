jest.mock('uuid', () => ({
	__esModule: true,
	v4: () => 'mock-uuid',
}));

import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react';

import { DatasourceExperienceIdProvider, useDatasourceExperienceId } from '../index';

const wrapper: RenderHookOptions<{ children: React.ReactNode }>['wrapper'] = ({ children }) => (
	<DatasourceExperienceIdProvider>{children}</DatasourceExperienceIdProvider>
);

describe('UserInteractionsProvider', () => {
	test('useDatasourceExperienceId returns a uuid when wrapped in a provider', () => {
		const { result } = renderHook(() => useDatasourceExperienceId(), {
			wrapper,
		});
		expect(result.current).toEqual('mock-uuid');
	});

	test('useDatasourceExperienceId throws if not wrapped in a provider', () => {
		expect(() => renderHook(() => useDatasourceExperienceId())).toThrow(new Error('useDatasourceExperienceId() must be wrapped in <DatasourceExperienceIdProvider>'));
	});
});
