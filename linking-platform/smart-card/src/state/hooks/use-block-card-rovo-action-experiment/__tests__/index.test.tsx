import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import type { CardProviderStoreOpts } from '@atlaskit/link-provider';
import type { ProductType } from '@atlaskit/linking-common';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import useBlockCardRovoActionExperiment from '../index';

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

describe('useBlockCardRovoActionExperiment', () => {
	it('returns isEnabled=false when rovo is disabled', () => {
		const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
			wrapper: wrapper(disabledRovoOptions),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when extensionKey is figma-object-provider', () => {
		const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'figma-object-provider'),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	it('returns isEnabled=false when supportedFeature does not include RovoActions', () => {
		const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
			wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', []),
		});
		expect(result.current.isEnabled).toBe(false);
	});

	eeTest
		.describe(
			'platform_sl_3p_auth_rovo_block_card_jira',
			'block card rovo action experiment jira on',
		)
		.variant(true, () => {
			ffTest.on('platform_sl_3p_auth_rovo_block_jira_kill_switch', '', () => {
				it('returns isEnabled=true when rovo is enabled, product is Jira and experiment is on', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'JSM'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for eligible extensionKeys', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'onedrive-object-provider', undefined, 'JSM'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for google-object-provider', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(enabledRovoOptions, 'google-object-provider', undefined, 'JSM'),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=false when actionOptions.rovoChatAction.optIn is not true', () => {
					const result = renderHook(
						() =>
							useBlockCardRovoActionExperiment(mockUrl, {
								hide: false,
								rovoChatAction: { optIn: false },
							}),
						{
							wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'JSM'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when actionOptions is not provided', () => {
					const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
						wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'JSM'),
					});
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when rovo is disabled even with experiment on', () => {
					const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
						wrapper: wrapper(disabledRovoOptions),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});

			eeTest
				.describe(
					'platform_sl_3p_auth_rovo_block_card_confluence',
					'block card rovo action experiment confluence off',
				)
				.variant(false, () => {
					it('returns isEnabled=false when product is not Jira even with experiment on', () => {
						const result = renderHook(
							() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
							{
								wrapper: wrapper(
									enabledRovoOptions,
									'slack-object-provider',
									undefined,
									'CONFLUENCE',
								),
							},
						);
						expect(result.current.isEnabled).toBe(false);
					});
				});
		});

	eeTest
		.describe(
			'platform_sl_3p_auth_rovo_block_card_jira',
			'block card rovo action experiment jira off',
		)
		.variant(false, () => {
			it('returns isEnabled=false when experiment is off', () => {
				const result = renderHook(
					() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
					{
						wrapper: wrapper(),
					},
				);
				expect(result.current.isEnabled).toBe(false);
			});
		});

	eeTest
		.describe(
			'platform_sl_3p_auth_rovo_block_card_confluence',
			'block card rovo action experiment confluence on',
		)
		.variant(true, () => {
			ffTest.on('platform_sl_3p_auth_rovo_block_card_kill_switch', '', () => {
				it('returns isEnabled=true when rovo is enabled and experiment is on', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'slack-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for eligible extensionKeys', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'onedrive-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=true for google-object-provider', () => {
					const result = renderHook(
						() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'google-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(true);
				});

				it('returns isEnabled=false when actionOptions.rovoChatAction.optIn is not true', () => {
					const result = renderHook(
						() =>
							useBlockCardRovoActionExperiment(mockUrl, {
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
					const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
						wrapper: wrapper(enabledRovoOptions, 'slack-object-provider'),
					});
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when rovo is disabled even with experiment on', () => {
					const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
						wrapper: wrapper(disabledRovoOptions),
					});
					expect(result.current.isEnabled).toBe(false);
				});
			});

			eeTest
				.describe(
					'platform_sl_3p_auth_rovo_block_card_jira',
					'block card rovo action experiment jira off',
				)
				.variant(false, () => {
					it('returns isEnabled=false when product is not Confluence even with experiment on', () => {
						const result = renderHook(
							() => useBlockCardRovoActionExperiment(mockUrl, optedInActionOptions),
							{
								wrapper: wrapper(enabledRovoOptions, 'slack-object-provider', undefined, 'JSM'),
							},
						);
						expect(result.current.isEnabled).toBe(false);
					});
				});
		});

	eeTest
		.describe(
			'platform_sl_3p_auth_rovo_block_card_confluence',
			'block card rovo action experiment confluence off',
		)
		.variant(false, () => {
			it('returns isEnabled=false when experiment is off', () => {
				const result = renderHook(() => useBlockCardRovoActionExperiment(mockUrl), {
					wrapper: wrapper(),
				});
				expect(result.current.isEnabled).toBe(false);
			});
		});
});
