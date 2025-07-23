import React from 'react';

import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import type { SideNavState } from '../../side-nav/types';
import {
	SetSideNavVisibilityState,
	SideNavVisibilityState,
} from '../../side-nav/visibility-context';
import { TopNav } from '../../top-nav/top-nav';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
	setMediaQuery,
} from './_test-utils';

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
			expect(screen.getByTestId('sidenav')).toHaveStyle({ width: 'min(90%,20pc)' }); // Compiled converts 320px to 20pc

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

	describe('SideNavToggleButton', () => {
		describe('tooltip', () => {
			beforeEach(() => {
				setMediaQuery('(min-width: 64rem)', { initial: true });
			});

			it('should display the correct tooltip when the side nav is hidden', async () => {
				const user = userEvent.setup();

				render(
					<SideNavToggleButton
						collapseLabel="Collapse sidebar"
						expandLabel="Expand sidebar"
						defaultCollapsed
					/>,
				);

				await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));

				expect(await screen.findByRole('tooltip', { name: 'Expand sidebar' })).toBeInTheDocument();
			});

			it('should display the correct tooltip when the side nav is visible', async () => {
				const user = userEvent.setup();

				render(
					<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />,
				);

				await user.hover(screen.getByRole('button', { name: 'Collapse sidebar' }));

				expect(
					await screen.findByRole('tooltip', { name: 'Collapse sidebar' }),
				).toBeInTheDocument();
			});
		});

		describe('onClick prop', () => {
			beforeEach(() => {
				setMediaQuery('(min-width: 64rem)', { initial: true });
			});

			it('should be called when expanding with correct arguments', async () => {
				const user = userEvent.setup();
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
				const user = userEvent.setup();
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
			const user = userEvent.setup();
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
			const user = userEvent.setup();

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
			const user = userEvent.setup();
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
			const user = userEvent.setup();
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
			const user = userEvent.setup();
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
			const user = userEvent.setup();
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
			const user = userEvent.setup();
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
	});

	describe('onExpand', () => {
		it('should not call onExpand on initial render', async () => {
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
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
			expect(onExpand).toHaveBeenCalledWith({ screen: 'desktop' });
		});

		it('should not call onExpand when the user collapses the side nav', async () => {
			const user = userEvent.setup();
			const onExpand = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
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
	});

	describe('onCollapse', () => {
		it('should not call onCollapse on initial render', async () => {
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
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
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
			expect(onCollapse).toHaveBeenCalledWith({ screen: 'desktop' });
		});

		it('should not call onCollapse when the user expands the side nav', async () => {
			const user = userEvent.setup();
			const onCollapse = jest.fn();

			setMediaQuery('(min-width: 64rem)', { initial: true });
			render(
				<Root>
					<TopNav>
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed
						/>
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
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
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
						<SideNavToggleButton collapseLabel="Collapse sidebar" expandLabel="Expand sidebar" />
					</TopNav>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						sidenav
					</SideNav>
				</Root>,
			);

			act(() => matches(false));

			expect(onCollapse).toHaveBeenCalledTimes(0);
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
			});

			// Rerender with `defaultCollapsed` now flipped to `true`
			rerender(
				<MockProvider
					sideNavState={{
						desktop: 'expanded',
						mobile: 'collapsed',
						flyout: 'closed',
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
						<SideNavToggleButton
							collapseLabel="Collapse sidebar"
							expandLabel="Expand sidebar"
							defaultCollapsed={false}
						/>
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
});
