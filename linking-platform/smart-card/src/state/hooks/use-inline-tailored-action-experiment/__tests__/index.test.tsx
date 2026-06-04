import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from "@atlassian/feature-flags-test-utils";
import { renderHook } from '@atlassian/testing-library';

import useInlineTailoredActionExperiment from '../index';

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
			<SmartCardProvider rovoOptions={rovoOptions} storeOptions={storeOptions}>
				{children}
			</SmartCardProvider>
		);
	};

describe('useInlineTailoredActionExperiment', () => {
	it('returns isEnabled=false when rovo is disabled', () => {
		const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
			wrapper: wrapper(disabledRovoOptions),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when extensionKey is figma-object-provider', () => {
		const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'figma-object-provider'),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when showHoverPreview is false', () => {
		const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl, false), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when supportedFeature does not include RovoActions', () => {
		const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl, true), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', []),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	ffTest.on('platform_sl_3p_auth_inline_tailored_cta_killswitch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_inline_tailored_cta', 'inline action nudge experiment')
			.variant(true, () => {
				it('returns isEnabled=true when rovo is enabled and experiment is on', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for eligible extensionKeys', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'onedrive-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for google-object-provider', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'google-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=false when actionOptions.rovoChatAction.optIn is not true', () => {
					const result = renderHook(
						() =>
							useInlineTailoredActionExperiment(mockUrl, true, {
								hide: false,
								rovoChatAction: { optIn: false },
							}),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when actionOptions is not provided', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl, true), {
						wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
					});
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when rovo is disabled even with experiment on', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
						wrapper: wrapper(disabledRovoOptions),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});

		eeTest
			.describe('platform_sl_3p_auth_inline_tailored_cta', 'inline action nudge experiment off')
			.variant(false, () => {
				it('returns isEnabled=false when experiment is off', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
						wrapper: wrapper(),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});
	})

	ffTest.off('platform_sl_3p_auth_inline_tailored_cta_killswitch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_inline_tailored_cta', 'inline action nudge experiment')
			.variant(true, () => {
				it('returns isEnabled=false when rovo is enabled and experiment is on', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false for eligible extensionKeys', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'onedrive-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false for google-object-provider', () => {
					const result = renderHook(
						() => useInlineTailoredActionExperiment(mockUrl, true, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'google-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when actionOptions.rovoChatAction.optIn is not true', () => {
					const result = renderHook(
						() =>
							useInlineTailoredActionExperiment(mockUrl, true, {
								hide: false,
								rovoChatAction: { optIn: false },
							}),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when actionOptions is not provided', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl, true), {
						wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
					});
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when rovo is disabled even with experiment on', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
						wrapper: wrapper(disabledRovoOptions),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});

		eeTest
			.describe('platform_sl_3p_auth_inline_tailored_cta', 'inline action nudge experiment off')
			.variant(false, () => {
				it('returns isEnabled=false when experiment is off', () => {
					const result = renderHook(() => useInlineTailoredActionExperiment(mockUrl), {
						wrapper: wrapper(),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});
	})
});
