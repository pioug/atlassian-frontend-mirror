import React from 'react';

import { render } from '@testing-library/react';

import warnOnce from '@atlaskit/ds-lib/warn-once';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { COLOR_MODE_ATTRIBUTE } from '../../constants';
import getTokenValue from '../../get-token-value';

jest.mock('@atlaskit/ds-lib/warn-once');

(warnOnce as jest.Mock).mockImplementation(() => 42);

describe('getTokenValue', () => {
	const setup = () =>
		render(
			<>
				<head>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles --  -- Ignored via go/DSP-18766 */}
					<style>
						{`
		html {
		  --ds-text:${` `} #ff0000${` `};
		  --ds-icon-subtlest:${` `} #626F86${` `};
		}
		html[${COLOR_MODE_ATTRIBUTE}="light"] {
		  --ds-text: #00ff00;
		  --ds-icon-subtlest: #626F86;
		}
		html[${COLOR_MODE_ATTRIBUTE}="dark"] {
		  --ds-text: #0000ff;
		  --ds-icon-subtlest: #626F86;
		}
		`}
					</style>
				</head>
			</>,
			{ container: document.documentElement },
		);
	afterEach(() => {
		document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);
	});

	describe('on non-production environment', () => {
		it('should trim the value down to remove leading/trailing spaces', () => {
			setup();
			const result = getTokenValue('color.text');
			expect(result).toEqual('#ff0000');
		});

		it('should return the correct value for the current theme', () => {
			setup();
			expect(getTokenValue('color.text')).toEqual('#ff0000');
			expect(getTokenValue('color.text', '#000')).toEqual('#ff0000');

			document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, 'light');
			expect(getTokenValue('color.text')).toEqual('#00ff00');
			expect(getTokenValue('color.text', '#000')).toEqual('#00ff00');

			document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, 'dark');
			expect(getTokenValue('color.text')).toEqual('#0000ff');
			expect(getTokenValue('color.text', '#000')).toEqual('#0000ff');
		});

		it('should log error and return an empty value for non-existing token without fallback', () => {
			setup();
			// @ts-expect-error
			const result = getTokenValue('this-token-does-not-exist');

			expect(result).toEqual('');

			expect(warnOnce).toHaveBeenCalledWith(
				`Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
			);
		});

		describe('should log error when color.icon.subtlest tokens is used when feature flag is off', () => {
			ffTest(
				'platform-component-visual-refresh',
				() => {
					setup();
					const result = getTokenValue('color.icon.subtlest');
					expect(result).toEqual('#626F86');
					expect(warnOnce).not.toHaveBeenCalledWith(
						`Token "color.icon.subtlest" is only available when feature flag "platform-component-visual-refresh" is on, don't use it if the flag can't be turned on on this page`,
					);
				},
				() => {
					setup();
					const result = getTokenValue('color.icon.subtlest');
					expect(result).toEqual('#626F86');
					expect(warnOnce).toHaveBeenCalledWith(
						`Token "color.icon.subtlest" is only available when feature flag "platform-component-visual-refresh" is on, don't use it if the flag can't be turned on on this page`,
					);
				},
			);
		});

		it('should log error and use fallback for non-existing token with fallback', () => {
			setup();
			// @ts-expect-error
			const result = getTokenValue('this-token-does-not-exist', '#000');

			expect(result).toEqual('#000');

			expect(warnOnce).toHaveBeenCalledWith(
				`Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
			);
		});
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

		it('should trim the value down to remove leading/trailing spaces', () => {
			setup();
			const result = getTokenValue('color.text');
			expect(result).toEqual('#ff0000');
		});

		it('should return an empty value for non-existing token without fallback', () => {
			setup();
			// @ts-expect-error
			const result = getTokenValue('this-token-does-not-exist');
			expect(result).toEqual('');
		});

		it('should return the fallback value for non-existing token with fallback', () => {
			setup();
			// @ts-expect-error
			const result = getTokenValue('this-token-does-not-exist', '#000');
			expect(result).toEqual('#000');
		});
	});
});
