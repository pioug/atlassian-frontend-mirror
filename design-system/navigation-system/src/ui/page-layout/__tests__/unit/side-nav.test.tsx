import React from 'react';

import { renderToString } from 'react-dom/server';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';
import { act, render, screen, userEvent, waitFor } from '@atlassian/testing-library';

import { Main } from '../../main/main';
import { Root } from '../../root';
import { onPeekStartDelayMs, SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import type { SideNavState } from '../../side-nav/types';
import { useToggleSideNav } from '../../side-nav/use-toggle-side-nav';
import {
	SetSideNavVisibilityState,
	SideNavVisibilityState,
} from '../../side-nav/visibility-context';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavStart as RealTopNavStart } from '../../top-nav/top-nav-start';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

/**
 * Mocking `TopNavStart` here because JSDOM struggles to properly resolve the Compiled styles,
 * and doesn't pick up on the `pointerEvents: 'auto'` set on the real `TopNavStart`.
 * As a result it thinks that top nav items are not interactive.
 *
 * We have a browser test in `pointer-events.spec.tsx` that ensures top nav items are interactive.
 */
const TopNavStart = ({
	children,
	sideNavToggleButton,
}: React.ComponentProps<typeof RealTopNavStart>) => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
	<div style={{ pointerEvents: 'auto' }}>
		<RealTopNavStart sideNavToggleButton={sideNavToggleButton}>{children}</RealTopNavStart>
	</div>
);

describe('Side nav', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	beforeEach(() => {
		resetMatchMedia();
	});

	describe('slot size', () => {
		it('should set the side nav to its default widths', async () => {
			render(
				// Wrapping in Root to provide OpenLayerObserver context
				<Root>
					<SideNav testId="sidenav">sidenav</SideNav>
				</Root>,
			);

			// Not using `toHaveCompiledCss as it errors due to a CSS parsing bug for modern at-rules like `@starting-style`:
			// https://github.com/atlassian-labs/compiled/issues/1791
			// expect(screen.getByTestId('sidenav')).toHaveStyle({ width: 'min(90%,20pc)' }); // Compiled converts 320px to 20pc

			// This keeps the test reliable under jsdom while still validating sizing.
			expect(screen.getByTestId('sidenav')).toHaveStyle({
				'--n_sNvw': 'clamp(240px, 320px, 50vw)',
			});
		});

		it('should set the side nav default width to the provided value', () => {
			render(
				// Wrapping in Root to provide OpenLayerObserver context
				<Root>
					<SideNav testId="sidenav" defaultWidth={450}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('sidenav')).toHaveStyle({
				'--n_sNvw': 'clamp(240px, 450px, 50vw)',
			});
		});
	});

	describe('onExpand', () => {
		it('should not call onExpand on initial render', async () => {
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onExpand={onExpand}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(onExpand).not.toHaveBeenCalled();
		});

		it('should call onExpand when the user expands the side nav on desktop', async () => {
			const user = userEvent.setup();
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onExpand={onExpand} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Expand the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Expand sidebar',
				}),
			);
			expect(onExpand).toHaveBeenCalledTimes(1);
		});

		it('should not call onExpand when the user collapses the side nav', async () => {
			const user = userEvent.setup();
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onExpand={onExpand}>
						sidenav
					</SideNav>
				</Root>,
			);

			// Collapse the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Collapse sidebar',
				}),
			);
			expect(onExpand).not.toHaveBeenCalled();
		});

		it('should call onExpand with the correct screen type', async () => {
			const user = userEvent.setup();
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: false });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onExpand={onExpand}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(onExpand).not.toHaveBeenCalled();

			// Expand the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Expand sidebar',
				}),
			);
			expect(onExpand).toHaveBeenCalledTimes(1);
			expect(onExpand).toHaveBeenCalledWith({ screen: 'mobile' });
		});

		it('should call onExpand when it is forcibly expanded for desktop', async () => {
			const user = userEvent.setup();
			const onExpand = jest.fn();

			const matches = setMediaQuery('(min-width: 64rem)', { initial: false });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onExpand={onExpand} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Expand the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Expand sidebar',
				}),
			);

			onExpand.mockReset();

			// Change back to desktop
			act(() => matches(true));
			expect(onExpand).toHaveBeenCalledTimes(1);
			expect(onExpand).toHaveBeenCalledWith({ screen: 'desktop' });
		});

		ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'onExpand', () => {
			it('should call onExpand with the correct screen and trigger type', async () => {
				const user = userEvent.setup();
				const onExpand = jest.fn();

				setMediaQuery('(min-width: 64rem)', { initial: false });
				render(
					<Root>
						<TopNav>
							<TopNavStart
								sideNavToggleButton={
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								}
							>
								{null}
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav" onExpand={onExpand}>
							sidenav
						</SideNav>
					</Root>,
				);

				expect(onExpand).not.toHaveBeenCalled();

				// Expand the side nav
				await user.click(
					screen.getByRole('button', {
						name: 'Expand sidebar',
					}),
				);
				expect(onExpand).toHaveBeenCalledTimes(1);
				expect(onExpand).toHaveBeenCalledWith({ screen: 'mobile', trigger: 'toggle-button' });
			});

			it('should call onExpand when it is forcibly expanded for desktop', async () => {
				const user = userEvent.setup();
				const onExpand = jest.fn();

				const matches = setMediaQuery('(min-width: 64rem)', { initial: false });
				render(
					<Root>
						<TopNav>
							<TopNavStart
								sideNavToggleButton={
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
										defaultCollapsed
									/>
								}
							>
								{null}
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav" onExpand={onExpand} defaultCollapsed>
							sidenav
						</SideNav>
					</Root>,
				);

				// Expand the side nav
				await user.click(
					screen.getByRole('button', {
						name: 'Expand sidebar',
					}),
				);

				onExpand.mockReset();

				// Change back to desktop
				act(() => matches(true));
				expect(onExpand).toHaveBeenCalledTimes(1);
				expect(onExpand).toHaveBeenCalledWith({ screen: 'desktop', trigger: 'screen-resize' });
			});

			it('should set trigger to "programmatic" when expanding the side nav using useToggleSideNav without specifying a trigger', async () => {
				const user = userEvent.setup();
				const onExpand = jest.fn();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				function CustomToggle() {
					const toggleSideNav = useToggleSideNav();
					return (
						<button type="button" onClick={toggleSideNav}>
							Custom Toggle
						</button>
					);
				}

				render(
					<Root>
						<TopNav>
							<TopNavStart sideNavToggleButton={<CustomToggle />}>{null}</TopNavStart>
						</TopNav>
						<SideNav onExpand={onExpand} defaultCollapsed>
							Content
						</SideNav>
					</Root>,
				);

				// Use toggle without specifying trigger
				await user.click(screen.getByRole('button', { name: 'Custom Toggle' }));

				expect(onExpand).toHaveBeenCalledWith({
					screen: 'desktop',
					trigger: 'programmatic',
				});
			});
		});
	});

	describe('onCollapse', () => {
		it('should not call onCollapse on initial render', async () => {
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(onCollapse).not.toHaveBeenCalled();
		});

		it('should call onCollapse when the user collapses the side nav on desktop', async () => {
			const user = userEvent.setup();
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						sidenav
					</SideNav>
				</Root>,
			);

			// Collapse the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Collapse sidebar',
				}),
			);
			expect(onCollapse).toHaveBeenCalledTimes(1);
		});

		it('should not call onCollapse when the user expands the side nav', async () => {
			const user = userEvent.setup();
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Expand the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Expand sidebar',
				}),
			);
			expect(onCollapse).toHaveBeenCalledTimes(0);
		});

		it('should call onCollapse with the correct screen type', async () => {
			const user = userEvent.setup();
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: false });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						sidenav
					</SideNav>
				</Root>,
			);

			expect(onCollapse).not.toHaveBeenCalled();

			// Expand the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Expand sidebar',
				}),
			);

			// Collapse the side nav
			await user.click(
				screen.getByRole('button', {
					name: 'Collapse sidebar',
				}),
			);
			expect(onCollapse).toHaveBeenCalledTimes(1);
			expect(onCollapse).toHaveBeenCalledWith({ screen: 'mobile' });
		});

		it('should not call onCollapse when transitioning to mobile', async () => {
			const onCollapse = jest.fn();

			const matches = setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						sidenav
					</SideNav>
				</Root>,
			);

			act(() => matches(false));

			expect(onCollapse).toHaveBeenCalledTimes(0);
		});

		ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'onCollapse', () => {
			it('should call onCollapse with the correct screen and trigger type', async () => {
				const user = userEvent.setup();
				const onCollapse = jest.fn();

				setMediaQuery('(min-width: 64rem)', { initial: false });
				render(
					<Root>
						<TopNav>
							<TopNavStart
								sideNavToggleButton={
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								}
							>
								{null}
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav" onCollapse={onCollapse}>
							sidenav
						</SideNav>
					</Root>,
				);

				expect(onCollapse).not.toHaveBeenCalled();

				// Expand the side nav
				await user.click(
					screen.getByRole('button', {
						name: 'Expand sidebar',
					}),
				);

				// Collapse the side nav
				await user.click(
					screen.getByRole('button', {
						name: 'Collapse sidebar',
					}),
				);
				expect(onCollapse).toHaveBeenCalledTimes(1);
				expect(onCollapse).toHaveBeenCalledWith({ screen: 'mobile', trigger: 'toggle-button' });
			});

			it('should set trigger to "programmatic" when collapsing the side nav using useToggleSideNav without specifying a trigger', async () => {
				const user = userEvent.setup();
				const onCollapse = jest.fn();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				function CustomToggle() {
					const toggleSideNav = useToggleSideNav();
					return (
						<button type="button" onClick={toggleSideNav}>
							Custom Toggle
						</button>
					);
				}

				render(
					<Root>
						<TopNav>
							<TopNavStart sideNavToggleButton={<CustomToggle />}>{null}</TopNavStart>
						</TopNav>
						<SideNav onCollapse={onCollapse}>Content</SideNav>
					</Root>,
				);

				// Use toggle without specifying trigger
				await user.click(screen.getByRole('button', { name: 'Custom Toggle' }));

				expect(onCollapse).toHaveBeenCalledWith({
					screen: 'desktop',
					trigger: 'programmatic',
				});
			});
		});
	});

	describe('onPeekStart', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('should be called after a delay when the flyout is triggered', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekStart = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekStart={onPeekStart} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Trigger the flyout
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Advance to right before the expected delay
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs - 1);
			expect(onPeekStart).toHaveBeenCalledTimes(0);

			// Ensure it's only called after expected delay
			await jest.advanceTimersByTimeAsync(1);
			expect(onPeekStart).toHaveBeenCalledTimes(1);
		});

		it('should not be called multiple times during the same flyout', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekStart = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekStart={onPeekStart} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Trigger the flyout
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			expect(onPeekStart).toHaveBeenCalledTimes(1);

			// Hover the side nav
			await user.hover(screen.getByTestId('sidenav'));
			// Simulate hovering for 500ms
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(onPeekStart).toHaveBeenCalledTimes(1);
		});

		it('should not be called when expanding without intent to peek', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekStart = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekStart={onPeekStart} defaultCollapsed>
						sidenav
					</SideNav>
				</Root>,
			);

			// Expand the side nav
			// No simulated hover time, just an immediate click
			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(onPeekStart).not.toHaveBeenCalled();
		});

		it('should not be called when hovering without intent to peek', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekStart = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekStart={onPeekStart} defaultCollapsed>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Trigger flyout briefly
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Leave flyout before 500ms
			await user.hover(screen.getByTestId('main'));
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
			expect(onPeekStart).not.toHaveBeenCalled();
		});

		it('should not be called after unmounting', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekStart = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			const { unmount } = render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekStart={onPeekStart} defaultCollapsed>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Trigger flyout
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			unmount();

			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(onPeekStart).not.toHaveBeenCalled();
		});
	});

	describe('onPeekEnd', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('should be called when the flyout is closed due to pointer leaving toggle button', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekEnd = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekEnd={onPeekEnd} defaultCollapsed>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Trigger the flyout
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			expect(onPeekEnd).toHaveBeenCalledTimes(0);

			// Hover over main until the flyout closes
			await user.hover(screen.getByTestId('main'));
			await waitFor(() =>
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false'),
			);
			expect(onPeekEnd).toHaveBeenCalledTimes(1);
			expect(onPeekEnd).toHaveBeenCalledWith({ trigger: 'mouse-leave' });
		});

		it('should be called when the flyout is closed due to the sidenav expanding', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

			const onPeekEnd = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekEnd={onPeekEnd} defaultCollapsed>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Trigger the flyout
			await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
			await jest.advanceTimersByTimeAsync(onPeekStartDelayMs);
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			expect(onPeekEnd).toHaveBeenCalledTimes(0);

			// Expand the sidenav
			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			await waitFor(() =>
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large'),
			);
			expect(onPeekEnd).toHaveBeenCalledTimes(1);
			expect(onPeekEnd).toHaveBeenCalledWith({ trigger: 'side-nav-expand' });
		});

		it('should not be called when expanding without intent to peek', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekEnd = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekEnd={onPeekEnd} defaultCollapsed>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Expand the sidenav
			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(onPeekEnd).not.toHaveBeenCalled();
		});

		it('should not be called when collapsing the side nav', async () => {
			const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
			const onPeekEnd = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onPeekEnd={onPeekEnd}>
						sidenav
					</SideNav>
					<Main testId="main">main</Main>
				</Root>,
			);

			// Trigger the flyout
			await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
			expect(onPeekEnd).not.toHaveBeenCalled();
		});
	});

	describe('on click outside', () => {
		it('should collapse the side nav when the user clicks outside of the side nav on small viewports', async () => {
			const user = userEvent.setup();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: false });

			render(
				<Root>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							}
						>
							<div data-testid="outside-click-target">outside click target</div>
						</TopNavStart>
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						sidenav
					</SideNav>
				</Root>,
			);

			await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');

			await user.click(screen.getByTestId('outside-click-target'));
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
			expect(onCollapse).toHaveBeenCalledTimes(1);
			expect(onCollapse).toHaveBeenCalledWith({ screen: 'mobile' });
		});

		ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'onCollapse', () => {
			it('should collapse the side nav when the user clicks outside of the side nav on small viewports', async () => {
				const user = userEvent.setup();
				const onCollapse = jest.fn();
				setMediaQuery('(min-width: 64rem)', { initial: false });

				render(
					<Root>
						<TopNav>
							<TopNavStart
								sideNavToggleButton={
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
										defaultCollapsed
									/>
								}
							>
								<div data-testid="outside-click-target">outside click target</div>
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav" onCollapse={onCollapse}>
							sidenav
						</SideNav>
					</Root>,
				);

				await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'small,large');

				await user.click(screen.getByTestId('outside-click-target'));
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
				expect(onCollapse).toHaveBeenCalledTimes(1);
				expect(onCollapse).toHaveBeenCalledWith({
					screen: 'mobile',
					trigger: 'click-outside-on-mobile',
				});
			});
		});
	});

	describe('post-SSR desktop visibility state sync', () => {
		it('should only set desktop visibility state once after SSR hydration only, regardless of changes to defaultCollapsed prop', () => {
			const setSideNavStateMock = jest.fn();

			const MockProvider = ({
				sideNavState,
				children,
			}: {
				sideNavState: SideNavState | null;
				children: React.ReactNode;
			}) => (
				// 	Wrapping in Root to provide open layer observer context
				<Root>
					{/* Overriding visibility context to mock the values */}
					<SideNavVisibilityState.Provider value={sideNavState}>
						<SetSideNavVisibilityState.Provider value={setSideNavStateMock}>
							{children}
						</SetSideNavVisibilityState.Provider>
					</SideNavVisibilityState.Provider>
				</Root>
			);
			const { rerender } = render(
				<MockProvider sideNavState={null}>
					<SideNav defaultCollapsed={false}>sidenav</SideNav>
				</MockProvider>,
			);

			expect(setSideNavStateMock).toHaveBeenCalledTimes(1);
			// Should be visible by default, as `defaultCollapsed` was false
			expect(setSideNavStateMock).toHaveBeenCalledWith({
				desktop: 'expanded',
				mobile: 'collapsed',
				flyout: 'closed',
				lastTrigger: null,
			});

			// Rerender with `defaultCollapsed` now flipped to `true`
			rerender(
				<MockProvider
					sideNavState={{
						desktop: 'expanded',
						mobile: 'collapsed',
						flyout: 'closed',
						lastTrigger: null,
					}}
				>
					<SideNav defaultCollapsed={true}>sidenav</SideNav>
				</MockProvider>,
			);

			// Should not have been called again
			expect(setSideNavStateMock).toHaveBeenCalledTimes(1);
		});

		it('should only sync desktop visibility state once after SSR hydration only, regardless of side nav state changing', async () => {
			const user = userEvent.setup();
			setMediaQuery('(min-width: 64rem)', { initial: true });
			const setSideNavStateMock = jest.fn();

			const MockProvider = ({
				sideNavState,
				children,
			}: {
				sideNavState: SideNavState | null;
				children: React.ReactNode;
			}) => (
				// 	Wrapping in Root to provide open layer observer context
				<Root>
					{/* Overriding visibility context to mock the values */}
					<SideNavVisibilityState.Provider value={sideNavState}>
						<SetSideNavVisibilityState.Provider value={setSideNavStateMock}>
							{children}
						</SetSideNavVisibilityState.Provider>
					</SideNavVisibilityState.Provider>
				</Root>
			);

			render(
				<MockProvider sideNavState={null}>
					<TopNav>
						<TopNavStart
							sideNavToggleButton={
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed={false}
								/>
							}
						>
							{null}
						</TopNavStart>
					</TopNav>
					<SideNav defaultCollapsed={false}>sidenav</SideNav>
				</MockProvider>,
			);

			expect(setSideNavStateMock).toHaveBeenCalledTimes(1);
			// Should be visible by default, as `defaultCollapsed` was false
			expect(setSideNavStateMock).toHaveBeenCalledWith({
				desktop: 'expanded',
				mobile: 'collapsed',
				flyout: 'closed',
				lastTrigger: null,
			});

			await user.click(
				screen.getByRole('button', {
					name: 'Collapse sidebar',
				}),
			);

			// Should have been called only one more time - by the toggle button click
			expect(setSideNavStateMock).toHaveBeenCalledTimes(2);
		});
	});

	describe('SSR', () => {
		function renderHtml(element: React.ReactNode) {
			return render(<div dangerouslySetInnerHTML={{ __html: renderToString(element) }} />);
		}

		ffTest.on('platform_dst_nav4_side_nav_default_collapsed_api', 'future state', () => {
			it('should use the root collapse state for the initial render', () => {
				// Intentionally using opposite values on Root and SideNav
				// to demonstrate that only the root value is used
				const { unmount } = renderHtml(
					<Root defaultSideNavCollapsed={true}>
						<SideNav defaultCollapsed={false} testId="side-nav">
							sidenav
						</SideNav>
					</Root>,
				);

				expect(screen.getByTestId('side-nav')).toHaveAttribute('data-visible', 'false');

				unmount();

				// Intentionally using opposite values on Root and SideNav
				// to demonstrate that only the root value is used
				renderHtml(
					<Root defaultSideNavCollapsed={false}>
						<SideNav defaultCollapsed={true} testId="side-nav">
							sidenav
						</SideNav>
					</Root>,
				);

				expect(screen.getByTestId('side-nav')).not.toHaveAttribute('data-visible', 'false');
			});

			it('should use the root collapse state post-SSR', () => {
				render(
					<Root defaultSideNavCollapsed={true}>
						<SideNav defaultCollapsed={false} testId="side-nav">
							sidenav
						</SideNav>
					</Root>,
				);

				expect(screen.getByTestId('side-nav')).toHaveAttribute('data-visible', 'false');
			});

			it('should not sync state post-SSR when default state is provided to Root', () => {
				const setSideNavStateMock = jest.fn();

				render(
					<Root defaultSideNavCollapsed>
						<SetSideNavVisibilityState.Provider value={setSideNavStateMock}>
							<SideNav testId="side-nav">sidenav</SideNav>
						</SetSideNavVisibilityState.Provider>
					</Root>,
				);

				expect(setSideNavStateMock).not.toHaveBeenCalled();
			});
		});
	});

	ffTest.on('platform_dst_nav4_side_nav_default_collapsed_api', 'future state', () => {
		it('should still use the legacy API if no default state is provided to Root', () => {
			render(
				<Root>
					<SideNav defaultCollapsed testId="side-nav">
						sidenav
					</SideNav>
				</Root>,
			);

			expect(screen.getByTestId('side-nav')).toHaveAttribute('data-visible', 'false');
		});
	});
});
