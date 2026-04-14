import React from 'react';

import { renderHook } from '@testing-library/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import useInlineActionNudgeExperiment from '../index';

const mockUrl = 'https://www.mockurl.com';

const enabledRovoOptions = { isRovoEnabled: true, isRovoLLMEnabled: true };
const disabledRovoOptions = { isRovoEnabled: false, isRovoLLMEnabled: false };

const makeDetails = (extensionKey: string) => ({
	meta: {
		auth: [],
		definitionId: 'd1',
		key: extensionKey,
		visibility: 'restricted' as const,
		access: 'granted' as const,
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
	): React.JSXElementConstructor<{ children: React.ReactNode }> =>
	({ children }) => {
		const storeOptions: CardProviderStoreOpts | undefined = extensionKey
			? {
					initialState: {
						[mockUrl]: {
							details: makeDetails(extensionKey) as any,
							status: 'resolved' as const,
						},
					},
				}
			: undefined;

		return (
			<SmartCardProvider rovoOptions={rovoOptions} storeOptions={storeOptions}>
				{children}
			</SmartCardProvider>
		);
	};

describe('useInlineActionNudgeExperiment', () => {
	it('returns isEnabled=false when rovo is disabled', () => {
		const { result } = renderHook(
			() => useInlineActionNudgeExperiment(mockUrl),
			{ wrapper: wrapper(disabledRovoOptions) },
		);
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when extensionKey is figma-object-provider', () => {
		const { result } = renderHook(
			() => useInlineActionNudgeExperiment(mockUrl),
			{ wrapper: wrapper(enabledRovoOptions, 'figma-object-provider') },
		);
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when extensionKey is google-object-provider', () => {
		const { result } = renderHook(
			() => useInlineActionNudgeExperiment(mockUrl),
			{ wrapper: wrapper(enabledRovoOptions, 'google-object-provider') },
		);
		expect(result.current.isEnabled).toBe(false);
	});

	eeTest
		.describe('rovogrowth_640_inline_action_nudge', 'inline action nudge experiment')
		.variant(true, () => {
			it('returns isEnabled=true when rovo is enabled and experiment is on', () => {
				const { result } = renderHook(
					() => useInlineActionNudgeExperiment(mockUrl),
					{ wrapper: wrapper() },
				);
				expect(result.current.isEnabled).toBe(true);
			});

			it('returns isEnabled=true for non-excluded extensionKeys', () => {
				const { result } = renderHook(
					() => useInlineActionNudgeExperiment(mockUrl),
					{ wrapper: wrapper(enabledRovoOptions, 'confluence-object-provider') },
				);
				expect(result.current.isEnabled).toBe(true);
			});

			it('returns isEnabled=false when rovo is disabled even with experiment on', () => {
				const { result } = renderHook(
					() => useInlineActionNudgeExperiment(mockUrl),
					{ wrapper: wrapper(disabledRovoOptions) },
				);
				expect(result.current.isEnabled).toBe(false);
			});
		});

	eeTest
		.describe('rovogrowth_640_inline_action_nudge', 'inline action nudge experiment off')
		.variant(false, () => {
			it('returns isEnabled=false when experiment is off', () => {
				const { result } = renderHook(
					() => useInlineActionNudgeExperiment(mockUrl),
					{ wrapper: wrapper() },
				);
				expect(result.current.isEnabled).toBe(false);
			});
		});
});
