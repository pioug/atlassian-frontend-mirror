import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { renderHook } from '@atlassian/testing-library';

import useRovoConfig from '../index';

describe('useRovoConfig', () => {
	it('returns Rovo config set on SmartCardProvider', () => {
		const result = renderHook(() => useRovoConfig(), {
			wrapper: ({ children }) => (
				<SmartCardProvider rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}>
					{children}
				</SmartCardProvider>
			),
		});

		expect(result.current).toEqual({ rovoOptions: { isRovoEnabled: true, isRovoLLMEnabled: true }, product: undefined });
	});

	it('returns undefined when Rovo config is not set on SmartCardProvider', () => {
		const result = renderHook(() => useRovoConfig(), {
			wrapper: ({ children }) => <SmartCardProvider>{children}</SmartCardProvider>,
		});

		expect(result.current.rovoOptions).toBeUndefined();
	});
});
