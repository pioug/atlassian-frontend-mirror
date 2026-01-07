import React, { type ReactNode } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import { Text } from '@atlaskit/primitives/compiled';

import Tabs, { Tab, TabList, TabPanel, useTabPanel } from '../../index';
import { TabPanelContext } from '../../internal/context';

const CustomTabPanel = ({ children }: { children: ReactNode }) => {
	const context = useTabPanel();
	return (
		// eslint-disable-next-line @atlassian/a11y/no-static-element-interactions
		<span {...context} onFocus={noop}>
			{children}
		</span>
	);
};

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('@atlaskit/tabs', () => {
	describe('tab panel', () => {
		it('should throw an error if context not provided', () => {
			const err = console.error;
			console.error = jest.fn();

			let errorMessage = '';
			try {
				render(<TabPanel>Tab Panel</TabPanel>);
			} catch (e) {
				errorMessage = e instanceof Error ? e.message : String(e);
			}

			expect(errorMessage).toBe('@atlaskit/tabs:  A TabPanel must have a Tabs parent.');

			// Restore writing to stderr.
			console.error = err;
		});

		it('should accept any react node as a child', () => {
			render(
				<TabPanelContext.Provider
					value={{
						role: 'tabpanel',
						id: '0-1-tab',
						hidden: false,
						'aria-labelledby': '1',
						tabIndex: 0,
					}}
				>
					<TabPanel>
						<div data-testid="panel-1">Tab Panel</div>
					</TabPanel>
				</TabPanelContext.Provider>,
			);

			expect(screen.getByTestId('panel-1')).toBeInTheDocument();
		});

		it('should map props in context correctly', () => {
			render(
				<TabPanelContext.Provider
					value={{
						role: 'tabpanel',
						id: '0-1-tab',
						hidden: false,
						'aria-labelledby': '1',
						tabIndex: 0,
					}}
				>
					<TabPanel>Label 1</TabPanel>
				</TabPanelContext.Provider>,
			);

			const tabPanel = screen.getByRole('tabpanel');
			expect(tabPanel).toHaveAttribute('aria-labelledby', '1');
			expect(tabPanel.id).toBe('0-1-tab');
			expect(tabPanel.hidden).toBe(false);
			expect(tabPanel.tabIndex).toBe(0);
		});
	});

	describe('Custom tab panel using useTabPanel', () => {
		it('will reflect changes in the TabPanelContext and render correctly', () => {
			render(
				<TabPanelContext.Provider
					value={{
						role: 'tabpanel',
						'aria-labelledby': '1',
						id: '1-1-tab',
						tabIndex: 0,
					}}
				>
					<CustomTabPanel>Panel 1</CustomTabPanel>
				</TabPanelContext.Provider>,
			);

			const tabPanel = screen.getByRole('tabpanel');
			expect(tabPanel).toHaveAttribute('aria-labelledby', '1');
			expect(tabPanel.id).toBe('1-1-tab');
			expect(tabPanel.hidden).toBe(false);
			expect(tabPanel.tabIndex).toBe(0);
		});

		it('will reflect changes in the TabPanelContext when wrapped in a div', () => {
			render(
				<TabPanelContext.Provider
					value={{
						role: 'tabpanel',
						'aria-labelledby': 'tabpanel-label',
						id: '1-1-tab',
						tabIndex: 0,
					}}
				>
					<div>
						<Text id="tabpanel-label">Tabpanel</Text>
						<CustomTabPanel>Panel 1</CustomTabPanel>
					</div>
				</TabPanelContext.Provider>,
			);

			const tabPanel = screen.getByRole('tabpanel', {
				name: 'Tabpanel',
			});
			expect(tabPanel.id).toBe('1-1-tab');
			expect(tabPanel).toBeVisible();
			expect(tabPanel.tabIndex).toBe(0);
		});

		it('should not unmount a custom TabPanel when changed', async () => {
			render(
				<Tabs id="test">
					<TabList>
						<Tab>Tab 1 label</Tab>
						<Tab>Tab 2 label</Tab>
					</TabList>
					<CustomTabPanel>Tab 1 panel</CustomTabPanel>
					<CustomTabPanel>Tab 2 panel</CustomTabPanel>
				</Tabs>,
			);

			fireEvent.click(screen.getByText('Tab 2 label'));

			expect(screen.getByText('Tab 1 panel')).not.toBeVisible();
			expect(screen.getByText('Tab 2 panel')).toBeVisible();
		});
	});
});
