/* eslint-disable import/order */
import React from 'react';

import { render, screen, userEvent, waitFor } from '@atlassian/testing-library';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
const setGlobalThemeSpy = jest.spyOn(tokens, 'setGlobalTheme');

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

	ffTest.both(
		'platform_dst_subtree_theming',
		'should not add sub-tree theme container for top-level ThemeProvider',
		() => {
			it('should not add sub-tree theme container for top-level ThemeProvider', () => {
				render(
					<AppProvider>
						<div data-testid="content"></div>
					</AppProvider>,
				);
				const content = screen.getByTestId('content');
				// eslint-disable-next-line testing-library/no-node-access
				const wrapper = content.parentElement;
				expect(wrapper).toBeInTheDocument();
				expect(wrapper).not.toHaveAttribute('data-subtree-theme');
			});
		},
	);

	describe('useSetTheme', () => {
		it('should change the theme', async () => {
			const user = userEvent.setup();
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'increased contrast color themes' }));
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'light',
				light: 'light-increased-contrast',
				dark: 'dark-increased-contrast',
				spacing: 'spacing',
				typography: 'typography',
			});
		});

		it('should only change the theme specified when called with a partial theme settings object', async () => {
			const user = userEvent.setup();
			const defaultTheme: Theme = {
				light: 'light',
				dark: 'dark-increased-contrast',
				spacing: 'spacing',
				typography: 'typography',
			};
			render(
				<ThemeProvider defaultColorMode="light" defaultTheme={defaultTheme}>
					<ThemedComponent />,
				</ThemeProvider>,
			);
			await user.click(screen.getByRole('button', { name: 'increased contrast light theme' }));
			expect(setGlobalThemeSpy).toHaveBeenCalledWith({
				colorMode: 'light',
				light: 'light-increased-contrast',
				dark: 'dark-increased-contrast',
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
				typography: 'typography',
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
					typography: 'typography',
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

			// Restore the spy to prevent it from affecting other tests
			getGlobalThemeSpy.mockRestore();
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

			const getGlobalThemeSpy = jest.spyOn(tokens, 'getGlobalTheme').mockReturnValue({
				light: 'light',
				dark: 'dark',
				spacing: 'spacing',
			});

			render(<ThemeTestComponent />);
			expect(screen.getByTestId('theme-light')).toHaveTextContent('light');
			expect(screen.getByTestId('theme-dark')).toHaveTextContent('dark');
			expect(screen.getByTestId('theme-spacing')).toHaveTextContent('spacing');
			// Restore the spy to prevent it from affecting other tests
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
			ffTest.off(
				'platform_dst_subtree_theming',
				'should render children when feature flag is disabled',
				() => {
					it('should render children when feature flag is disabled', () => {
						render(
							<ThemeProvider>
								<div data-testid="content">Test Content</div>
							</ThemeProvider>,
						);
						expect(screen.getByText('Test Content')).toBeInTheDocument();
						// Verify no wrapper div is added - content should be direct child of container
						const content = screen.getByTestId('content');
						// eslint-disable-next-line testing-library/no-node-access
						expect(content.parentElement).not.toHaveAttribute('data-subtree-theme');
					});
				},
			);

			ffTest.on(
				'platform_dst_subtree_theming',
				'should render children with theme attributes when feature flag is enabled',
				() => {
					it('should render children with theme attributes when feature flag is enabled', () => {
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
				},
			);
		});

		describe('Default values', () => {
			ffTest.both(
				'platform_dst_subtree_theming',
				'should use default theme settings when no defaultTheme prop is provided',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should use default color mode auto when not specified',
				() => {
					it('should use default color mode auto when not specified', () => {
						render(
							<ThemeProvider>
								<NestedThemedComponent />
							</ThemeProvider>,
						);
						// Auto should resolve to light when prefers-dark is false
						expect(screen.getByTestId('color-mode')).toHaveTextContent('light');
					});
				},
			);
		});

		describe('Custom Props', () => {
			ffTest.both('platform_dst_subtree_theming', 'should apply custom defaultColorMode', () => {
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
			});

			ffTest.both('platform_dst_subtree_theming', 'should apply custom defaultTheme', () => {
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

			ffTest.on(
				'platform_dst_subtree_theming',
				'should behave as a sub-tree ThemeProvider when an AppProvider with UNSAFE_isThemingDisabled',
				() => {
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
				},
			);

			ffTest.on(
				'platform_dst_subtree_theming',
				'should load and mount themes when feature flag is enabled and nested',
				() => {
					it('should load and mount themes when feature flag is enabled and nested', async () => {
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
				},
			);

			ffTest.on(
				'platform_dst_subtree_theming',
				'should load themes when theme is updated via setTheme',
				() => {
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
						await user.click(
							screen.getByRole('button', { name: 'increased contrast color themes' }),
						);
						await waitFor(() => {
							expect(loadAndMountThemesSpy).toHaveBeenCalled();
						});
					});
				},
			);
		});

		describe('Color Mode State Management', () => {
			ffTest.both(
				'platform_dst_subtree_theming',
				'should update color mode when setColorMode is called',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should reconcile auto color mode based on system preference',
				() => {
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
				},
			);
		});

		describe('Nesting Scenarios', () => {
			ffTest.both(
				'platform_dst_subtree_theming',
				'should work when nested inside AppProvider',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should work when nested inside AppProvider with UNSAFE_isThemingDisabled',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should work when nested inside ThemeProvider',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should work when nested inside ThemeProvider without AppProvider',
				() => {
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
				},
			);

			ffTest.both('platform_dst_subtree_theming', 'should support nested ThemeProviders', () => {
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
			});

			ffTest.both('platform_dst_subtree_theming', 'should work in complex nesting', () => {
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
			});

			ffTest.both(
				'platform_dst_subtree_theming',
				'should work without AppProvider or parent ThemeProvider',
				() => {
					it('should work without AppProvider or parent ThemeProvider', () => {
						render(
							<ThemeProvider defaultColorMode="dark">
								<NestedThemedComponent />
							</ThemeProvider>,
						);
						expect(screen.getByTestId('color-mode')).toHaveTextContent('dark');
						expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
					});
				},
			);
		});

		describe('Hook Tests', () => {
			describe('useIsInsideThemeProvider', () => {
				ffTest.both(
					'platform_dst_subtree_theming',
					'should return true when inside ThemeProvider',
					() => {
						it('should return true when inside ThemeProvider', () => {
							render(
								<ThemeProvider>
									<NestedThemedComponent />
								</ThemeProvider>,
							);
							expect(screen.getByTestId('is-inside')).toHaveTextContent('true');
						});
					},
				);

				ffTest.both(
					'platform_dst_subtree_theming',
					'should return false when outside ThemeProvider',
					() => {
						it('should return false when outside ThemeProvider', () => {
							// Render ThemeProvider to ensure feature flag is called
							render(<ThemeProvider>{null}</ThemeProvider>);
							function TestComponent() {
								const isInside = useIsInsideThemeProvider();
								return <div data-testid="is-inside">{isInside ? 'true' : 'false'}</div>;
							}
							render(<TestComponent />);
							expect(screen.getByTestId('is-inside')).toHaveTextContent('false');
						});
					},
				);
			});
		});

		describe('Integration Tests', () => {
			ffTest.on(
				'platform_dst_subtree_theming',
				'should apply correct theme attributes to wrapper div when feature flag enabled',
				() => {
					it('should apply correct theme attributes to wrapper div when feature flag enabled', () => {
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
				},
			);

			ffTest.off(
				'platform_dst_subtree_theming',
				'should not apply theme attributes when feature flag disabled',
				() => {
					it('should not apply theme attributes when feature flag disabled', () => {
						render(
							<AppProvider>
								<ThemeProvider defaultColorMode="dark">
									<div data-testid="content">Test</div>
								</ThemeProvider>
							</AppProvider>,
						);
						const content = screen.getByTestId('content');
						// eslint-disable-next-line testing-library/no-node-access
						expect(content.parentElement).not.toHaveAttribute('data-subtree-theme');
					});
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should update theme attributes when theme changes',
				() => {
					it('should update theme attributes when theme changes', async () => {
						const user = userEvent.setup();
						render(
							<AppProvider>
								<ThemeProvider defaultColorMode="light">
									<NestedThemedComponent />
								</ThemeProvider>
							</AppProvider>,
						);
						await user.click(
							screen.getByRole('button', { name: 'increased contrast color themes' }),
						);
						// Verify theme was updated in context
						await waitFor(() => {
							expect(screen.getByTestId('theme-light')).toHaveTextContent(
								'light-increased-contrast',
							);
						});
					});
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should update theme attributes when color mode changes',
				() => {
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
				},
			);

			ffTest.both(
				'platform_dst_subtree_theming',
				'should allow nested ThemeProvider hooks to access parent ThemeProvider context',
				() => {
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
				},
			);
		});
	});
});
