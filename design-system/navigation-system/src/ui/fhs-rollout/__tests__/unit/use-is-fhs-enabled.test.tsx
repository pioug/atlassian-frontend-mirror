import React from 'react';

import { renderHook } from '@atlassian/testing-library/render-hook';

import { IsFhsEnabledContext } from '../../is-fhs-enabled-context';
import { IsFhsEnabledProvider } from '../../is-fhs-enabled-provider';
import { useIsFhsEnabled } from '../../use-is-fhs-enabled';

describe('useIsFhsEnabled', () => {
	it('should return false when no provider is set', () => {
		const utils = renderHook(useIsFhsEnabled);

		expect(utils.current).toBe(false);
	});

	it.each([[false], [true]])('should return false when provider is set with %s', (value) => {
		const utils = renderHook(useIsFhsEnabled, {
			wrapper: ({ children }) => (
				<IsFhsEnabledProvider value={value}>{children}</IsFhsEnabledProvider>
			),
		});

		expect(utils.current).toBe(false);
	});

	it('should return false when the context is provided directly', () => {
		const utils = renderHook(useIsFhsEnabled, {
			wrapper: ({ children }) => (
				<IsFhsEnabledContext.Provider value={() => true}>{children}</IsFhsEnabledContext.Provider>
			),
		});

		expect(utils.current).toBe(false);
	});
});
