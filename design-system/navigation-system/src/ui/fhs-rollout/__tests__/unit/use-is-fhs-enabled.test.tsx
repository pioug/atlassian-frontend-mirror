import React from 'react';

import { renderHook } from '@testing-library/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { IsFhsEnabledProvider } from '../../is-fhs-enabled-provider';
import { useIsFhsEnabled } from '../../use-is-fhs-enabled';

// Mock the platform-feature-flags module
jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(),
}));

const fgMock = fg as jest.MockedFunction<typeof fg>;

describe('useIsFhsEnabled', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should use the default value when no provider is set', () => {
		renderHook(useIsFhsEnabled);

		// Should call the default function
		expect(fgMock).toHaveBeenCalledTimes(1);
		expect(fgMock).toHaveBeenCalledWith('navx-full-height-sidebar');
	});

	it.each([[false], [true]])(
		'should use the provided value when provider is set with %s',
		(value) => {
			const { result } = renderHook(useIsFhsEnabled, {
				wrapper: ({ children }) => (
					<IsFhsEnabledProvider value={value}>{children}</IsFhsEnabledProvider>
				),
			});

			// Should not call the default function
			expect(fgMock).not.toHaveBeenCalled();
			// Should return the provided value
			expect(result.current).toBe(value);
		},
	);
});
