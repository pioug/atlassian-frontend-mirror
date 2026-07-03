import type { JsonLd } from '@atlaskit/json-ld-types';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { CardAction } from '../../../../constants';
import {
	TEST_DOCUMENT,
	TEST_RESOLVED_META_DATA,
	TEST_RESPONSE,
} from '../../../common/__mocks__/jsonld';
import extractRovoChatAction from '../extract-rovo-chat-action';

jest.mock('@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure', () => ({
	expValEqualsNoExposure: jest.fn(() => false),
}));

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

	// Inline tailored CTA experiment (NAVX-5270): isInlineExperimentEnabled is gated by
	// the `platform_sl_3p_auth_inline_tailored_cta_killswitch` feature gate AND the
	// `platform_sl_3p_auth_inline_tailored_cta` experiment (`isEnabled` === true).
	// A provider that is neither Google nor in the block-card allowlist is used so the
	// inline experiment is the only thing that can enable the action.
	describe('isInlineExperimentEnabled', () => {
		// Not google-object-provider (is3PAuthRovoActionEnabled) and not in
		// ELIGIBLE_EXTENSION_KEYS (is3PBlockPostAuthActionsEnabled).
		const inlineResponse: JsonLd.Response = {
			data: TEST_DOCUMENT,
			meta: {
				...TEST_RESOLVED_META_DATA,
				definitionId: 'd1',
				key: 'jira-object-provider',
				resourceType: 'r1',
			},
		};

		beforeEach(() => {
			(expValEqualsNoExposure as jest.Mock).mockReturnValue(false);
		});

		ffTest.on(
			'platform_sl_3p_auth_inline_tailored_cta_killswitch',
			'killswitch on and experiment enabled',
			() => {
				it('returns Rovo Chat action when killswitch is on and experiment is enabled', () => {
					(expValEqualsNoExposure as jest.Mock).mockReturnValue(true);

					const action = extractRovoChatAction({
						actionOptions,
						appearance: 'hoverCardPreview',
						product: 'JSM',
						id: 'uid',
						response: inlineResponse,
						rovoConfig,
					});

					expect(expValEqualsNoExposure).toHaveBeenCalledWith(
						'platform_sl_3p_auth_inline_tailored_cta',
						'isEnabled',
						true,
					);
					expect(action).toEqual({
						invokeAction: {
							actionSubjectId: 'rovoChatPrompt',
							actionType: 'RovoChatAction',
							definitionId: 'd1',
							display: 'hoverCardPreview',
							extensionKey: 'jira-object-provider',
							id: 'uid',
							resourceType: 'r1',
						},
						product: 'JSM',
						url: 'https://my.url.com',
					});
				});

				it('returns undefined when killswitch is on but experiment is disabled', () => {
					(expValEqualsNoExposure as jest.Mock).mockReturnValue(false);

					const action = extractRovoChatAction({
						actionOptions,
						appearance: 'hoverCardPreview',
						product: 'JSM',
						id: 'uid',
						response: inlineResponse,
						rovoConfig,
					});

					expect(action).toBeUndefined();
				});
			},
		);

		ffTest.off('platform_sl_3p_auth_inline_tailored_cta_killswitch', 'killswitch off', () => {
			it('returns undefined when killswitch is off even if experiment is enabled', () => {
				(expValEqualsNoExposure as jest.Mock).mockReturnValue(true);

				const action = extractRovoChatAction({
					actionOptions,
					appearance: 'hoverCardPreview',
					product: 'JSM',
					id: 'uid',
					response: inlineResponse,
					rovoConfig,
				});

				expect(action).toBeUndefined();
			});
		});
	});
});
