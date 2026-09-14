import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { render, screen, waitFor } from '@atlassian/testing-library';

import AppProvider from '../../src/app-provider';

afterEach(() => {
	document.documentElement.removeAttribute('data-theme');
	document.documentElement.removeAttribute('data-color-mode');
	document.documentElement.removeAttribute('data-scrollbar-harmonisation');
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

	it('should not enable the harmonised scrollbar appearance when the gate is off', () => {
		failGate('platform_dst_scrollbar_harmonisation');

		render(<AppProvider>Hello</AppProvider>);

		expect(document.documentElement).not.toHaveAttribute('data-scrollbar-harmonisation');
	});

	it('should enable and clean up the harmonised scrollbar appearance when the gate is on', async () => {
		passGate('platform_dst_scrollbar_harmonisation');

		const { unmount } = render(<AppProvider>Hello</AppProvider>);

		await waitFor(() => {
			expect(document.documentElement).toHaveAttribute('data-scrollbar-harmonisation');
		});

		unmount();

		await waitFor(() => {
			expect(document.documentElement).not.toHaveAttribute('data-scrollbar-harmonisation');
		});
	});

	it('should throw when there are nested AppProviders', async () => {
		jest.spyOn(global.console, 'error').mockImplementation(() => {});

		const app = (
			<AppProvider>
				<AppProvider>Hello</AppProvider>
			</AppProvider>
		);
		expect(() => render(app)).toThrow();
	});
});
