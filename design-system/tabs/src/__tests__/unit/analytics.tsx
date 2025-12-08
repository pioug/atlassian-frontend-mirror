import React from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Tabs, { Tab, TabList, TabPanel } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Tabs analytics', () => {
	it(`should fire an event on the public channel and the internal channel when tabs are changed`, async () => {
		const user = userEvent.setup();
		const onPublicEvent = jest.fn();
		const onAtlaskitEvent = jest.fn();

		render(
			<AnalyticsListener onEvent={onAtlaskitEvent}>
				<AnalyticsListener onEvent={onPublicEvent}>
					<Tabs
						onChange={(_index, analyticsEvent) => {
							analyticsEvent.fire();
						}}
						id="test"
					>
						<TabList>
							<Tab>Tab 1</Tab>
							<Tab>Tab 2</Tab>
						</TabList>
						<TabPanel>One</TabPanel>
						<TabPanel>Two</TabPanel>
					</Tabs>
				</AnalyticsListener>
			</AnalyticsListener>,
		);

		const tab2: HTMLElement = screen.getByText('Tab 2');
		await user.click(tab2);

		const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
			payload: {
				action: 'clicked',
				actionSubject: 'tabs',
				attributes: {
					componentName: 'tabs',
					packageName,
					packageVersion,
				},
			},
			context: [
				{
					componentName: 'tabs',
					packageName,
					packageVersion,
				},
			],
		});

		// Check the public event has been fired
		expect(onPublicEvent).toHaveBeenCalledTimes(1);
		expect(onPublicEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onPublicEvent.mock.calls[0][0].context).toEqual(expected.context);

		// Check the atlaskit event has been fired
		expect(onAtlaskitEvent).toHaveBeenCalledTimes(1);
		expect(onAtlaskitEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onAtlaskitEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should allow the addition of additional context on Tabs', async () => {
		const user = userEvent.setup();
		const onEvent = jest.fn();
		const extraContext = { hello: 'world' };

		render(
			<AnalyticsListener onEvent={onEvent} channel={'atlaskit'}>
				<Tabs
					onChange={(_index, analyticsEvent) => {
						analyticsEvent.fire();
					}}
					analyticsContext={extraContext}
					id="test"
				>
					<TabList>
						<Tab>Tab 1</Tab>
						<Tab>Tab 2</Tab>
					</TabList>
					<TabPanel>One</TabPanel>
					<TabPanel>Two</TabPanel>
				</Tabs>
			</AnalyticsListener>,
		);

		const tab2: HTMLElement = screen.getByText('Tab 2');
		await user.click(tab2);

		expect(onEvent.mock.calls[0][0].context[0]).toEqual(expect.objectContaining(extraContext));
	});

	it('should not error if there is no analytics provider on Tabs', () => {
		const error = jest.spyOn(console, 'error');

		let errorMessage = '';
		try {
			render(
				<Tabs id="analytics">
					<TabList>
						<Tab>Tab 1</Tab>
						<Tab>Tab 2</Tab>
					</TabList>
					<TabPanel>One</TabPanel>
					<TabPanel>Two</TabPanel>
				</Tabs>,
			);
		} catch (e) {
			errorMessage = e instanceof Error ? e.message : String(e);
		}

		expect(errorMessage).toBe('');
		expect(error).not.toHaveBeenCalled();
		error.mockRestore();
	});
});
