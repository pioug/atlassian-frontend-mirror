import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { isRovoChatActionVisualizeEnabled } from '../../../../utils/is-rovo-chat-action-visualize-enabled';
import { RovoChatPromptKey } from '../../rovo-chat-utils';
import { getRovoPostAuthPromptKeys } from '../index';

jest.mock('../../../../utils/is-rovo-chat-action-visualize-enabled', () => {
	const actual = jest.requireActual('../../../../utils/is-rovo-chat-action-visualize-enabled');
	return {
		isRovoChatActionVisualizeEnabled: jest.fn(actual.isRovoChatActionVisualizeEnabled),
	};
});

const mockIsRovoChatActionVisualizeEnabled = jest.mocked(isRovoChatActionVisualizeEnabled);

const googleSheetsResponse = {
	data: { '@type': ['Document', 'schema:SpreadsheetDigitalDocument'] },
} as unknown as JsonLd.Response;

const googleSheet = {
	extensionKey: 'google-object-provider',
	isRovoChatActionShown: true,
	product: 'CONFLUENCE' as const,
	response: googleSheetsResponse,
};

describe('getRovoPostAuthPromptKeys', () => {
	beforeEach(() => {
		mockIsRovoChatActionVisualizeEnabled.mockClear();
	});

	it.each(['google-object-provider', 'onedrive-object-provider'])(
		'returns summarize post-auth prompts for %s',
		(extensionKey) => {
			expect(
				getRovoPostAuthPromptKeys({
					extensionKey,
				}),
			).toEqual([RovoChatPromptKey.SUMMARIZE_DOCUMENT, RovoChatPromptKey.KEY_HIGHLIGHTS]);
		},
	);

	it.each(['github-object-provider', 'gitlab-object-provider'])(
		'returns code post-auth prompts for %s',
		(extensionKey) => {
			expect(
				getRovoPostAuthPromptKeys({
					extensionKey,
				}),
			).toEqual([RovoChatPromptKey.EXPLAIN_CODE, RovoChatPromptKey.KEY_HIGHLIGHTS]);
		},
	);

	describe('Google Sheets visualize', () => {
		it('puts visualize first when kill switch is on and experiment is enabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			expect(getRovoPostAuthPromptKeys(googleSheet)).toEqual([
				RovoChatPromptKey.VISUALIZE,
				RovoChatPromptKey.SUMMARIZE_DOCUMENT,
				RovoChatPromptKey.KEY_HIGHLIGHTS,
			]);
		});

		it('returns default prompts when experiment is disabled', () => {
			passGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpDisabled('platform_sl_3p_auth_visualize_exp');

			expect(getRovoPostAuthPromptKeys(googleSheet)).toEqual([
				RovoChatPromptKey.SUMMARIZE_DOCUMENT,
				RovoChatPromptKey.KEY_HIGHLIGHTS,
			]);
		});

		it('returns default prompts when kill switch is off', () => {
			failGate('platform_sl_3p_auth_visualize_killswitch');
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			expect(getRovoPostAuthPromptKeys(googleSheet)).toEqual([
				RovoChatPromptKey.SUMMARIZE_DOCUMENT,
				RovoChatPromptKey.KEY_HIGHLIGHTS,
			]);
		});

		// Kill switch is not forced below: these must short-circuit before any gate is
		// evaluated (no exposure), and forcing an uncalled gate fails the test.
		it('returns default prompts outside Confluence even when experiment is enabled', () => {
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			expect(getRovoPostAuthPromptKeys({ ...googleSheet, product: 'JSW' })).toEqual([
				RovoChatPromptKey.SUMMARIZE_DOCUMENT,
				RovoChatPromptKey.KEY_HIGHLIGHTS,
			]);
		});

		it('does not evaluate visualize (no exposure) when Rovo chat action is not shown', () => {
			mockExpEnabled('platform_sl_3p_auth_visualize_exp');

			expect(getRovoPostAuthPromptKeys({ ...googleSheet, isRovoChatActionShown: false })).toEqual([
				RovoChatPromptKey.SUMMARIZE_DOCUMENT,
				RovoChatPromptKey.KEY_HIGHLIGHTS,
			]);
			expect(mockIsRovoChatActionVisualizeEnabled).not.toHaveBeenCalled();
		});
	});
});
