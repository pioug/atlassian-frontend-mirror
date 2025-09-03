import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { SideNavPanelSplitter } from '../../panel-splitter/side-nav-panel-splitter';
import { Root } from '../../root';
import { SideNav } from '../../side-nav/side-nav';

import {
	filterFromConsoleErrorOutput,
	parseCssErrorRegex,
	type ResetConsoleErrorFn,
	resetMatchMedia,
	setMediaQuery,
} from './_test-utils';

describe('SideNavPanelSplitter', () => {
	let resetConsoleErrorSpyFn: ResetConsoleErrorFn;
	beforeEach(() => {
		resetConsoleErrorSpyFn = filterFromConsoleErrorOutput(parseCssErrorRegex);
		resetMatchMedia();
	});

	afterEach(() => {
		resetConsoleErrorSpyFn();
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
			const user = userEvent.setup();
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
			it('should collapse the side nav on double click by default', async () => {
				const user = userEvent.setup();
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

		it('should not collapse the side nav on double click when `shouldCollapseOnDoubleClick` is false', async () => {
			const user = userEvent.setup();
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
});
