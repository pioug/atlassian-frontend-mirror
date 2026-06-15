import type { JsonLd } from '@atlaskit/json-ld-types';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { CardAction } from '../../../../constants';
import {
	TEST_DOCUMENT,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
} from '../../../common/__mocks__/jsonld';
import extractRovoChatAction from '../extract-rovo-chat-action';

describe('extractRovoChatAction', () => {
	const response: JsonLd.Response = {
		data: TEST_DOCUMENT,
		meta: {
			...TEST_RESOLVED_META_DATA,
			definitionId: 'd1',
			key: 'google-object-provider',
			resourceType: 'r1',
		},
	};
	const rovoConfig = { rovoOptions: { isRovoEnabled: true, isRovoLLMEnabled: true } };
	const actionOptions = { hide: false, rovoChatAction: { optIn: true } };

	ffTest.on('platform_sl_3p_auth_rovo_action_kill_switch', 'returns Rovo Chat action', () => {
		it('returns Rovo Chat action', () => {
			const action = extractRovoChatAction({
				actionOptions,
				appearance: 'hoverCardPreview',
				product: 'JSM',
				id: 'uid',
				response,
				rovoConfig,
			});

			expect(action).toEqual({
				invokeAction: {
					actionSubjectId: 'rovoChatPrompt',
					actionType: 'RovoChatAction',
					definitionId: 'd1',
					display: 'hoverCardPreview',
					extensionKey: 'google-object-provider',
					id: 'uid',
					resourceType: 'r1',
				},
				product: 'JSM',
				url: 'https://my.url.com',
			});
		});
	});

	ffTest.off(
		'platform_sl_3p_auth_rovo_action_kill_switch',
		'returns undefined for Google provider when exp1 killswitch is off',
		() => {
			it('returns undefined for Google provider when exp1 killswitch is off', () => {
				const action = extractRovoChatAction({
					actionOptions,
					appearance: 'hoverCardPreview',
					product: 'JSM',
					id: 'uid',
					response,
					rovoConfig,
				});

				expect(action).toBeUndefined();
			});
		},
	);

	// Isolation: platform_sl_3p_auth_rovo_action_kill_switch must not affect non-Google links
	ffTest.on(
		'platform_sl_3p_auth_rovo_action_kill_switch',
		'platform_sl_3p_auth_rovo_action_kill_switch on - isolation: does not affect non-Google links',
		() => {
			it('does not show Rovo actions for non-Google links even when platform_sl_3p_auth_rovo_action_kill_switch is on', () => {
				const nonGoogleResponse: JsonLd.Response = {
					data: TEST_DOCUMENT,
					meta: {
						...TEST_RESOLVED_META_DATA,
						definitionId: 'd1',
						key: 'slack-object-provider',
						resourceType: 'r1',
						supportedFeature: ['RovoActions'],
					},
				};

				const action = extractRovoChatAction({
					actionOptions,
					appearance: 'hoverCardPreview',
					product: 'JSM',
					id: 'uid',
					response: nonGoogleResponse,
					rovoConfig,
				});

				// Waanya's KS only applies to google-object-provider
				expect(action).toBeUndefined();
			});
		},
	);

	// Block card experiment (NAVX-4814): uses ELIGIBLE_EXTENSION_KEYS allowlist instead of supportsRovoActions
	it('does not return Rovo Chat action for eligible provider when product is ineligible', () => {
		const slackResponse: JsonLd.Response = {
			data: TEST_DOCUMENT,
			meta: {
				...TEST_RESOLVED_META_DATA,
				definitionId: 'd1',
				key: 'slack-object-provider',
				resourceType: 'r1',
			},
		};

		const action = extractRovoChatAction({
			actionOptions,
			appearance: 'block',
			product: 'JSM',
			id: 'uid',
			response: slackResponse,
			rovoConfig,
		});

		expect(action).toBeUndefined();
	});

	it('returns undefined when rovo chat is not available', () => {
		const action = extractRovoChatAction({ actionOptions, response });

		expect(action).toBeUndefined();
	});

	it('returns undefined if feature is not supported by provider', () => {
		const action = extractRovoChatAction({ actionOptions, response: TEST_RESPONSE, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if action is not opt-in', () => {
		const action = extractRovoChatAction({ response, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if actionOptions is set to hide all', () => {
		const action = extractRovoChatAction({ actionOptions: { hide: true }, response, rovoConfig });

		expect(action).toBeUndefined();
	});

	it('returns undefined if excluded in actionOptions', () => {
		const action = extractRovoChatAction({
			actionOptions: { hide: false, exclude: [CardAction.RovoChatAction] },
			response,
			rovoConfig,
		});

		expect(action).toBeUndefined();
	});
});
