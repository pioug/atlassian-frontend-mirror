import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { setMediaQuery } from '@atlassian/test-utils';

import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';
import { SideNavToggleButton } from '../../side-nav/toggle-button';
import { TopNav } from '../../top-nav/top-nav';

type OnAnalyticsEventMock = jest.Mock<unknown, [UIAnalyticsEvent, string | undefined], unknown>;

function filterByAction(mockFn: OnAnalyticsEventMock, action: string) {
	return (event: UIAnalyticsEvent, channel?: string) => {
		if (event.payload.action === action) {
			mockFn(event, channel);
		}
	};
}

window.scrollTo = noop;

ffTest.both('platform_dst_nav4_side_nav_default_collapsed_api', 'default state changes', () => {
	ffTest.on('platform_dst_nav4_fhs_instrumentation_1', 'analytics', () => {
		describe('sideNavMenu viewedOnLoad', () => {
			it('should fire if the menu is open on initial load (desktop)', () => {
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener channel="navigation" onEvent={onAnalyticsEvent}>
						<Root defaultSideNavCollapsed={false}>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							</TopNav>
							<SideNav>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'viewedOnLoad',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						screen: 'desktop',
					},
				});
			});

			it('should not fire if the menu is closed on initial load (desktop)', () => {
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener channel="navigation" onEvent={onAnalyticsEvent}>
						<Root defaultSideNavCollapsed>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							</TopNav>
							<SideNav defaultCollapsed>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);
			});

			it('should not fire for initial loads on mobile', () => {
				setMediaQuery('(min-width: 64rem)', { initial: false });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener channel="navigation" onEvent={onAnalyticsEvent}>
						<Root defaultSideNavCollapsed={false}>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							</TopNav>
							<SideNav>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);
			});
		});

		describe('sideNavButton hovered', () => {
			it('should fire after hovering the toggle button', async () => {
				const user = userEvent.setup();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener
						channel="navigation"
						onEvent={filterByAction(onAnalyticsEvent, 'hovered')}
					>
						<Root defaultSideNavCollapsed={false}>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							</TopNav>
							<SideNav>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				await user.hover(screen.getByRole('button', { name: 'Collapse sidebar' }));

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'hovered',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavButton',
					attributes: {
						itemState: 'expanded',
						screen: 'desktop',
					},
				});

				await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
				onAnalyticsEvent.mockClear();

				await user.unhover(screen.getByRole('button', { name: 'Expand sidebar' }));
				await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'hovered',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavButton',
					attributes: {
						itemState: 'collapsed',
						screen: 'desktop',
					},
				});
			});

			it('should not fire on mobile', async () => {
				const user = userEvent.setup();
				setMediaQuery('(min-width: 64rem)', { initial: false });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener
						channel="navigation"
						onEvent={filterByAction(onAnalyticsEvent, 'hovered')}
					>
						<Root defaultSideNavCollapsed={false}>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							</TopNav>
							<SideNav>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				await user.hover(screen.getByRole('button', { name: 'Expand sidebar' }));
				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);
			});
		});

		describe('sideNav expanded', () => {
			it('should fire when expanding from the toggle button', async () => {
				const user = userEvent.setup();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener
						channel="navigation"
						onEvent={filterByAction(onAnalyticsEvent, 'expanded')}
					>
						<Root defaultSideNavCollapsed>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							</TopNav>
							<SideNav defaultCollapsed>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

				await user.click(screen.getByRole('button', { name: 'Expand sidebar' }));

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'expanded',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						trigger: 'toggle-button',
					},
				});
			});

			it('should fire when expanding from a skip link', async () => {
				const user = userEvent.setup({ pointerEventsCheck: 0 });
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener
						channel="navigation"
						onEvent={filterByAction(onAnalyticsEvent, 'expanded')}
					>
						<Root defaultSideNavCollapsed>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
									defaultCollapsed
								/>
							</TopNav>
							<SideNav defaultCollapsed>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

				await user.click(screen.getByRole('link', { name: 'Sidebar' }));

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'expanded',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						trigger: 'skip-link',
					},
				});
			});

			ffTest.on('navx-full-height-sidebar', 'with useIsFhsEnabled true', () => {
				it('should fire when expanding from the keyboard shortcut', async () => {
					const user = userEvent.setup();
					setMediaQuery('(min-width: 64rem)', { initial: true });

					const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

					render(
						<AnalyticsListener
							channel="navigation"
							onEvent={filterByAction(onAnalyticsEvent, 'expanded')}
						>
							<Root defaultSideNavCollapsed isSideNavShortcutEnabled>
								<TopNav>
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
										defaultCollapsed
									/>
								</TopNav>
								<SideNav defaultCollapsed>side nav</SideNav>
							</Root>
						</AnalyticsListener>,
					);

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

					/**
					 * Docs for key syntax are available at https://testing-library.com/docs/user-event/keyboard/.
					 *
					 * - The `{}` allow writing input by `KeyboardEvent.key` name. This is needed for `Control` because it is not a printable character.
					 * - The `>` keeps it pressed.
					 * - The `[[` is needed for a literal `[` because `[` is treated as a special character.
					 */
					await user.keyboard('{Control>}[[');

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
					expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
						source: 'topNav',
						action: 'expanded',
						actionSubject: 'sideNav',
						actionSubjectId: 'sideNavMenu',
						attributes: {
							trigger: 'keyboard',
						},
					});
				});
			});
		});

		describe('sideNav collapsed', () => {
			it('should fire when collapsing from the toggle button', async () => {
				const user = userEvent.setup();
				setMediaQuery('(min-width: 64rem)', { initial: true });

				const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

				render(
					<AnalyticsListener
						channel="navigation"
						onEvent={filterByAction(onAnalyticsEvent, 'collapsed')}
					>
						<Root>
							<TopNav>
								<SideNavToggleButton
									collapseLabel="Collapse sidebar"
									expandLabel="Expand sidebar"
								/>
							</TopNav>
							<SideNav>side nav</SideNav>
						</Root>
					</AnalyticsListener>,
				);

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

				await user.click(screen.getByRole('button', { name: 'Collapse sidebar' }));

				expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
				expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
					source: 'topNav',
					action: 'collapsed',
					actionSubject: 'sideNav',
					actionSubjectId: 'sideNavMenu',
					attributes: {
						trigger: 'toggle-button',
					},
				});
			});

			ffTest.on('navx-full-height-sidebar', 'with useIsFhsEnabled true', () => {
				it('should fire when collapsing from the keyboard shortcut', async () => {
					const user = userEvent.setup();
					setMediaQuery('(min-width: 64rem)', { initial: true });

					const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

					render(
						<AnalyticsListener
							channel="navigation"
							onEvent={filterByAction(onAnalyticsEvent, 'collapsed')}
						>
							<Root isSideNavShortcutEnabled>
								<TopNav>
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								</TopNav>
								<SideNav>side nav</SideNav>
							</Root>
						</AnalyticsListener>,
					);

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

					/**
					 * Docs for key syntax are available at https://testing-library.com/docs/user-event/keyboard/.
					 *
					 * - The `{}` allow writing input by `KeyboardEvent.key` name. This is needed for `Control` because it is not a printable character.
					 * - The `>` keeps it pressed.
					 * - The `[[` is needed for a literal `[` because `[` is treated as a special character.
					 */
					await user.keyboard('{Control>}[[');

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
					expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
						source: 'topNav',
						action: 'collapsed',
						actionSubject: 'sideNav',
						actionSubjectId: 'sideNavMenu',
						attributes: {
							trigger: 'keyboard',
						},
					});
				});

				it('should fire when collapsing from the panel splitter', async () => {
					const user = userEvent.setup();
					setMediaQuery('(min-width: 64rem)', { initial: true });

					const onAnalyticsEvent: OnAnalyticsEventMock = jest.fn();

					render(
						<AnalyticsListener
							channel="navigation"
							onEvent={filterByAction(onAnalyticsEvent, 'collapsed')}
						>
							<Root isSideNavShortcutEnabled>
								<TopNav>
									<SideNavToggleButton
										collapseLabel="Collapse sidebar"
										expandLabel="Expand sidebar"
									/>
								</TopNav>
								<SideNav>
									side nav
									<SideNavPanelSplitter
										label="Double click to collapse"
										testId="panel-splitter"
										shouldCollapseOnDoubleClick
									/>
								</SideNav>
							</Root>
						</AnalyticsListener>,
					);

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(0);

					await user.dblClick(screen.getByTestId('panel-splitter'));

					expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);
					expect(onAnalyticsEvent.mock.calls[0][0].payload).toEqual({
						source: 'topNav',
						action: 'collapsed',
						actionSubject: 'sideNav',
						actionSubjectId: 'sideNavMenu',
						attributes: {
							trigger: 'double-click',
						},
					});
				});
			});
		});
	});
});
