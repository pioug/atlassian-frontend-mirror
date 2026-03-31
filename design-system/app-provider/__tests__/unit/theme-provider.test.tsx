/* eslint-disable import/order */
import React from 'react';

import { render, screen, userEvent, waitFor } from '@atlassian/testing-library';

import * as tokens from '@atlaskit/tokens';

// Mock must be imported before ThemeProvider
import { setMatchMediaPrefersDark } from '../mocks/match-media.mock';

import AppProvider from '../../src/app-provider';
import { useColorMode } from '../../src/theme-provider/hooks/use-color-mode';
import { useIsInsideThemeProvider } from '../../src/theme-provider/hooks/use-is-inside-theme-provider';
import { useSetColorMode } from '../../src/theme-provider/hooks/use-set-color-mode';
import { useSetTheme } from '../../src/theme-provider/hooks/use-set-theme';
import { useTheme } from '../../src/theme-provider/hooks/use-theme';
import ThemeProvider from '../../src/theme-provider';
import { type Theme } from '../../src/theme-provider/context/theme';

jest.mock('@atlaskit/tokens', () => ({
	__esModule: true,
	...jest.requireActual('@atlaskit/tokens'),
}));

// Mock loadAndMountThemes
jest.mock('../../src/theme-provider/utils/load-and-mount-themes', () => ({
	loadAndMountThemes: jest.fn(),
}));

import { loadAndMountThemes } from '../../src/theme-provider/utils/load-and-mount-themes';

const loadAndMountThemesSpy = loadAndMountThemes as jest.MockedFunction<typeof loadAndMountThemes>;

afterEach(() => {
	jest.resetAllMocks();
	setMatchMediaPrefersDark(false);
	// Clean up any theme attributes that might have been set on the HTML element
	document.documentElement.removeAttribute('data-theme');
	document.documentElement.removeAttribute('data-color-mode');
	// Clean up any mounted theme styles
	// eslint-disable-next-line testing-library/no-node-access
	const styles = document.head.querySelectorAll('style[data-theme]');
	Array.from(styles).forEach((style) => {
		// eslint-disable-next-line testing-library/no-node-access
		style.remove();
	});
});

function ThemedComponent() {
	const colorMode = useColorMode();
	const setColorMode = useSetColorMode();
	const setTheme = useSetTheme();
	const theme = useTheme();

	return (
		<div data-testid="themed-content">
			<div data-testid="color-mode">{colorMode}</div>
			<div data-testid="theme-light">{theme.light}</div>
			<div data-testid="theme-dark">{theme.dark}</div>
			<div data-testid="theme-spacing">{theme.spacing}</div>
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
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
					})
				}
			>
				increased contrast color themes
			</button>
			<button type="button" onClick={() => setTheme({ light: 'light-increased-contrast' })}>
				increased contrast light theme
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

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('ThemeProvider', () => {
	describe('Root ThemeProvider (inside AppProvider)', () => {
		let setGlobalThemeSpy: jest.SpyInstance;

		beforeEach(() => {
			setGlobalThemeSpy = jest.spyOn(tokens, 'setGlobalTheme');
		});

		afterEach(() => {
			setGlobalThemeSpy.mockRestore();
		});

		it('should not add sub-tree theme container for top-level ThemeProvider', () => {
			render(
				<AppProvider>
					<div data-testid="content" />
				</AppProvider>,
			);
			const content = screen.getByTestId('content');
			// eslint-disable-next-line testing-library/no-node-access
			expect(content.closest('[data-subtree-theme]')).toBeNull();
		});

		it('should apply defaultColorMode to document', async () => {
			render(<AppProvider defaultColorMode="dark">Hello</AppProvider>);
			const htmlElement = document.documentElement;
			await waitFor(() => {
				expect(htmlElement).toHaveAttribute('data-color-mode', 'dark');
			});
		});

		it('should call setGlobalTheme with default theme and color mode', async () => {
			render(
				<AppProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					Hello
				</AppProvider>,
			);
			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith({
					colorMode: 'light',
					...defaultTheme,
				}),
			);
		});

		it('should call setGlobalTheme with partial defaultTheme merged with defaults', async () => {
			const partialTheme: Partial<Theme> = {
				dark: 'dark-increased-contrast',
				spacing: 'spacing',
			};
			render(
				<AppProvider defaultColorMode="light" defaultTheme={partialTheme}>
					Hello
				</AppProvider>,
			);
			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						colorMode: 'light',
						light: 'light',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
						typography: 'typography',
					}),
				),
			);
		});

		it('should call setGlobalTheme when useSetTheme updates the theme', async () => {
			const user = userEvent.setup();
			render(
				<AppProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />
				</AppProvider>,
			);
			setGlobalThemeSpy.mockClear();
			await user.click(screen.getByRole('button', { name: 'increased contrast color themes' }));
			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
						typography: 'typography',
					}),
				),
			);
		});

		it('should call setGlobalTheme when useSetColorMode updates the color mode', async () => {
			const user = userEvent.setup();
			render(
				<AppProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />
				</AppProvider>,
			);
			setGlobalThemeSpy.mockClear();
			await user.click(screen.getByRole('button', { name: 'dark color mode' }));
			await waitFor(() =>
				expect(setGlobalThemeSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						colorMode: 'dark',
						...defaultTheme,
					}),
				),
			);
		});
	});

	describe('ThemeProvider (standalone)', () => {
		it('should set the initial theme and color mode and apply them via subtree', async () => {
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />
				</ThemeProvider>,
			);
			await waitFor(() =>
				expect(loadAndMountThemesSpy).toHaveBeenCalledWith(expect.objectContaining(defaultTheme)),
			);
			expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
			expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			// eslint-disable-next-line testing-library/no-node-access
			const wrapper = screen.getByTestId('themed-content').closest('[data-subtree-theme]');
			expect(wrapper).toHaveAttribute('data-color-mode', 'light');
			expect(wrapper).toHaveAttribute('data-theme');
		});

		describe('useSetTheme', () => {
			it('should change the theme', async () => {
				const user = userEvent.setup();
				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
						<ThemedComponent />
					</ThemeProvider>,
				);
				await user.click(screen.getByRole('button', { name: 'increased contrast color themes' }));
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light-increased-contrast');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark-increased-contrast');
				expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
						typography: 'typography',
					}),
				);
			});

			it('should only change the theme specified when called with a partial theme settings object', async () => {
				const user = userEvent.setup();
				const theme: Theme = {
					light: 'light',
					dark: 'dark-increased-contrast',
					spacing: 'spacing',
					typography: 'typography',
				};
				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={theme}>
						<ThemedComponent />
					</ThemeProvider>,
				);
				await user.click(screen.getByRole('button', { name: 'increased contrast light theme' }));
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light-increased-contrast');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark-increased-contrast');
				expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
					}),
				);
			});

			it('should set default theme state properties when defaultTheme is omitted', async () => {
				render(
					<ThemeProvider defaultColorMode="light">
						<ThemedComponent />
					</ThemeProvider>,
				);
				await waitFor(() =>
					expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
						expect.objectContaining({
							light: 'light',
							dark: 'dark',
							spacing: 'spacing',
							typography: 'typography',
						}),
					),
				);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			});

			it('should set default theme state properties when defaultTheme is partial', async () => {
				const theme: Partial<Theme> = { dark: 'dark', spacing: 'spacing' };

				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={theme}>
						<ThemedComponent />
					</ThemeProvider>,
				);

				await waitFor(() =>
					expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
						expect.objectContaining({
							light: 'light',
							dark: 'dark',
							spacing: 'spacing',
							typography: 'typography',
						}),
					),
				);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			});

			it('should set default theme state properties when defaultTheme is partial and includes non-default sub-themes', async () => {
				const theme: Partial<Theme> = {
					dark: 'dark',
					spacing: 'spacing',
					shape: 'shape',
					typography: 'typography',
				};

				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={theme}>
						<ThemedComponent />
					</ThemeProvider>,
				);

				await waitFor(() =>
					expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
						expect.objectContaining({
							light: 'light',
							shape: 'shape',
							dark: 'dark',
							typography: 'typography',
							spacing: 'spacing',
						}),
					),
				);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
			});
		});

		describe('useSetColorMode', () => {
			it('should change the color mode', async () => {
				const user = userEvent.setup();
				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
						<ThemedComponent />
					</ThemeProvider>,
				);
				await user.click(screen.getByRole('button', { name: 'dark color mode' }));
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				// eslint-disable-next-line testing-library/no-node-access
				const wrapper = screen.getByTestId('themed-content').closest('[data-subtree-theme]');
				expect(wrapper).toHaveAttribute('data-color-mode', 'dark');
			});

			it(`should change the color mode to be based on the system preference when the color mode is set to auto`, async () => {
				setMatchMediaPrefersDark(true);
				const user = userEvent.setup();
				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
						<ThemedComponent />
					</ThemeProvider>,
				);
				await user.click(screen.getByRole('button', { name: 'auto color mode' }));
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				// eslint-disable-next-line testing-library/no-node-access
				const wrapper = screen.getByTestId('themed-content').closest('[data-subtree-theme]');
				expect(wrapper).toHaveAttribute('data-color-mode', 'dark');
			});
		});
	});

	describe('Hooks', () => {
		describe('useColorMode', () => {
			it('should return the color mode', async () => {
				render(
					<ThemeProvider defaultColorMode="dark" defaultTheme={defaultTheme}>
						<ThemedComponent />
					</ThemeProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			});

			it(`should return the color mode based on the system preference when the color mode is set to auto`, async () => {
				setMatchMediaPrefersDark(true);
				render(
					<ThemeProvider defaultColorMode="auto" defaultTheme={defaultTheme}>
						<ThemedComponent />
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
					light: 'light-increased-contrast' as const,
					dark: 'dark-increased-contrast' as const,
					spacing: 'spacing' as const,
				};

				render(
					<ThemeProvider defaultColorMode="light" defaultTheme={customTheme}>
						<ThemeTestComponent />
					</ThemeProvider>,
				);

				expect(screen.getByTestId('theme-light')).toHaveTextContent('light-increased-contrast');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark-increased-contrast');
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
					light: 'light-increased-contrast' as const,
					dark: 'dark-increased-contrast' as const,
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
				const getGlobalThemeSpy = jest.spyOn(tokens, 'getGlobalTheme').mockReturnValue({
					...initialTheme,
					...partialTheme,
				});

				// Trigger a re-render to observe theme changes
				rerender(
					<ThemeProvider defaultColorMode="light" defaultTheme={initialTheme}>
						<ThemeTestComponent />
					</ThemeProvider>,
				);

				expect(screen.getByTestId('theme-light')).toHaveTextContent('light-increased-contrast');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
				expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');

				getGlobalThemeSpy.mockRestore();
			});

			it('should return default theme when no ThemeProvider is present (DOM fallback)', async () => {
				document.documentElement.setAttribute(
					'data-theme',
					tokens.themeObjectToString({
						light: 'light',
						dark: 'dark',
						spacing: 'spacing',
					}),
				);

				const getGlobalThemeSpy = jest.spyOn(tokens, 'getGlobalTheme').mockReturnValue({
					light: 'light',
					dark: 'dark',
					spacing: 'spacing',
				});

				render(<ThemeTestComponent />);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
				expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
				getGlobalThemeSpy.mockRestore();
			});

			it('should return default theme when UNSAFE_isThemingDisabled is true', async () => {
				document.documentElement.setAttribute(
					'data-theme',
					tokens.themeObjectToString({
						light: 'dark',
						dark: 'dark',
						spacing: 'spacing',
					}),
				);

				const InnerComponent = () => {
					const theme = useTheme();
					return <div data-testid="theme-light">{theme.light}</div>;
				};

				render(
					<AppProvider UNSAFE_isThemingDisabled>
						<InnerComponent />
					</AppProvider>,
				);

				expect(document.documentElement).toHaveAttribute(
					'data-theme',
					'light:dark dark:dark spacing:spacing',
				);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('dark');
			});
		});
	});

	describe('Nested ThemeProvider (Sub-tree theming)', () => {
		function NestedThemedComponent() {
			const colorMode = useColorMode();
			const setColorMode = useSetColorMode();
			const setTheme = useSetTheme();
			const theme = useTheme();
			const isInside = useIsInsideThemeProvider();

			return (
				<div>
					<div data-testid="color-mode">{colorMode || 'undefined'}</div>
					<div data-testid="is-inside">{isInside ? 'true' : 'false'}</div>
					{theme && (
						<div>
							<div data-testid="theme-light">{theme.light}</div>
							<div data-testid="theme-dark">{theme.dark}</div>
							<div data-testid="theme-spacing">{theme.spacing}</div>
							<div data-testid="theme-typography">{theme.typography}</div>
						</div>
					)}
					<button type="button" onClick={() => setColorMode('dark')}>
						dark color mode
					</button>
					<button type="button" onClick={() => setColorMode('light')}>
						light color mode
					</button>
					<button type="button" onClick={() => setColorMode('auto')}>
						auto color mode
					</button>
					<button
						type="button"
						onClick={() =>
							setTheme({
								light: 'light-increased-contrast',
								dark: 'dark-increased-contrast',
								spacing: 'spacing',
							})
						}
					>
						increased contrast color themes
					</button>
					<button type="button" onClick={() => setTheme({ light: 'light-increased-contrast' })}>
						increased contrast light theme
					</button>
				</div>
			);
		}

		describe('Basic rendering', () => {
			it('should render children with theme attributes', () => {
				render(
					<ThemeProvider>
						<div data-testid="content">Test Content</div>
					</ThemeProvider>,
				);
				expect(screen.getByText('Test Content')).toBeInTheDocument();
				// Verify wrapper div is added with attributes by checking parent
				const content = screen.getByTestId('content');
				// eslint-disable-next-line testing-library/no-node-access
				const wrapper = content.parentElement;
				expect(wrapper).toBeInTheDocument();
				expect(wrapper).toHaveAttribute('data-subtree-theme');
				expect(wrapper).toHaveAttribute('data-theme');
				expect(wrapper).toHaveAttribute('data-color-mode');
			});
		});

		describe('Default values', () => {
			it('should use default theme settings when no defaultTheme prop is provided', () => {
				render(
					<ThemeProvider>
						<NestedThemedComponent />
					</ThemeProvider>,
				);
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
				expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
				expect(screen.getByTestId('theme-typography')).toHaveTextContent('typography');
			});

			it('should use default color mode auto when not specified', () => {
				render(
					<ThemeProvider>
						<NestedThemedComponent />
					</ThemeProvider>,
				);
				// Auto should resolve to light when prefers-dark is false
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
			});
		});

		describe('Custom Props', () => {
			it.each([
				['light', 'light'],
				['dark', 'dark'],
				['auto', 'light'], // auto resolves to light when prefers-dark is false
			])('should apply custom defaultColorMode: %s', (mode, expected) => {
				render(
					<ThemeProvider defaultColorMode={mode as 'light' | 'dark' | 'auto'}>
						<NestedThemedComponent />
					</ThemeProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent(expected);
			});

			it('should apply custom defaultTheme', () => {
				const customTheme: Partial<Theme> = {
					dark: 'dark-increased-contrast',
					spacing: 'spacing',
				};
				render(
					<ThemeProvider defaultTheme={customTheme}>
						<NestedThemedComponent />
					</ThemeProvider>,
				);
				// Should merge with defaults
				expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
				expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark-increased-contrast');
				expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
				expect(screen.getByTestId('theme-typography')).toHaveTextContent('typography');
			});
		});

		describe('Theme Loading', () => {
			it('should not load and mount themes when UNSAFE_isThemingDisabled is true', async () => {
				render(
					<AppProvider UNSAFE_isThemingDisabled>
						<div>Test</div>
					</AppProvider>,
				);
				await waitFor(() => {
					expect(loadAndMountThemesSpy).not.toHaveBeenCalled();
				});
				expect(document.documentElement).not.toHaveAttribute('data-theme');
				expect(document.documentElement).not.toHaveAttribute('data-color-mode');
			});

			it('should behave as a sub-tree ThemeProvider when an AppProvider with UNSAFE_isThemingDisabled', async () => {
				const customTheme: Partial<Theme> = {
					light: 'light-increased-contrast',
					dark: 'dark-increased-contrast',
				};
				render(
					<AppProvider UNSAFE_isThemingDisabled>
						<ThemeProvider defaultTheme={customTheme}>
							<div>Test</div>
						</ThemeProvider>
					</AppProvider>,
				);
				await waitFor(() => {
					expect(loadAndMountThemesSpy).toHaveBeenCalled();
				});
				expect(document.documentElement).not.toHaveAttribute('data-theme');
				expect(document.documentElement).not.toHaveAttribute('data-color-mode');
				expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
						typography: 'typography',
					}),
				);
			});

			it('should load and mount themes when nested', async () => {
				const customTheme: Partial<Theme> = {
					light: 'light-increased-contrast',
					dark: 'dark-increased-contrast',
				};
				render(
					<AppProvider>
						<ThemeProvider defaultTheme={customTheme}>
							<div>Test</div>
						</ThemeProvider>
					</AppProvider>,
				);
				await waitFor(() => {
					expect(loadAndMountThemesSpy).toHaveBeenCalled();
				});
				expect(loadAndMountThemesSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						light: 'light-increased-contrast',
						dark: 'dark-increased-contrast',
						spacing: 'spacing',
						typography: 'typography',
					}),
				);
			});

			it('should load themes when theme is updated via setTheme', async () => {
				const user = userEvent.setup();
				render(
					<AppProvider>
						<ThemeProvider>
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				loadAndMountThemesSpy.mockClear();
				await user.click(screen.getByRole('button', { name: 'increased contrast color themes' }));
				await waitFor(() => {
					expect(loadAndMountThemesSpy).toHaveBeenCalled();
				});
			});
		});

		describe('Color Mode State Management', () => {
			it('should update color mode when setColorMode is called', async () => {
				const user = userEvent.setup();
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="light">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
				await user.click(screen.getByRole('button', { name: 'dark color mode' }));
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			});

			it('should reconcile auto color mode to dark when system prefers dark', () => {
				setMatchMediaPrefersDark(true);
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="auto">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			});

			it('should reconcile auto color mode to light when system prefers light', () => {
				setMatchMediaPrefersDark(false);
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="auto">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
			});
		});

		describe('Nesting Scenarios', () => {
			it('should work when nested inside AppProvider', () => {
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="dark">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should work when nested inside AppProvider with UNSAFE_isThemingDisabled', () => {
				render(
					<AppProvider UNSAFE_isThemingDisabled>
						<ThemeProvider defaultColorMode="dark">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should work when nested inside ThemeProvider', () => {
				render(
					<ThemeProvider defaultColorMode="light">
						<ThemeProvider defaultColorMode="dark">
							<NestedThemedComponent />
						</ThemeProvider>
					</ThemeProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should work when nested inside ThemeProvider without AppProvider', () => {
				render(
					<ThemeProvider defaultColorMode="light">
						<ThemeProvider defaultColorMode="dark">
							<NestedThemedComponent />
						</ThemeProvider>
					</ThemeProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should support nested ThemeProviders', () => {
				render(
					<ThemeProvider defaultColorMode="dark">
						<ThemeProvider defaultColorMode="light">
							<NestedThemedComponent />
						</ThemeProvider>
					</ThemeProvider>,
				);
				// Inner provider should take precedence
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should work in complex nesting: AppProvider > ThemeProvider > ThemeProvider', () => {
				render(
					<AppProvider defaultColorMode="light">
						<ThemeProvider defaultColorMode="dark">
							<ThemeProvider defaultColorMode="light">
								<NestedThemedComponent />
							</ThemeProvider>
						</ThemeProvider>
					</AppProvider>,
				);
				// Inner ThemeProvider should take precedence
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});

			it('should work without AppProvider or parent ThemeProvider', () => {
				render(
					<ThemeProvider defaultColorMode="dark">
						<NestedThemedComponent />
					</ThemeProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
				expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
			});
		});

		describe('Hook Tests', () => {
			describe('useIsInsideThemeProvider', () => {
				it('should return true when inside ThemeProvider', () => {
					render(
						<ThemeProvider>
							<NestedThemedComponent />
						</ThemeProvider>,
					);
					expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
				});

				it('should return false when outside ThemeProvider', () => {
					render(<ThemeProvider>{null}</ThemeProvider>);
					function TestComponent() {
						const isInside = useIsInsideThemeProvider();
						return <div data-testid="is-inside">{isInside ? 'true' : 'false'}</div>;
					}
					render(<TestComponent />);
					expect(screen.getByTestId('is-inside')).toHaveTextContent('false');
				});
			});
		});

		describe('Integration Tests', () => {
			it('should apply correct theme attributes to wrapper div', () => {
				const customTheme: Partial<Theme> = {
					light: 'light-increased-contrast',
					dark: 'dark-increased-contrast',
				};
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="dark" defaultTheme={customTheme}>
							<div data-testid="content">Test</div>
						</ThemeProvider>
					</AppProvider>,
				);
				const content = screen.getByTestId('content');
				// eslint-disable-next-line testing-library/no-node-access
				const wrapper = content.parentElement;
				expect(wrapper).toBeInTheDocument();
				expect(wrapper).toHaveAttribute('data-subtree-theme');
				expect(wrapper).toHaveAttribute('data-theme');
				expect(wrapper).toHaveAttribute('data-color-mode', 'dark');
			});

			it('should update theme attributes when theme changes', async () => {
				const user = userEvent.setup();
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="light">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				await user.click(screen.getByRole('button', { name: 'increased contrast color themes' }));
				// Verify theme was updated in context
				await waitFor(() => {
					expect(screen.getByTestId('theme-light')).toHaveTextContent('light-increased-contrast');
				});
			});

			it('should update theme attributes when color mode changes', async () => {
				const user = userEvent.setup();
				render(
					<AppProvider>
						<ThemeProvider defaultColorMode="light">
							<NestedThemedComponent />
						</ThemeProvider>
					</AppProvider>,
				);
				expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
				await user.click(screen.getByRole('button', { name: 'dark color mode' }));
				expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
			});

			describe('should allow nested ThemeProvider hooks to access parent ThemeProvider context', () => {
				it('should allow useColorMode to read parent ThemeProvider context from within nested ThemeProvider', () => {
					function ComponentWithBothHooks() {
						const parentColorMode = useColorMode();
						const nestedColorMode = useColorMode();
						const parentTheme = useTheme();
						const nestedTheme = useTheme();

						return (
							<div>
								<div data-testid="parent-color-mode">{parentColorMode}</div>
								<div data-testid="nested-color-mode">{nestedColorMode || 'undefined'}</div>
								<div data-testid="parent-theme-light">{parentTheme.light}</div>
								<div data-testid="nested-theme-light">{nestedTheme?.light || 'undefined'}</div>
							</div>
						);
					}

					render(
						<ThemeProvider
							defaultColorMode="dark"
							defaultTheme={{
								light: 'light-increased-contrast',
								dark: 'dark-increased-contrast',
							}}
						>
							<ThemeProvider
								defaultColorMode="light"
								defaultTheme={{ light: 'light', dark: 'dark' }}
							>
								<ComponentWithBothHooks />
							</ThemeProvider>
						</ThemeProvider>,
					);

					// Nested ThemeProvider context should be accessible (takes precedence)
					expect(screen.getByTestId('nested-color-mode')).toHaveTextContent('light');
					expect(screen.getByTestId('nested-theme-light')).toHaveTextContent('light');
				});

				it('should allow useSetColorMode to update nested ThemeProvider context independently', async () => {
					function ComponentWithSetHooks() {
						const nestedColorMode = useColorMode();
						const setNestedColorMode = useSetColorMode();

						return (
							<div>
								<div data-testid="nested-color-mode">{nestedColorMode || 'undefined'}</div>
								<button type="button" onClick={() => setNestedColorMode('dark')}>
									set nested dark
								</button>
							</div>
						);
					}

					const user = userEvent.setup();
					render(
						<ThemeProvider defaultColorMode="dark">
							<ThemeProvider defaultColorMode="light">
								<ComponentWithSetHooks />
							</ThemeProvider>
						</ThemeProvider>,
					);

					expect(screen.getByTestId('nested-color-mode')).toHaveTextContent('light');

					// Update nested color mode
					await user.click(screen.getByRole('button', { name: 'set nested dark' }));
					expect(screen.getByTestId('nested-color-mode')).toHaveTextContent('dark');
				});

				it('should allow useSetTheme to update nested ThemeProvider context independently', async () => {
					function ComponentWithThemeHooks() {
						const nestedTheme = useTheme();
						const setNestedTheme = useSetTheme();

						return (
							<div>
								<div data-testid="nested-theme-light">{nestedTheme?.light || 'undefined'}</div>
								<button
									type="button"
									onClick={() => setNestedTheme({ light: 'light-increased-contrast' })}
								>
									set nested theme
								</button>
							</div>
						);
					}

					const user = userEvent.setup();
					render(
						<ThemeProvider defaultTheme={{ light: 'light', dark: 'dark' }}>
							<ThemeProvider defaultTheme={{ light: 'light', dark: 'dark' }}>
								<ComponentWithThemeHooks />
							</ThemeProvider>
						</ThemeProvider>,
					);

					expect(screen.getByTestId('nested-theme-light')).toHaveTextContent('light');

					// Update nested theme
					await user.click(screen.getByRole('button', { name: 'set nested theme' }));
					expect(screen.getByTestId('nested-theme-light')).toHaveTextContent(
						'light-increased-contrast',
					);
				});
			});
		});
	});
});
