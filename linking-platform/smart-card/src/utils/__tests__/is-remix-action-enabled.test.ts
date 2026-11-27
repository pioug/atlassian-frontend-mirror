import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { isRemixActionEnabled } from '../is-remix-action-enabled';

const KILL_SWITCH = 'platform_sl_3p_auth_visualize_killswitch';
const EXPERIMENT = 'platform_sl_3p_auth_visualize_exp';

const createRemix = (isAvailable: boolean) => ({
	isAvailable: jest.fn(() => isAvailable),
	open: jest.fn(),
});

const toResponse = (type: string[]) => ({ data: { '@type': type } }) as unknown as JsonLd.Response;

const googleSheet = {
	extensionKey: 'google-object-provider',
	remix: createRemix(true),
	response: toResponse(['Document', 'schema:SpreadsheetDigitalDocument']),
};

describe('isRemixActionEnabled', () => {
	describe('when a Google Sheets link is eligible', () => {
		it('returns true when kill switch is on and experiment is enabled', () => {
			passGate(KILL_SWITCH);
			mockExpEnabled(EXPERIMENT);

			expect(isRemixActionEnabled(googleSheet)).toBe(true);
		});

		it('returns true when @type is a single string', () => {
			passGate(KILL_SWITCH);
			mockExpEnabled(EXPERIMENT);

			expect(
				isRemixActionEnabled({
					...googleSheet,
					response: toResponse('schema:SpreadsheetDigitalDocument' as never),
				}),
			).toBe(true);
		});

		it('returns false when experiment is disabled', () => {
			passGate(KILL_SWITCH);
			mockExpDisabled(EXPERIMENT);

			expect(isRemixActionEnabled(googleSheet)).toBe(false);
		});

		it('returns false when kill switch is off', () => {
			failGate(KILL_SWITCH);
			mockExpEnabled(EXPERIMENT);

			expect(isRemixActionEnabled(googleSheet)).toBe(false);
		});
	});

	// Gates are deliberately not forced below: business rules must short-circuit before
	// any gate is evaluated (no exposure), and forcing an uncalled gate fails the test.
	describe('when business rules are not met, even with experiment enabled', () => {
		beforeEach(() => {
			mockExpEnabled(EXPERIMENT);
		});

		it.each(['onedrive-object-provider', 'slack-object-provider', undefined])(
			'returns false for extension key %s',
			(extensionKey) => {
				expect(isRemixActionEnabled({ ...googleSheet, extensionKey })).toBe(false);
			},
		);

		it.each([
			['Google Docs', ['Document', 'schema:TextDigitalDocument']],
			['Google Slides', ['Document', 'schema:PresentationDigitalDocument']],
		])('returns false for %s', (_, type) => {
			expect(isRemixActionEnabled({ ...googleSheet, response: toResponse(type) })).toBe(false);
		});

		it.each([
			['a non-array @type', { data: { '@type': { unexpected: true } } }],
			['a numeric @type', { data: { '@type': 1 } }],
			['a null data', { data: null }],
			['a missing data', {}],
		])('returns false without throwing for %s', (_, response) => {
			expect(() =>
				isRemixActionEnabled({
					...googleSheet,
					response: response as unknown as JsonLd.Response,
				}),
			).not.toThrow();
			expect(
				isRemixActionEnabled({
					...googleSheet,
					response: response as unknown as JsonLd.Response,
				}),
			).toBe(false);
		});
		it('returns false without a resolved response', () => {
			expect(isRemixActionEnabled({ ...googleSheet, response: undefined })).toBe(false);
		});

		it('returns false without the remix plugin', () => {
			expect(isRemixActionEnabled({ ...googleSheet, remix: undefined })).toBe(false);
		});

		it('returns false when Remix is not available', () => {
			expect(isRemixActionEnabled({ ...googleSheet, remix: createRemix(false) })).toBe(false);
		});

		it('fails closed when plugin availability throws', () => {
			const remix = {
				isAvailable: () => {
					throw new Error('unavailable');
				},
				open: jest.fn(),
			};
			expect(() => isRemixActionEnabled({ ...googleSheet, remix })).not.toThrow();
			expect(isRemixActionEnabled({ ...googleSheet, remix })).toBe(false);
		});

		it('checks Remix only after the link rules pass', () => {
			const remix = createRemix(true);
			isRemixActionEnabled({ ...googleSheet, extensionKey: 'slack-object-provider', remix });
			expect(remix.isAvailable).not.toHaveBeenCalled();
		});
	});
});
