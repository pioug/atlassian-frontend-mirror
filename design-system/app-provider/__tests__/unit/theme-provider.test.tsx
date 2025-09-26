import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as tokens from '@atlaskit/tokens';

// Mock must be imported before ThemeProvider
import { setMatchMediaPrefersDark } from '../mocks/match-media.mock';
// eslint-disable-next-line import/order
import ThemeProvider, {
	type Theme,
	useColorMode,
	useSetColorMode,
	useSetTheme,
	useTheme,
} from '../../src/theme-provider';

jest.mock('@atlaskit/tokens', () => ({
	__esModule: true,
	...jest.requireActual('@atlaskit/tokens'),
}));

const setGlobalThemeSpy = jest.spyOn(tokens, 'setGlobalTheme');

afterEach(() => {
	jest.resetAllMocks();
	setMatchMediaPrefersDark(false);
});

function ThemedComponent() {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();
	const setTheme = useSetTheme();

	return (
		<div>
			<div data-testid="color-mode">{colorMode}</div>
			<button type="button" onClick={() => setColorMode('dark')}>
				dark color mode
			</button>
			<button type="button" onClick={() => setColorMode('auto')}>
				auto color mode
			</button>
			<button
				type="button"
				onClick={() =>
					setTheme({
						light: 'legacy-light',
						dark: 'legacy-dark',
						spacing: 'spacing',
					})
				}
			>
				legacy color themes
			</button>
			<button type="button" onClick={() => setTheme({ light: 'legacy-light' })}>
				legacy light theme
			</button>
		</div>
	);
}

const defaultTheme: Theme = {
	light: 'light',
	dark: 'dark',
	spacing: 'spacing',
	typography: 'typography',
};

describe('ThemeProvider', () => {
	it('should set the initial theme and color mode', async () => {
		render(
			<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
				<ThemedComponent />,
			</ThemeProvider>,
		);
		await waitFor(() =>
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'light',
				...defaultTheme,
			}),
		);
	});

	describe('useSetTheme', () => {
		it('should change the theme', async () => {
			const user = userEvent.setup();
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'legacy color themes' }));
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'light',
				light: 'legacy-light',
				dark: 'legacy-dark',
				spacing: 'spacing',
				typography: 'typography',
			});
		});

		it('should only change the theme specified when called with a partial theme settings object', async () => {
			const user = userEvent.setup();
			const defaultTheme: Theme = {
				light: 'light',
				dark: 'legacy-dark',
				spacing: 'spacing',
				typography: 'typography',
			};
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'legacy light theme' }));
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'light',
				light: 'legacy-light',
				dark: 'legacy-dark',
				spacing: 'spacing',
				typography: 'typography',
			});
		});

		it('should set default theme state properties when defaultTheme is omitted', async () => {
			render(<ThemeProvider defaultColorMode="light">null</ThemeProvider>);

			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith({
					colorMode: 'light',
					light: 'light',
					dark: 'dark',
					spacing: 'spacing',
					typography: 'typography',
				}),
			);
		});

		it('should set default theme state properties when defaultTheme is partial', async () => {
			const defaultTheme: Partial<Theme> = { dark: 'dark', spacing: 'spacing' };

			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					null
				</ThemeProvider>,
			);

			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith({
					colorMode: 'light',
					light: 'light',
					dark: 'dark',
					spacing: 'spacing',
					typography: 'typography',
				}),
			);
		});

		it('should set default theme state properties when defaultTheme is partial and includes non-default sub-themes', async () => {
			const defaultTheme: Partial<Theme> = {
				dark: 'dark',
				spacing: 'spacing',
				shape: 'shape',
				typography: 'typography-adg3',
			};

			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					null
				</ThemeProvider>,
			);

			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith({
					colorMode: 'light',
					light: 'light',
					shape: 'shape',
					dark: 'dark',
					typography: 'typography-adg3',
					spacing: 'spacing',
				}),
			);
		});
	});

	describe('useSetColorMode', () => {
		it('should change the color mode', async () => {
			const user = userEvent.setup();
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'dark color mode' }));
			expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				...defaultTheme,
				colorMode: 'dark',
			});
		});

		it(`should change the color mode to be based on the system preference when the color mode is set to auto`, async () => {
			setMatchMediaPrefersDark(true);
			const user = userEvent.setup();
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'auto color mode' }));
			expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'dark',
				...defaultTheme,
			});
		});
	});

	describe('useColorMode', () => {
		it('should return the color mode', async () => {
			render(
				<ThemeProvider defaultColorMode="dark" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
		});

		it(`should return the color mode based on the system preference when the color mode is set to auto`, async () => {
			setMatchMediaPrefersDark(true);
			render(
				<ThemeProvider defaultColorMode="auto" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
		});

		it('should fallback to referencing the DOM for color mode when no app-provider is present', async () => {
			function ThemeTestComponent() {
				const colorMode = useColorMode();
				return <div data-testid="color-mode">{colorMode}</div>;
			}

			document.documentElement.setAttribute('data-color-mode', 'light');
			render(<ThemeTestComponent />);
			expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
		});
	});

	describe('useTheme', () => {
		beforeEach(() => {
			document.documentElement.removeAttribute('data-theme');
			document.documentElement.removeAttribute('data-color-mode');
			jest.resetAllMocks();
		});

		afterEach(() => {
			document.documentElement.removeAttribute('data-theme');
			document.documentElement.removeAttribute('data-color-mode');
			jest.resetAllMocks();
		});

		function ThemeTestComponent() {
			const theme = useTheme();
			return (
				<div>
					<div data-testid="theme-light">{theme.light}</div>
					<div data-testid="theme-dark">{theme.dark}</div>
					<div data-testid="theme-spacing">{theme.spacing}</div>
				</div>
			);
		}

		it('should return the theme from context when provided', async () => {
			const customTheme = {
				light: 'legacy-light' as const,
				dark: 'legacy-dark' as const,
				spacing: 'spacing' as const,
			};

			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={customTheme}>
					<ThemeTestComponent />
				</ThemeProvider>,
			);

			expect(screen.getByTestId('theme-light')).toHaveTextContent('legacy-light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('legacy-dark');
			expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
		});

		it('should return default theme when no theme is provided', async () => {
			render(
				<ThemeProvider defaultColorMode="light">
					<ThemeTestComponent />
				</ThemeProvider>,
			);

			expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
		});

		it('should merge partial theme updates with existing theme', async () => {
			const initialTheme = {
				light: 'legacy-light' as const,
				dark: 'legacy-dark' as const,
				spacing: 'spacing' as const,
			};

			const { rerender } = render(
				<ThemeProvider defaultColorMode="light" defaultTheme={initialTheme}>
					<ThemeTestComponent />
				</ThemeProvider>,
			);

			// Update only part of the theme
			const partialTheme = {
				dark: 'dark' as const,
			};

			// Mock getGlobalTheme to return merged theme
			jest.spyOn(tokens, 'getGlobalTheme').mockReturnValue({
				...initialTheme,
				...partialTheme,
			});

			// Trigger a re-render to observe theme changes
			rerender(
				<ThemeProvider defaultColorMode="light" defaultTheme={initialTheme}>
					<ThemeTestComponent />
				</ThemeProvider>,
			);

			expect(screen.getByTestId('theme-light')).toHaveTextContent('legacy-light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
		});

		// Tests for fallback logic when ThemeProvider is not used
		it('should return default theme when no theme is provided', async () => {
			document.documentElement.setAttribute(
				'data-theme',
				tokens.themeObjectToString({
					light: 'light',
					dark: 'dark',
					spacing: 'spacing',
				}),
			);

			jest.spyOn(tokens, 'getGlobalTheme').mockReturnValue({
				light: 'light',
				dark: 'dark',
				spacing: 'spacing',
			});

			render(<ThemeTestComponent />);
			expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
		});
	});
});
