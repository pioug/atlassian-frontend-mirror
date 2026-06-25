import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider';
import type { ProductType } from '@atlaskit/linking-common';
import { renderHook } from '@atlassian/testing-library';

import useBlockCardRovoAction from '../index';

const mockUrl = 'https://www.mockurl.com';

const enabledRovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true };
const disabledRovoOptions = { isRovoEnabled: false, isRovoLLMEnabled: false };

const optedInActionOptions = { hide: false, rovoChatAction: { optIn: true } };

const makeDetails = (extensionKey: string, supportedFeature: string[] = ['RovoActions']) => ({
	meta: {
		auth: [],
		definitionId: 'd1',
		key: extensionKey,
		visibility: 'restricted' as const,
		access: 'granted' as const,
		supportedFeature,
	},
	data: {
		'@context': {
			'@vocab': 'https://www.w3.org/ns/activitystreams#',
			atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
			schema: 'http://schema.org/',
		},
		'@type': 'Object',
		name: 'test',
	},
});

const wrapper =
	(
		rovoOptions = enabledRovoOptions,
		extensionKey?: string,
		supportedFeature: string[] = ['RovoActions'],
		product?: ProductType,
	): React.JSXElementConstructor<{ children: React.ReactNode }> =>
	({ children }) => {
		const storeOptions: CardProviderStoreOpts | undefined = extensionKey
			? {
					initialState: {
						[mockUrl]: {
							details: makeDetails(extensionKey, supportedFeature) as any,
							status: 'resolved' as const,
						},
					},
				}
			: undefined;

		return (
			<SmartCardProvider rovoOptions={rovoOptions} storeOptions={storeOptions} product={product}>
				{children}
			</SmartCardProvider>
		);
	};

describe('useBlockCardRovoAction', () => {
	it('returns false when rovo is disabled', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl), {
			wrapper: wrapper(disabledRovoOptions),
		});
		expect(result.current).toBe(false);
	});

	it('returns false when extensionKey is figma-object-provider', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'figma-object-provider'),
		});
		expect(result.current).toBe(false);
	});

	it('returns isEnabled=false when supportedFeature does not include RovoActions', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', []),
		});
		expect(result.current).toBe(false);
	});

	it('returns true when rovo is enabled and experiment is on', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl, optedInActionOptions), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'CONFLUENCE'),
		});
		expect(result.current).toBe(true);
	});

	it('returns true for eligible extensionKeys', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl, optedInActionOptions), {
			wrapper: wrapper(enabledRovoOptions, 'onedrive-object-provider', undefined, 'CONFLUENCE'),
		});
		expect(result.current).toBe(true);
	});

	it('returns true for google-object-provider', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl, optedInActionOptions), {
			wrapper: wrapper(enabledRovoOptions, 'google-object-provider', undefined, 'CONFLUENCE'),
		});
		expect(result.current).toBe(true);
	});

	it('returns false when actionOptions.rovoChatAction.optIn is not true', () => {
		const result = renderHook(
			() =>
				useBlockCardRovoAction(mockUrl, {
					hide: false,
					rovoChatAction: { optIn: false },
				}),
			{
				wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
			},
		);
		expect(result.current).toBe(false);
	});

	it('returns false when actionOptions is not provided', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
		});
		expect(result.current).toBe(false);
	});

	it('returns false when product is not Confluence', () => {
		const result = renderHook(() => useBlockCardRovoAction(mockUrl, optedInActionOptions), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'JSM'),
		});
		expect(result.current).toBe(false);
	});
});
