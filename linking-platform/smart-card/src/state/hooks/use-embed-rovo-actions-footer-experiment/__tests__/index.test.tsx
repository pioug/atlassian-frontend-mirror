import React from 'react';

import { SmartCardProvider, type CardProviderStoreOpts } from '@atlaskit/link-provider';
import type { ProductType } from '@atlaskit/linking-common';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { renderHook } from '@atlassian/testing-library';

import useEmbedRovoActionsFooterExperiment, {
	getEmbedRovoActionsFooterExperimentMeta,
} from '../index';

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

describe('useEmbedRovoActionsFooterExperiment', () => {
	it('returns isEnabled=false when rovo is disabled', () => {
		const result = renderHook(
			() =>
				useEmbedRovoActionsFooterExperiment(
					mockUrl,
					optedInActionOptions,
					disabledRovoOptions,
					'CONFLUENCE',
				),
			{
				wrapper: wrapper(disabledRovoOptions, 'google-object-provider', undefined, 'CONFLUENCE'),
			},
		);
		expect(result.current.isEnabled).toBe(false);
	});

	ffTest.on('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe(
				'platform_sl_3p_auth_rovo_embed_footer_exp',
				'embed card rovo action footer experiment on',
			)
			.variant(true, () => {
				it.each([
					'google-object-provider',
					'onedrive-object-provider',
					'github-object-provider',
					'gitlab-object-provider',
				])(
					'returns isEnabled=true when rovo is enabled and experiment is on for %s',
					(extensionKey) => {
						const result = renderHook(
							() =>
								useEmbedRovoActionsFooterExperiment(
									mockUrl,
									optedInActionOptions,
									enabledRovoOptions,
									'CONFLUENCE',
								),
							{
								wrapper: wrapper(enabledRovoOptions, extensionKey, undefined, 'CONFLUENCE'),
							},
						);
						expect(result.current.isEnabled).toBe(true);
					},
				);

				it.each([
					'figma-object-provider',
					'slack-object-provider',
					'ms-teams-object-provider',
					'salesforce-object-provider',
				])('returns isEnabled=false when extensionKey is unsupported: %s', (extensionKey) => {
					const result = renderHook(
						() =>
							useEmbedRovoActionsFooterExperiment(
								mockUrl,
								optedInActionOptions,
								enabledRovoOptions,
								'CONFLUENCE',
							),
						{
							wrapper: wrapper(enabledRovoOptions, extensionKey, undefined, 'CONFLUENCE'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when actionOptions.rovoChatAction.optIn is not true', () => {
					const result = renderHook(
						() =>
							useEmbedRovoActionsFooterExperiment(
								mockUrl,
								{
									hide: false,
									rovoChatAction: { optIn: false },
								},
								enabledRovoOptions,
								'CONFLUENCE',
							),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'google-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});

				it('returns isEnabled=false when product is not Confluence', () => {
					const result = renderHook(
						() =>
							useEmbedRovoActionsFooterExperiment(
								mockUrl,
								optedInActionOptions,
								enabledRovoOptions,
								'JSM',
							),
						{
							wrapper: wrapper(enabledRovoOptions, 'google-object-provider', undefined, 'JSM'),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});
			});

		eeTest
			.describe(
				'platform_sl_3p_auth_rovo_embed_footer_exp',
				'embed card rovo action footer experiment off',
			)
			.variant(false, () => {
				it('returns isEnabled=false when experiment is off', () => {
					const result = renderHook(
						() =>
							useEmbedRovoActionsFooterExperiment(
								mockUrl,
								optedInActionOptions,
								enabledRovoOptions,
								'CONFLUENCE',
							),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'google-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});
			});
	});

	ffTest.off('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe(
				'platform_sl_3p_auth_rovo_embed_footer_exp',
				'embed card rovo action footer experiment on',
			)
			.variant(true, () => {
				it('returns isEnabled=false when kill switch is off', () => {
					const result = renderHook(
						() =>
							useEmbedRovoActionsFooterExperiment(
								mockUrl,
								optedInActionOptions,
								enabledRovoOptions,
								'CONFLUENCE',
							),
						{
							wrapper: wrapper(
								enabledRovoOptions,
								'google-object-provider',
								undefined,
								'CONFLUENCE',
							),
						},
					);
					expect(result.current.isEnabled).toBe(false);
				});
			});
	});

	ffTest.on('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_rovo_embed_footer_exp', 'embed footer renderSuccess metadata')
			.variant(true, () => {
				it('returns renderSuccess experimentMeta for eligible resolved embed footer exposure', () => {
					expect(
						getEmbedRovoActionsFooterExperimentMeta({
							extensionKey: 'google-object-provider',
							isRovoChatActionOptedIn: true,
							isRovoChatEnabled: true,
							product: 'CONFLUENCE',
						}),
					).toEqual({
						platform_sl_3p_auth_rovo_embed_footer_exp: {
							isEligible: true,
							isTreatment: true,
						},
					});
				});

				it('does not return renderSuccess experimentMeta when provider is ineligible', () => {
					expect(
						getEmbedRovoActionsFooterExperimentMeta({
							extensionKey: 'figma-object-provider',
							isRovoChatActionOptedIn: true,
							isRovoChatEnabled: true,
							product: 'CONFLUENCE',
						}),
					).toBeUndefined();
				});
			});
	});

	ffTest.off('platform_sl_3p_auth_rovo_embed_footer_kill_switch', '', () => {
		eeTest
			.describe('platform_sl_3p_auth_rovo_embed_footer_exp', 'embed footer renderSuccess metadata')
			.variant(true, () => {
				it('does not return renderSuccess experimentMeta when kill switch is off', () => {
					expect(
						getEmbedRovoActionsFooterExperimentMeta({
							extensionKey: 'google-object-provider',
							isRovoChatActionOptedIn: true,
							isRovoChatEnabled: true,
							product: 'CONFLUENCE',
						}),
					).toBeUndefined();
				});
			});
	});
});
