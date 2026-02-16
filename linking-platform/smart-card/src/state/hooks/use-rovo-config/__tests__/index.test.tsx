import React from 'react';

import { renderHook } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';

import useRovoConfig from '../index';

describe('useRovoConfig', () => {
	it('returns Rovo config set on SmartCardProvider', () => {
		const { result } = renderHook(() => useRovoConfig(), {
			wrapper: ({ children }) => (
				<SmartCardProvider rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}>
					{children}
				</SmartCardProvider>
			),
		});

		expect(result.current).toEqual({ isRovoEnabled: true, isRovoLLMEnabled: true });
	});

	it('returns undefined when Rovo config is not set on SmartCardProvider', () => {
		const { result } = renderHook(() => useRovoConfig(), {
			wrapper: ({ children }) => <SmartCardProvider>{children}</SmartCardProvider>,
		});

		expect(result.current).toBeUndefined();
	});
});
