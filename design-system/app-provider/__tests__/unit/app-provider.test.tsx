import React from 'react';

import { render, screen } from '@testing-library/react';

import * as tokens from '@atlaskit/tokens';

import AppProvider from '../../src/app-provider';

jest.mock('@atlaskit/tokens', () => ({
	__esModule: true,
	...jest.requireActual('@atlaskit/tokens'),
}));

const setGlobalThemeSpy = jest.spyOn(tokens, 'setGlobalTheme');

afterEach(() => {
	jest.resetAllMocks();
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('AppProvider', () => {
	it('should render', async () => {
		render(<AppProvider>Hello</AppProvider>);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});

	it('should disable theming when `UNSAFE_isThemingDisabled` is true', async () => {
		render(<AppProvider UNSAFE_isThemingDisabled>Hello</AppProvider>);
		expect(setGlobalThemeSpy).not.toHaveBeenCalled();
	});

	it('should throw when there are nested AppProviders', async () => {
		// @ts-ignore
		jest.spyOn(global.console, 'error').mockImplementation(() => {});

		const app = (
			<AppProvider>
				<AppProvider>Hello</AppProvider>
			</AppProvider>
		);
		expect(() => render(app)).toThrow();
	});
});
