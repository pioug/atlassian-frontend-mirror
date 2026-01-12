import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import AppProvider from '../../src/app-provider';

afterEach(() => {
	document.documentElement.removeAttribute('data-theme');
	document.documentElement.removeAttribute('data-color-mode');
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
		const htmlElement = document.documentElement;
		await waitFor(() => {
			expect(htmlElement).not.toHaveAttribute('data-theme');
		});
		await waitFor(() => {
			expect(htmlElement).not.toHaveAttribute('data-color-mode');
		});
	});

	it('should enable theming when `UNSAFE_isThemingDisabled` is not set', async () => {
		render(<AppProvider>Hello</AppProvider>);
		const htmlElement = document.documentElement;
		await waitFor(() => {
			expect(htmlElement).toHaveAttribute('data-theme');
		});
		await waitFor(() => {
			expect(htmlElement).toHaveAttribute('data-color-mode');
		});
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
