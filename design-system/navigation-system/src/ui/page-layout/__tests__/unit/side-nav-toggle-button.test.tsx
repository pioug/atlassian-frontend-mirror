import React from 'react';

import { renderToString } from 'react-dom/server';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';
import { act, fireEvent, render, screen, userEvent } from '@atlassian/testing-library';

import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavStart } from '../../top-nav/top-nav-start';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

/**
 * In this test suite, we need to use `fireEvent` instead of `userEvent` when interacting with
 * elements inside of `TopNav` when the full height sidebar feature flag is enabled, to work around a Compiled bug.
 *
 * TopNav applies `pointer-events: none`, and its child `TopNavStart` applies `pointer-events: auto`.
 * However, the `pointer-events: auto` style is not being inserted into the test environment.
 *
 * https://atlassian.slack.com/archives/C017XR8K1RB/p1756949097822119
 */

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('SideNavToggleButton', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	beforeEach(() => {
		resetMatchMedia();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('tooltip', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
		});

		it('should display the correct tooltip when the side nav is collapsed', async () => {
			const user = createUser();

			render(
				<SideNavToggleButton
					collapseLabel="Collapse sidebar"
					expandLabel="Expand sidebar"
					defaultCollapsed
				/>,
			);

			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			act(() => {
				jest.runAllTimers();
			});

			expect(await screen.findByRole('tooltip', { name: 'Expand sidebar' })).toBeInTheDocument();
		});

		it('should display the correct tooltip when the side nav is expanded', async () => {
			const user = createUser();

			render(<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />);

			await user.hover(screen.getByRole('button', { name: 'Collapse sidebar' }));
			act(() => {
				jest.runAllTimers();
			});

			expect(await screen.findByRole('tooltip', { name: 'Collapse sidebar' })).toBeInTheDocument();
		});

		ffTest.on('navx-full-height-sidebar', 'with useIsFhsEnabled true', () => {
			ffTest.on(
				'platform_dst_nav4_side_nav_default_collapsed_api',
				'default collapsed API flag enabled',
				() => {
					it('should include the built-in keyboard shortcut in the tooltip when side nav is collapsed and the shortcut is enabled on Root', async () => {
						render(
							<Root isSideNavShortcutEnabled defaultSideNavCollapsed>
								<TopNav>
									<TopNavStart
										sideNavToggleButton={
											<SideNavToggleButton
												collapseLabel="Collapse sidebar"
												expandLabel="Expand sidebar"
											/>
										}
									>
										top nav start
									</TopNavStart>
								</TopNav>
							</Root>,
						);

						fireEvent.mouseOver(screen.getByRole('button', { name: 'Expand sidebar' }));
						act(() => {
							jest.runAllTimers();
						});

						expect(
							await screen.findByRole('tooltip', { name: 'Expand sidebar Ctrl [' }),
						).toBeInTheDocument();
					});

					it('should include the built-in keyboard shortcut in the tooltip when side nav is expanded and the shortcut is enabled on Root', async () => {
						render(
							<Root isSideNavShortcutEnabled>
								<TopNav>
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								</TopNav>
							</Root>,
						);

						fireEvent.mouseOver(screen.getByRole('button', { name: 'Collapse sidebar' }));
						act(() => {
							jest.runAllTimers();
						});

						expect(
							await screen.findByRole('tooltip', { name: 'Collapse sidebar Ctrl [' }),
						).toBeInTheDocument();
					});

					it('should not include the built-in keyboard shortcut in the tooltip when the shortcut is disabled on Root', async () => {
						render(
							<Root isSideNavShortcutEnabled={false} defaultSideNavCollapsed>
								<TopNav>
									<TopNavStart
										sideNavToggleButton={
											<SideNavToggleButton
												collapseLabel="Collapse sidebar"
												expandLabel="Expand sidebar"
											/>
										}
									>
										top nav start
									</TopNavStart>
								</TopNav>
							</Root>,
						);

						fireEvent.mouseOver(screen.getByRole('button', { name: 'Expand sidebar' }));
						act(() => {
							jest.runAllTimers();
						});

						expect(
							// Tooltip does not include keyboard shortcut
							await screen.findByRole('tooltip', { name: 'Expand sidebar' }),
						).toBeInTheDocument();
					});

					it('should not include the built-in keyboard shortcut in the tooltip when the isSideNavShortcutEnabled prop on Root is not provided', async () => {
						render(
							<Root defaultSideNavCollapsed>
								<TopNav>
									<TopNavStart
										sideNavToggleButton={
											<SideNavToggleButton
												collapseLabel="Collapse sidebar"
												expandLabel="Expand sidebar"
											/>
										}
									>
										top nav start
									</TopNavStart>
								</TopNav>
							</Root>,
						);

						fireEvent.mouseOver(screen.getByRole('button', { name: 'Expand sidebar' }));
						act(() => {
							jest.runAllTimers();
						});

						expect(
							// Tooltip does not include keyboard shortcut
							await screen.findByRole('tooltip', { name: 'Expand sidebar' }),
						).toBeInTheDocument();
					});

					it('should close any open tooltips when clicking the toggle button', async () => {
						render(
							<Root isSideNavShortcutEnabled>
								<TopNav>
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								</TopNav>
							</Root>,
						);

						fireEvent.mouseOver(screen.getByRole('button', { name: 'Collapse sidebar' }));
						act(() => {
							jest.runAllTimers();
						});

						// Tooltip is visible
						expect(
							await screen.findByRole('tooltip', { name: 'Collapse sidebar Ctrl [' }),
						).toBeInTheDocument();

						fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

						// Tooltip is now gone
						expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
					});
				},
			);
		});
	});

	ffTest.off('navx-full-height-sidebar', 'FHS flag disabled', () => {
		// Testing old behaviour
		it('should not close any tooltips when clicking the toggle button', async () => {
			const user = createUser();
			render(
				<Root isSideNavShortcutEnabled>
					<TopNav>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					</TopNav>
				</Root>,
			);

			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			act(() => {
				jest.runAllTimers();
			});

			// Tooltip is visible
			expect(await screen.findByRole('tooltip', { name: 'Expand sidebar' })).toBeInTheDocument();

			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			act(() => {
				jest.runAllTimers();
			});
			// Tooltip is still there
			expect(screen.getByRole('tooltip')).toBeInTheDocument();
		});
	});

	describe('onClick prop', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: true });
		});

		it('should be called when expanding with correct arguments', async () => {
			const user = createUser();
			const onClickHandlerMock = jest.fn();
			render(
				// Wrapping in Root to provide contexts
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
							onClick={onClickHandlerMock}
						/>
					</TopNav>
					{/* Rendering side nav so that the side nav context is correctly populated */}
					<SideNav testId="sidenav" defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

			expect(onClickHandlerMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ isSideNavVisible: false }),
			);
		});

		it('should be called when collapsing with correct arguments', async () => {
			const user = createUser();
			const onClickHandlerMock = jest.fn();
			render(
				// Wrapping in Root to provide contexts
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							onClick={onClickHandlerMock}
						/>
					</TopNav>
					{/* Rendering side nav so that the side nav context is correctly populated */}
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

			expect(onClickHandlerMock).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.objectContaining({ isSideNavVisible: true }),
			);
		});
	});

	it('should collapse the side nav on large viewports', async () => {
		const user = createUser();
		setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// Collapse the side nav (on large viewports it starts expanded)
		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// Side nav should be collapsed on all viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	it('should expand the side nav on small viewports', async () => {
		const user = createUser();

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);
		// Expand the side nav (on small viewports it starts collapsed)
		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// Side nav is now expanded on mobile
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');
	});

	it('should expand the side nav after being collapsed on large viewports', async () => {
		const user = createUser();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// Side nav should be expanded
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
	});

	it('should open the side nav after being collapsed and then resized from a large to small viewport', async () => {
		const user = createUser();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// The side nav should be expanded on small viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small');
	});

	it('should keep the side nav expanded after resizing from a large to small viewport, opening it, and resizing back to a large viewport', async () => {
		const user = createUser();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// We are now considered on a large viewport
		act(() => matches(true));

		// The side nav should remain expanded on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');
	});

	it('should collapse the side nav after toggling its visibility three times resizing between large -> small -> large viewports', async () => {
		const user = createUser();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		// We are now considered to be on a large viewport
		act(() => matches(true));

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// The side nav should be collapsed on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small');
	});

	it('should collapse the side nav when resizing from a large to small viewport, opening and closing, then resizing back to a large viewport', async () => {
		const user = createUser();
		const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// We are now considered to be on a small viewport
		act(() => matches(false));

		await user.click(
			screen.getByRole('button', {
				name: 'Expand sidebar',
			}),
		);

		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// We are now considered to be on a large viewport
		act(() => matches(true));

		// Collapse the side nav
		await user.click(
			screen.getByRole('button', {
				name: 'Collapse sidebar',
			}),
		);

		// The side nav should be collapsed
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	it('should not throw an error when clicked if the side nav state is not initialised', async () => {
		const user = createUser();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
			</Root>,
		);

		const button = screen.getByRole('button', { name: 'Collapse sidebar' });

		// This syntax is used to ensure the click handler has a chance to finish executing before checking for errors.
		// https://jestjs.io/docs/asynchronous#resolves--rejects
		await expect(user.click(button)).resolves.not.toThrow();
	});

	it('should work correctly when clicked before the side nav is mounted, and then after it is mounted', async () => {
		const user = createUser();
		setMediaQuery('(min-width: 64rem)', { initial: true });

		// Side nav is not mounted initially
		const { rerender } = render(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
			</Root>,
		);

		const button = screen.getByRole('button', { name: 'Collapse sidebar' });

		// This syntax is used to ensure the click handler has a chance to finish executing before checking for errors.
		// https://jestjs.io/docs/asynchronous#resolves--rejects
		await expect(user.click(button)).resolves.not.toThrow();

		// Side nav is now mounted
		rerender(
			<Root>
				<TopNav>
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
				</TopNav>
				<SideNav testId="sidenav">sidenav</SideNav>
			</Root>,
		);

		// Side nav should be expanded by default on large viewports
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');

		await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

		// Side nav should now be collapsed
		expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
	});

	describe('SSR', () => {
		function renderHtml(element: React.ReactNode) {
			return render(<div dangerouslySetInnerHTML={{ __html: renderToString(element) }} />);
		}

		ffTest.on('platform_dst_nav4_side_nav_default_collapsed_api', 'future state', () => {
			it('should use the root collapse state for the initial render', () => {
				// Intentionally using opposite values on root and button
				// to demonstrate that only the root value is used
				const { unmount } = renderHtml(
					<Root defaultSideNavCollapsed={true}>
						<TopNav>
							<SideNavToggleButton
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
								defaultCollapsed={false}
							/>
						</TopNav>
					</Root>,
				);

				expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
				expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();

				unmount();

				// Intentionally using opposite values on root and button
				// to demonstrate that only the root value is used
				renderHtml(
					<Root defaultSideNavCollapsed={false}>
						<TopNav>
							<SideNavToggleButton
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
								defaultCollapsed={true}
							/>
						</TopNav>
					</Root>,
				);

				expect(screen.getByRole('button', { name: 'Collapse sidebar' })).toBeInTheDocument();
				expect(screen.queryByRole('button', { name: 'Expand sidebar' })).not.toBeInTheDocument();
			});

			it('should use the root collapse state post-SSR', () => {
				render(
					<Root defaultSideNavCollapsed={true}>
						<TopNav>
							<SideNavToggleButton
								collapseLabel="Collapse sidebar"
								expandLabel="Expand sidebar"
								defaultCollapsed={false}
							/>
						</TopNav>
					</Root>,
				);

				expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
				expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();
			});
		});
	});

	ffTest.on('platform_dst_nav4_side_nav_default_collapsed_api', 'future state', () => {
		it('should still use the legacy API if no default state is provided to Root', () => {
			render(
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
					</TopNav>
				</Root>,
			);

			expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Collapse sidebar' })).not.toBeInTheDocument();
		});
	});
});
