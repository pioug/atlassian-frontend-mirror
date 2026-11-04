/* eslint-disable testing-library/no-node-access */
import React from 'react';

import type { ThemeColorModes } from '@atlaskit/tokens/theme-color-modes';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render, waitFor } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { ThemeProvider } from '../../src/theme-provider';
import { useColorMode } from '../../src/theme-provider/hooks/use-color-mode';
import { useSetColorMode } from '../../src/theme-provider/hooks/use-set-color-mode';

function ToggleColorMode() {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();
	return (
		<button type="button" onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
			Toggle child color mode
		</button>
	);
}

beforeEach(() => {
	passGate('platform-dst-tokens-finesse');
	failGate('platform-static-theme-loading');
	document.documentElement.setAttribute('data-color-mode', 'light');
	document.documentElement.setAttribute('data-theme', 'light:light dark:dark');
});

afterEach(() => {
	document.head.querySelectorAll('style[data-theme]').forEach((style) => style.remove());
	document.documentElement.removeAttribute('data-color-mode');
	document.documentElement.removeAttribute('data-theme');
});

// Exercise the real async loader, rather than the mock in theme-provider.test.tsx.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('nested theme loading', () => {
	it.each<[ThemeColorModes, ThemeColorModes]>([
		['light', 'dark'],
		['dark', 'light'],
	])(
		'loads Finesse for a %s parent and %s child without changing the global theme',
		async (parent, child) => {
			const user = userEvent.setup();
			render(
				<ThemeProvider defaultColorMode={parent}>
					<div data-testid="parent-content" />
					<ThemeProvider defaultColorMode={child}>
						<ToggleColorMode />
					</ThemeProvider>
				</ThemeProvider>,
			);

			await waitFor(() => {
				expect(
					Array.from(document.head.querySelectorAll('style[data-theme$="-finesse"]')).map((style) =>
						style.getAttribute('data-theme'),
					),
				).toEqual(['light-finesse', 'dark-finesse', 'typography-finesse']);
			});
			const parentWrapper = screen.getByTestId('parent-content').closest('[data-subtree-theme]');
			const button = screen.getByRole('button', { name: 'Toggle child color mode' });
			const childWrapper = button.closest('[data-subtree-theme]');
			expect(parentWrapper).toHaveAttribute('data-color-mode', parent);
			expect(childWrapper).toHaveAttribute('data-color-mode', child);

			await user.click(button);

			expect(childWrapper).toHaveAttribute('data-color-mode', parent);
			expect(parentWrapper).toHaveAttribute('data-color-mode', parent);
			expect(document.documentElement).toHaveAttribute('data-color-mode', 'light');
			expect(document.documentElement).toHaveAttribute('data-theme', 'light:light dark:dark');
			expect(document.head.querySelectorAll('style[data-theme]')).toHaveLength(8);
		},
	);
});
