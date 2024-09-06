import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import DynamicTable from '../../stateless';

import { head, rows } from './_data';

describe('DynamicTable', () => {
	it('should fire an analytics event onSort', () => {
		const onEvent = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onEvent}>
				<DynamicTable head={head} rows={rows} />,
			</AnalyticsListener>,
		);

		const column: HTMLElement = screen.getByText('First name');

		fireEvent.click(column);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'sorted',
				actionSubject: 'dynamicTable',
				attributes: {
					componentName: 'dynamicTable',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'dynamicTable',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onEvent).toHaveBeenCalledTimes(1);
		expect(onEvent.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onEvent.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should export analytics event to onRankEnd handler', () => {
		const onSort = jest.fn();

		render(<DynamicTable head={head} rows={rows} onSort={onSort} />);

		const column: HTMLElement = screen.getByText('First name');

		fireEvent.click(column);

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'sorted',
				actionSubject: 'dynamicTable',
				attributes: {
					componentName: 'dynamicTable',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'dynamicTable',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			],
		});

		expect(onSort).toHaveBeenCalledTimes(1);
		expect(onSort).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				payload: expected.payload,
				context: expected.context,
			}),
		);
	});
});
