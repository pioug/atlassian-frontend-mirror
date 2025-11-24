import React, { useState } from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { skipA11yAudit } from '@af/accessibility-testing';
import DropdownMenu from '@atlaskit/dropdown-menu';
import noop from '@atlaskit/ds-lib/noop';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { Popup } from '@atlaskit/popup';
import Tooltip from '@atlaskit/tooltip';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';

import { FlyoutMenuItem } from '../../../menu-item/flyout-menu-item/flyout-menu-item';
import { FlyoutMenuItemContent } from '../../../menu-item/flyout-menu-item/flyout-menu-item-content';
import { FlyoutMenuItemTrigger } from '../../../menu-item/flyout-menu-item/flyout-menu-item-trigger';
import { Main } from '../../main/main';
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
 * elements inside of `TopNav`, to work around a Compiled bug.
 *
 * TopNav applies `pointer-events: none`, and its child `TopNavStart` applies `pointer-events: auto`.
 * However, the `pointer-events: auto` style is not being inserted into the test environment.
 *
 * https://atlassian.slack.com/archives/C017XR8K1RB/p1756949097822119
 */
const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

const runAllTimers = () => {
	act(() => {
		jest.runAllTimers();
	});
};

ffTest.both('navx-full-height-sidebar', 'side nav flyout', () => {
	beforeEach(() => {
		resetMatchMedia();
		jest.useFakeTimers();

		// Fails due to fake timers
		skipA11yAudit();
		setMediaQuery('(min-width: 64rem)', { initial: true });
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeAll(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
	});

	afterAll(() => {
		resetConsoleErrorSpyFn();
	});

	it('should not display the side nav flyout by default', () => {
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
				<SideNav defaultCollapsed testId="sidenav">
					sidenav
				</SideNav>
				<Main>main</Main>
			</Root>,
		);

		expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
			'data-visible',
			expect.stringContaining('flyout'),
		);
	});

	describe('small viewports', () => {
		beforeEach(() => {
			setMediaQuery('(min-width: 64rem)', { initial: false });
		});

		it('should not display the side nav flyout when the toggle button is hovered', async () => {
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
					<SideNav testId="sidenav">sidenav</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Side nav is always collapsed by default on small viewports
			fireEvent.mouseOver(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute('data-visible', 'flyout');

			// Expand side nav
			fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			fireEvent.mouseOver(screen.getByRole('button', { name: 'Collapse sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute('data-visible', 'flyout');
		});
	});

	describe('large viewports', () => {
		it('should not display the side nav flyout when the side nav is expanded and the toggle button is hovered', async () => {
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
					<SideNav testId="sidenav">sidenav</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Collapse sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should display the side nav flyout when the side nav is collapsed and the toggle button is hovered', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should stop displaying the side nav flyout when mousing from toggle button to something else', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should keep the side nav flyout displayed when mousing from side nav toggle button to the side nav', async () => {
			const user = createUser();
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			await user.hover(screen.getByTestId('sidenav'));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should keep the side nav flyout displayed when mousing from side nav toggle button to the TopNavStart element', async () => {
			render(
				<Root>
					<TopNav>
						<TopNavStart
							testId="top-nav-start"
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			fireEvent.mouseEnter(screen.getByTestId('top-nav-start'));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should stop displaying the side nav flyout when mousing from the side nav toggle button to another element in the TopNavStart element', async () => {
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
							<button type="button">App switcher</button>
						</TopNavStart>
					</TopNav>
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'App switcher' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should stop displaying the side nav flyout when mousing from the side nav to something else', async () => {
			const user = createUser();
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			await user.hover(screen.getByTestId('sidenav'));
			runAllTimers();
			await user.hover(screen.getByText('main'));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should expand the side nav when clicking on the toggle button while the side nav flyout is visible', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the toggle button to expand the side nav
			fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
		});

		it('should stop displaying the side nav flyout when the flyout was visible, and the user expands then collapses', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the toggle button to expand the side nav
			fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Click the toggle button again to collapse the side nav
			fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should stop displaying the side nav flyout when the flyout was visible AND there is an open layer component, and the user expands then collapses', async () => {
			const LayerComponent = () => {
				useNotifyOpenLayerObserver({
					isOpen: true,
					onClose: noop,
				});
				return <div>LayerComponent</div>;
			};

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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<LayerComponent />
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the toggle button to expand the side nav
			fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Click the toggle button again to collapse the side nav
			fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should keep the side nav flyout displayed when mousing back to the side nav before the flyout timer finishes', async () => {
			const user = createUser();
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Hover on another element outside of side nav
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			await user.hover(screen.getByText('main'));

			// We are specifically _not_ running pending timers here so we can hover back to the side nav before the flyout timer finishes.

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Hover back over side nav
			await user.hover(screen.getByTestId('sidenav'));
			runAllTimers();

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});
	});

	describe('flyout lock', () => {
		const LayerComponent = () => {
			useNotifyOpenLayerObserver({
				isOpen: true,
				onClose: noop,
			});

			return <div>LayerComponent</div>;
		};

		it('should not lock the flyout open when there are no active layers', () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Assert flyout is not visible
			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should not lock the flyout open when there is an open layer but the side nav is not flied out', () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<LayerComponent />
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Assert flyout is not visible
			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should lock the flyout open when there is an open layer and the side nav is flied out', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<LayerComponent />
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is still visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should lock the flyout open when there are multiple layers open and the side nav is flied out', async () => {
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<LayerComponent />
						<LayerComponent />
					</SideNav>
					<Main>main</Main>
				</Root>,
			);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should keep the side nav flyout locked open when there are multiple layers open and then one is removed', async () => {
			const user = createUser();
			const TestComponent = () => {
				const [isSecondLayerOpen, setIsSecondLayerOpen] = useState(true);

				return (
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							<LayerComponent />
							{isSecondLayerOpen && <LayerComponent />}
						</SideNav>
						<Main>
							main
							<button type="button" onClick={() => setIsSecondLayerOpen(false)}>
								test button
							</button>
						</Main>
					</Root>
				);
			};
			render(<TestComponent />);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the button to remove the second layer
			await user.click(screen.getByRole('button', { name: 'test button' }));
			runAllTimers();

			// Assert flyout is still visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
		});

		it('should no longer lock the side nav flyout when all layers are removed', async () => {
			const user = createUser();
			const TestComponent = () => {
				const [areLayersOpen, setAreLayersOpen] = useState(true);

				return (
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							{areLayersOpen && (
								<>
									<LayerComponent />
									<LayerComponent />
								</>
							)}
						</SideNav>
						<Main>
							main
							<button type="button" onClick={() => setAreLayersOpen(false)}>
								test button
							</button>
						</Main>
					</Root>
				);
			};
			render(<TestComponent />);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the button to remove all layers
			await user.click(screen.getByRole('button', { name: 'test button' }));
			runAllTimers();

			// Assert flyout is not visible
			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should close the side nav flyout with a delay when the user mouses away and then the last open layer is closed', async () => {
			const user = createUser();
			const TestComponent = () => {
				const [isLayerOpen, setIsLayerOpen] = useState(true);

				return (
					<Root>
						<TopNav>
							<TopNavStart
								testId="top-nav-start"
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							{isLayerOpen && <LayerComponent />}
						</SideNav>
						<Main>
							main
							<button type="button" onClick={() => setIsLayerOpen(false)}>
								test button
							</button>
						</Main>
					</Root>
				);
			};
			render(<TestComponent />);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Click on the button to remove the second layer
			await user.click(screen.getByRole('button', { name: 'test button' }));

			// We are specifically _not_ running pending timers here to make sure the flyout is not closed immediately.

			// Assert flyout is still visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Wait for the flyout to close
			runAllTimers();
			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		it('should keep the side nav flyout locked when a layer is opened after the user mouses away', async () => {
			const TestComponent = ({ isLayerOpen }: { isLayerOpen: boolean }) => {
				return (
					<Root>
						<TopNav>
							<TopNavStart
								testId="top-nav-start"
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							{isLayerOpen && <LayerComponent />}
						</SideNav>
						<Main>main</Main>
					</Root>
				);
			};
			const { rerender } = render(<TestComponent isLayerOpen={false} />);

			// Hover on side nav toggle button to flyout the side nav
			fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
			runAllTimers();

			// Mouse out of toggle button to check if lock is working
			fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));

			// We are specifically _not_ running pending timers here to make sure the flyout is not closed immediately.

			// Assert flyout is visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Open a layer within the side nav
			rerender(<TestComponent isLayerOpen={true} />);

			// Assert flyout is still visible
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Run the timer and assert it is still visible
			runAllTimers();
			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

			// Close the layer and assert the flyout is closed
			rerender(<TestComponent isLayerOpen={false} />);

			runAllTimers();
			expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
				'data-visible',
				expect.stringContaining('flyout'),
			);
		});

		describe('flyout menu item', () => {
			it('should keep the side nav flyout locked when a flyout menu item is opened', async () => {
				const user = createUser();
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger>Flyout menu item trigger</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>Flyout menu item content</FlyoutMenuItemContent>
							</FlyoutMenuItem>
						</SideNav>
						<Main>main</Main>
					</Root>,
				);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open a flyout menu item to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Flyout menu item trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				// Assert flyout is still visible
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			});

			it('should stop locking the side nav flyout once a flyout menu item is closed', async () => {
				const user = createUser();
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							<FlyoutMenuItem>
								<FlyoutMenuItemTrigger>Flyout menu item trigger</FlyoutMenuItemTrigger>
								<FlyoutMenuItemContent>Flyout menu item content</FlyoutMenuItemContent>
							</FlyoutMenuItem>
						</SideNav>
						<Main>
							main
							<button type="button">test button</button>
						</Main>
					</Root>,
				);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open a flyout menu item to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Flyout menu item trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

				// Click on the main slot to close the flyout
				await user.click(screen.getByRole('button', { name: 'test button' }));
				runAllTimers();

				await waitFor(() =>
					expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
						'data-visible',
						expect.stringContaining('flyout'),
					),
				);
			});
		});

		describe('popup', () => {
			const TestComponent = () => {
				const [isPopupOpen, setIsPopupOpen] = useState(true);

				return (
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
						<SideNav defaultCollapsed testId="sidenav">
							sidenav
							<Popup
								shouldRenderToParent
								isOpen={isPopupOpen}
								onClose={() => setIsPopupOpen(false)}
								placement="bottom-start"
								content={() => <div>Content</div>}
								trigger={({ ref }) => (
									<button type="button" ref={ref}>
										Popup trigger
									</button>
								)}
							/>
						</SideNav>
						<Main>
							main
							<button type="button" onClick={() => setIsPopupOpen(false)}>
								test button
							</button>
						</Main>
					</Root>
				);
			};

			it('should keep the side nav flyout locked when a popup is opened', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open popup to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Popup trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				// Assert flyout is still visible
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			});

			it('should stop locking the side nav flyout once a popup is closed', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open popup to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Popup trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

				// Click on the main slot to close the popup
				await user.click(screen.getByRole('button', { name: 'test button' }));
				runAllTimers();

				await waitFor(() =>
					expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
						'data-visible',
						expect.stringContaining('flyout'),
					),
				);
			});
		});

		describe('dropdown menu', () => {
			const TestComponent = () => (
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<DropdownMenu<HTMLButtonElement> trigger="Dropdown trigger" shouldRenderToParent>
							Dropdown content
						</DropdownMenu>
					</SideNav>
					<Main>
						main
						<button type="button">test button</button>
					</Main>
				</Root>
			);

			it('should keep the side nav flyout locked when a dropdown is opened', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open dropdown to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Dropdown trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				// Assert flyout is still visible
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			});

			it('should stop locking the side nav flyout once a dropdown is closed', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Open dropdown to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.click(screen.getByText('Dropdown trigger'));
				runAllTimers();

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');

				// Click on the main slot to close the dropdown
				await user.click(screen.getByRole('button', { name: 'test button' }));
				runAllTimers();

				await waitFor(() =>
					expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
						'data-visible',
						expect.stringContaining('flyout'),
					),
				);
			});
		});

		describe('tooltip', () => {
			const TestComponent = () => (
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
					<SideNav defaultCollapsed testId="sidenav">
						sidenav
						<Tooltip content="This is a tooltip">
							{(tooltipProps) => (
								<button type="button" {...tooltipProps}>
									Tooltip trigger
								</button>
							)}
						</Tooltip>
					</SideNav>
					<Main>
						main
						<button type="button">test button</button>
					</Main>
				</Root>
			);

			it('should keep the side nav flyout locked when a tooltip within the side nav is hovered over', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Hover over the tooltip trigger to lock the flyout
				await user.hover(screen.getByRole('button', { name: 'Tooltip trigger' }));
				runAllTimers();

				// Wait for tooltip to be visible
				await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());

				// Hover over the tooltip to check if lock is working
				await user.hover(screen.getByRole('tooltip'));
				runAllTimers();

				// Assert flyout is still visible
				expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'flyout');
			});

			it('should stop locking the side nav flyout when a tooltip is closed', async () => {
				const user = createUser();
				render(<TestComponent />);

				// Hover on side nav toggle button to flyout the side nav
				fireEvent.mouseEnter(screen.getByRole('button', { name: 'Expand sidebar' }));
				runAllTimers();

				// Hover over the tooltip trigger to lock the flyout
				fireEvent.mouseLeave(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.hover(screen.getByTestId('sidenav'));
				await user.hover(screen.getByRole('button', { name: 'Tooltip trigger' }));
				runAllTimers();

				// Wait for tooltip to be visible
				await waitFor(() => expect(screen.getByRole('tooltip')).toBeVisible());

				// Hover on another element outside of side nav to check if lock is working
				await user.hover(screen.getByText('main'));
				runAllTimers();

				// Wait for the tooltip to be hidden
				await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());

				await waitFor(() =>
					expect(screen.getByTestId('sidenav')).not.toHaveAttribute(
						'data-visible',
						expect.stringContaining('flyout'),
					),
				);
			});
		});
	});
});
