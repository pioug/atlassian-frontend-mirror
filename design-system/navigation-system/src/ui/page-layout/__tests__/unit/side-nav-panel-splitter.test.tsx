import React, { useState } from 'react';

import Popup from '@atlaskit/popup';
import Tooltip from '@atlaskit/tooltip';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';
import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { TopNav } from '../../top-nav/top-nav';
import { TopNavEnd } from '../../top-nav/top-nav-end';
import { TopNavMiddle } from '../../top-nav/top-nav-middle';
import { TopNavStart } from '../../top-nav/top-nav-start';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
} from './_filter-from-console-error-output';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('SideNavPanelSplitter', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeEach(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
		resetMatchMedia();
		jest.useFakeTimers();
	});

	afterEach(() => {
		resetConsoleErrorSpyFn();
		jest.useRealTimers();
	});

	it('should be accessible', async () => {
		const { container } = render(
			<Root>
				<SideNav testId="sidenav">
					<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
				</SideNav>
			</Root>,
		);
		await expect(container).toBeAccessible();
	});

	it('should throw an error when not used within SideNav', () => {
		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => {
			render(
				<Root>
					<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
				</Root>,
			);
		}).toThrow(
			'Invariant failed: SideNavPanelSplitter must be rendered as a child of <SideNav />.',
		);
		consoleErrorSpy.mockRestore();
	});

	describe('double click panel splitter to collapse side nav', () => {
		it('should collapse the side nav on double click by default', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
					</SideNav>
				</Root>,
			);

			await user.dblClick(screen.getByTestId('panel-splitter'));

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
			expect(onCollapse).toHaveBeenCalledTimes(1);
			expect(onCollapse).toHaveBeenCalledWith({
				screen: 'desktop',
			});
		});

		ffTest.on('navx-full-height-sidebar', 'callback should include trigger', async () => {
			// Trigger info is behind separate instrumentation flag
			ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'analytics', () => {
				it('should collapse the side nav on double click by default', async () => {
					const user = createUser();
					const onCollapse = jest.fn();
					setMediaQuery('(min-width: 64rem)', { initial: true });

					render(
						<Root>
							<SideNav testId="sidenav" onCollapse={onCollapse}>
								<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
							</SideNav>
						</Root>,
					);

					await user.dblClick(screen.getByTestId('panel-splitter'));

					expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'false');
					expect(onCollapse).toHaveBeenCalledTimes(1);
					expect(onCollapse).toHaveBeenCalledWith({
						screen: 'desktop',
						trigger: 'double-click',
					});
				});
			});
		});

		it('should not collapse the side nav on double click when `shouldCollapseOnDoubleClick` is false', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter
							label="Resize or collapse side nav"
							testId="panel-splitter"
							shouldCollapseOnDoubleClick={false}
						/>
					</SideNav>
				</Root>,
			);

			await user.dblClick(screen.getByTestId('panel-splitter'));

			expect(screen.getByTestId('sidenav')).toHaveAttribute('data-visible', 'large');
			expect(onCollapse).not.toHaveBeenCalled();
		});
	});

	ffTest.on('navx-full-height-sidebar', 'with useIsFhsEnabled true', () => {
		it('should display a tooltip when the tooltipContent prop is provided and shouldCollapseOnDoubleClick is true', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter
							label="Resize or collapse side nav"
							testId="panel-splitter"
							tooltipContent="Double click to collapse"
							shouldCollapseOnDoubleClick={true}
						/>
					</SideNav>
				</Root>,
			);

			await user.hover(screen.getByTestId('panel-splitter'));
			act(() => {
				jest.runAllTimers();
			});

			expect(
				await screen.findByRole('tooltip', { name: 'Double click to collapse' }),
			).toBeInTheDocument();
		});

		it('should include the built-in keyboard shortcut in the tooltip when the shortcut is enabled on Root', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter
							label="Resize or collapse side nav"
							testId="panel-splitter"
							tooltipContent="Double click to collapse"
							shouldCollapseOnDoubleClick={true}
						/>
					</SideNav>
				</Root>,
			);

			await user.hover(screen.getByTestId('panel-splitter'));
			act(() => {
				jest.runAllTimers();
			});

			expect(
				await screen.findByRole('tooltip', { name: 'Double click to collapse Ctrl [' }),
			).toBeInTheDocument();
		});

		it('should not include the built-in keyboard shortcut in the tooltip when the shortcut is disabled on Root', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root isSideNavShortcutEnabled={false}>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter
							label="Resize or collapse side nav"
							testId="panel-splitter"
							tooltipContent="Double click to collapse"
							shouldCollapseOnDoubleClick={true}
						/>
					</SideNav>
				</Root>,
			);

			await user.hover(screen.getByTestId('panel-splitter'));
			act(() => {
				jest.runAllTimers();
			});

			expect(
				// Tooltip does not include keyboard shortcut
				await screen.findByRole('tooltip', { name: 'Double click to collapse' }),
			).toBeInTheDocument();
		});

		it('should not include the built-in keyboard shortcut in the tooltip when the isSideNavShortcutEnabled prop on Root is not provided', async () => {
			const user = createUser();
			const onCollapse = jest.fn();
			setMediaQuery('(min-width: 64rem)', { initial: true });

			render(
				<Root>
					<SideNav testId="sidenav" onCollapse={onCollapse}>
						<SideNavPanelSplitter
							label="Resize or collapse side nav"
							testId="panel-splitter"
							tooltipContent="Double click to collapse"
							shouldCollapseOnDoubleClick={true}
						/>
					</SideNav>
				</Root>,
			);

			await user.hover(screen.getByTestId('panel-splitter'));
			act(() => {
				jest.runAllTimers();
			});

			expect(
				// Tooltip does not include keyboard shortcut
				await screen.findByRole('tooltip', { name: 'Double click to collapse' }),
			).toBeInTheDocument();
		});

		ffTest.on('platform-dst-side-nav-layering-fixes', 'with layering fixes enabled', () => {
			it('should not render the panel splitter when there is an open popup in the side nav', () => {
				render(
					<Root>
						<SideNav testId="sidenav">
							<Popup
								shouldRenderToParent
								isOpen
								content={() => <div>Content</div>}
								trigger={({ ref }) => (
									<button type="button" ref={ref}>
										Popup trigger
									</button>
								)}
							/>
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();
			});

			it('should not render the panel splitter when there are open popups in top nav start', () => {
				render(
					<Root>
						<TopNav>
							<TopNavStart>
								<Popup
									shouldRenderToParent
									isOpen
									content={() => <div>Content</div>}
									trigger={({ ref }) => (
										<button type="button" ref={ref}>
											Popup trigger
										</button>
									)}
								/>
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav">
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();
			});

			it('should not render the panel splitter when there are open popups in top nav middle', () => {
				render(
					<Root>
						<TopNav>
							<TopNavMiddle>
								<Popup
									shouldRenderToParent
									isOpen
									content={() => <div>Content</div>}
									trigger={({ ref }) => (
										<button type="button" ref={ref}>
											Popup trigger
										</button>
									)}
								/>
							</TopNavMiddle>
						</TopNav>
						<SideNav testId="sidenav">
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();
			});

			it('should not render the panel splitter when there are open popups in top nav end', () => {
				render(
					<Root>
						<TopNav>
							<TopNavEnd>
								<Popup
									shouldRenderToParent
									isOpen
									content={() => <div>Content</div>}
									trigger={({ ref }) => (
										<button type="button" ref={ref}>
											Popup trigger
										</button>
									)}
								/>
							</TopNavEnd>
						</TopNav>
						<SideNav testId="sidenav">
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();
			});

			it('should correctly enable and disable the panel splitter when popups are opened and then closed', async () => {
				const user = createUser();

				function TestComponent() {
					const [isPopupOpen, setIsPopupOpen] = useState(false);

					return (
						<Root>
							<SideNav testId="sidenav">
								<Popup
									shouldRenderToParent
									isOpen={isPopupOpen}
									onClose={() => setIsPopupOpen(false)}
									content={() => <div>Content</div>}
									trigger={({ ref }) => (
										<button type="button" ref={ref} onClick={() => setIsPopupOpen((prev) => !prev)}>
											Popup trigger
										</button>
									)}
								/>
								<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
							</SideNav>
						</Root>
					);
				}

				render(<TestComponent />);

				// Panel splitter should not rendered initially as the popup is closed
				expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();

				// Click on the popup trigger to open the popup
				await user.click(screen.getByText('Popup trigger'));

				// Panel splitter should not be rendered
				expect(screen.queryByTestId('panel-splitter')).not.toBeInTheDocument();

				// Click on the popup trigger to close the popup
				await user.click(screen.getByText('Popup trigger'));

				// Panel splitter should be rendered
				expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();
			});

			it('should still render the panel splitter when there are open tooltips in the side nav', async () => {
				const user = createUser();

				render(
					<Root>
						<SideNav testId="sidenav">
							<Tooltip content="Tooltip content">
								<button type="button">Tooltip trigger</button>
							</Tooltip>
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				await user.hover(screen.getByText('Tooltip trigger'));
				act(() => {
					jest.runAllTimers();
				});

				expect(await screen.findByRole('tooltip', { name: 'Tooltip content' })).toBeInTheDocument();

				expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();
			});

			it('should still render the panel splitter when there are open tooltips in the top nav', async () => {
				const user = createUser();

				render(
					<Root>
						<TopNav>
							<TopNavStart>
								<Tooltip content="Tooltip content">
									<button type="button">Tooltip trigger</button>
								</Tooltip>
							</TopNavStart>
						</TopNav>
						<SideNav testId="sidenav">
							<SideNavPanelSplitter label="Resize or collapse side nav" testId="panel-splitter" />
						</SideNav>
					</Root>,
				);

				await user.hover(screen.getByText('Tooltip trigger'));
				act(() => {
					jest.runAllTimers();
				});

				expect(await screen.findByRole('tooltip', { name: 'Tooltip content' })).toBeInTheDocument();

				expect(screen.getByTestId('panel-splitter')).toBeInTheDocument();
			});
		});
	});
});
