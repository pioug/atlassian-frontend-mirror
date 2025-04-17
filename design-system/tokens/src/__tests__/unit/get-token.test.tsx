import warnOnce from '@atlaskit/ds-lib/warn-once';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { CSS_PREFIX, TOKEN_NOT_FOUND_CSS_VAR } from '../../constants';
import token from '../../get-token';

jest.mock('@atlaskit/ds-lib/warn-once');

(warnOnce as jest.Mock).mockImplementation(() => 42);

describe('getToken', () => {
	it('returns a token', () => {
		// TS: Function should have specific return type.
		// CSS prefix has to be hardcoded as template literal types not supported
		const testToken: 'var(--ds-background-brand-bold)' = token('color.background.brand.bold');
		expect(testToken).toEqual(`var(--${CSS_PREFIX}-background-brand-bold)`);
	});

	it('returns a token with fallback', () => {
		// TS: Fallback shouldn't be included in return type.
		const testToken: `var(--ds-background-brand-bold)` = token(
			'color.background.brand.bold',
			'#000',
		);
		expect(testToken).toEqual(`var(--ds-background-brand-bold, #000)`);
	});

	it('should log error when token is not found', () => {
		// @ts-expect-error
		const result = token('this-token-does-not-exist');
		expect(result).toEqual('var(--ds-token-not-found)');
		expect(warnOnce).toHaveBeenCalledWith(
			`Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
		);
	});

	describe('should log error when color.icon.subtlest tokens is used when feature flag is off', () => {
		ffTest(
			'platform-component-visual-refresh',
			() => {
				const result = token('color.icon.subtlest');
				expect(result).toEqual('var(--ds-icon-subtlest)');
				expect(warnOnce).not.toHaveBeenCalledWith(
					`Token "color.icon.subtlest" is only available when feature flag "platform-component-visual-refresh" is on, don't use it if the flag can't be turned on on this page`,
				);
			},
			() => {
				const result = token('color.icon.subtlest');
				expect(result).toEqual('var(--ds-icon-subtlest)');
				expect(warnOnce).toHaveBeenCalledWith(
					`Token "color.icon.subtlest" is only available when feature flag "platform-component-visual-refresh" is on, don't use it if the flag can't be turned on on this page`,
				);
			},
		);
	});

	it('should log error and use fallback when token is not found', () => {
		// @ts-expect-error
		const result = token('this-token-does-not-exist', '#FFF');
		expect(result).toEqual('var(--ds-token-not-found, #FFF)');
		expect(warnOnce).toHaveBeenCalledWith(
			`Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
		);
	});

	describe('on production environment', () => {
		let nodeEnv: string | undefined = '';
		beforeEach(() => {
			nodeEnv = process.env.NODE_ENV;
			process.env.NODE_ENV = 'production';
		});

		afterEach(() => {
			process.env.NODE_ENV = nodeEnv;
		});

		it('returns correct css for non-existing token with fallback', () => {
			const testToken = token('some.non.existing.token' as any, '#000');
			expect(testToken).toEqual(`var(${TOKEN_NOT_FOUND_CSS_VAR}, #000)`);
		});

		it('returns correct css for non-existing token without fallback', () => {
			const testToken = token('some.non.existing.token' as any);
			expect(testToken).toEqual(`var(${TOKEN_NOT_FOUND_CSS_VAR})`);
		});
	});
});
