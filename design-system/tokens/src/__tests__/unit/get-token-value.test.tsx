import React from 'react';

import { cleanup, render } from '@testing-library/react';

import warnOnce from '@atlaskit/ds-lib/warn-once';

import { COLOR_MODE_ATTRIBUTE } from '../../constants';
import getTokenValue from '../../get-token-value';

jest.mock('@atlaskit/ds-lib/warn-once');

(warnOnce as jest.Mock).mockImplementation(() => 42);

describe('getTokenValue', () => {
	beforeEach(() => {
		render(
			<>
				<head>
					<style>
						{`
            html {
              --ds-text:${` `} #ff0000${` `};
            }
            html[${COLOR_MODE_ATTRIBUTE}="light"] {
              --ds-text: #00ff00;
            }
            html[${COLOR_MODE_ATTRIBUTE}="dark"] {
              --ds-text: #0000ff;
            }
            `}
					</style>
				</head>
			</>,
			{ container: document.documentElement },
		);
	});
	afterEach(() => {
		cleanup();
		document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);
	});

	describe('on non-production environment', () => {
		it('should trim the value down to remove leading/trailing spaces', () => {
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			const result = getTokenValue('color.text');
			expect(result).toEqual('#ff0000');
		});

		it('should return the correct value for the current theme', () => {
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			expect(getTokenValue('color.text')).toEqual('#ff0000');
			expect(getTokenValue('color.text', '#000')).toEqual('#ff0000');

			document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, 'light');
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			expect(getTokenValue('color.text')).toEqual('#00ff00');
			expect(getTokenValue('color.text', '#000')).toEqual('#00ff00');

			document.documentElement.setAttribute(COLOR_MODE_ATTRIBUTE, 'dark');
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			expect(getTokenValue('color.text')).toEqual('#0000ff');
			expect(getTokenValue('color.text', '#000')).toEqual('#0000ff');
		});

		it('should log error and return an empty value for non-existing token without fallback', () => {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			const result = getTokenValue('this-token-does-not-exist');

			expect(result).toEqual('');

			expect(warnOnce).toHaveBeenCalledWith(
				`Unknown token id at path: this-token-does-not-exist in @atlaskit/tokens`,
			);
		});

		it('should log error and use fallback for non-existing token with fallback', () => {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
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
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			const result = getTokenValue('color.text');
			expect(result).toEqual('#ff0000');
		});

		it('should return an empty value for non-existing token without fallback', () => {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			const result = getTokenValue('this-token-does-not-exist');
			expect(result).toEqual('');
		});

		it('should return the fallback value for non-existing token with fallback', () => {
			// @ts-expect-error
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
			const result = getTokenValue('this-token-does-not-exist', '#000');
			expect(result).toEqual('#000');
		});
	});
});
