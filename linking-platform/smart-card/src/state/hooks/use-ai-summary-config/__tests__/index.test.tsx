import React from 'react';

import CardClient from '@atlaskit/link-provider/client';
import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import { renderHook } from '@atlassian/testing-library';

import { useAISummaryConfig } from '../index';

describe('useAISummaryConfig', () => {
	it('returns AI summary config from SmartCardProvider', () => {
		const envKey = 'prod';
		const baseUrl = 'base-url';
		const product = 'JSM';

		const client = new CardClient(envKey, baseUrl);
		const result = renderHook(() => useAISummaryConfig(), {
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
