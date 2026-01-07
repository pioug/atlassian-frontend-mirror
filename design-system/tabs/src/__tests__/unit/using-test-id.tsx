import React from 'react';

import { render, screen } from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Tabs should be found by data-testid', () => {
	test('Using screen.getByTestId()', async () => {
		const tabsTestId = 'the-tabs';
		const testIds = ['one', 'two', 'three'];
		render(
			<Tabs testId={tabsTestId} id="test">
				<TabList>
					{testIds.map((testId) => (
						<Tab key={testId} testId={testId}>
							{testId}
						</Tab>
					))}
				</TabList>
				{testIds.map((testId) => (
					<TabPanel key={testId} testId={`${testId}-panel`}>
						{testId} panel
					</TabPanel>
				))}
			</Tabs>,
		);

		expect(screen.getByTestId(tabsTestId)).toBeInTheDocument();
		testIds.forEach((testId) => {
			const tab = screen.getByTestId(testId);
			expect(tab).toBeInTheDocument();
			expect(tab.innerText).toMatch(testId);
		});
		// Only selected tab panel would render
		const tabPanel = screen.getByTestId(`${testIds[0]}-panel`);
		expect(tabPanel).toBeInTheDocument();
		expect(tabPanel.innerText).toBe(`${testIds[0]} panel`);
	});
});
