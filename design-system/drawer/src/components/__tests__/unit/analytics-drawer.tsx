import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Drawer from '../../index';

describe('Drawer', () => {
	it('should fire an analytics event', () => {
		const onClose = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={onClose}>
				<Drawer isOpen onClose={onClose} testId="test-drawer" width="narrow" label="Default drawer">
					<span>Content</span>
				</Drawer>
			</AnalyticsListener>,
		);

		fireEvent.keyDown(screen.getByTestId('drawer-contents'), { key: 'Escape' });

		expect(onClose).toHaveBeenCalled();

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'dismissed',
				actionSubject: 'drawer',
				attributes: {
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
					trigger: 'escKey',
				},
			],
		});

		expect(onClose.mock.calls[0][0].payload).toEqual(expected.payload);
		expect(onClose.mock.calls[0][0].context).toEqual(expected.context);
	});

	it('should fire analytics to onClose handler', () => {
		const onClose = jest.fn();

		render(
			<Drawer isOpen onClose={onClose} testId="test-drawer" width="narrow" label="Default drawer">
				<span>Content</span>
			</Drawer>,
		);

		fireEvent.keyDown(screen.getByTestId('drawer-contents'), { key: 'Escape' });

		const expected = new UIAnalyticsEvent({
			payload: {
				action: 'dismissed',
				actionSubject: 'drawer',
				attributes: {
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
				},
			},
			context: [
				{
					componentName: 'drawer',
					packageName: process.env._PACKAGE_NAME_,
					packageVersion: process.env._PACKAGE_VERSION_,
					trigger: 'escKey',
				},
			],
		});

		expect(onClose).toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ payload: expected.payload, context: expected.context }),
		);
	});
});
