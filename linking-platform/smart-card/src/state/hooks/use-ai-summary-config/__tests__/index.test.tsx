import React from 'react';

import { renderHook } from '@testing-library/react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { useAISummaryConfig } from '../index';

describe('useAISummaryConfig', () => {
	it('returns AI summary config from SmartCardProvider', () => {
		const envKey = 'prod';
		const baseUrl = 'base-url';
		const product = 'JSM';

		const client = new CardClient(envKey, baseUrl);
		const { result } = renderHook(() => useAISummaryConfig(), {
			wrapper: ({ children }) => (
				<SmartCardProvider client={client} isAdminHubAIEnabled={true} product={product}>
					{children}
				</SmartCardProvider>
			),
		});

		expect(result.current).toEqual({
			baseUrl,
			envKey,
			product,
			isAdminHubAIEnabled: true,
		});
	});
});
