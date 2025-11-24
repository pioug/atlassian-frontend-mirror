import React from 'react';

import { ffTest } from '@atlassian/feature-flags-test-utils';
import { resetMatchMedia, setMediaQuery } from '@atlassian/test-utils';
import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';

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
	});
});
