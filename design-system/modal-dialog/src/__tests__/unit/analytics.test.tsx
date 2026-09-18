import React from 'react';

import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import { fireEvent, render } from '@atlassian/testing-library';

import ModalDialog from '../../modal-dialog';
import ModalTransition from '../../modal-transition';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('modal dialog analytics', () => {
	it('should fire analytics when the modal dialog is closed from within', () => {
		const callback = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={callback}>
				<ModalTransition>
					<ModalDialog testId="modal-analytics" label="Modal Analytics" />
				</ModalTransition>
			</AnalyticsListener>,
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(callback.mock.calls[0][0].context).toEqual([
			{
				componentName: 'modalDialog',
				packageName: '@product/platform',
				packageVersion: '0.0.0',
			},
		]);
		expect(callback.mock.calls[0][0].payload).toEqual({
			action: 'closed',
			actionSubject: 'modalDialog',
			attributes: {
				componentName: 'modalDialog',
				packageName: '@product/platform',
				packageVersion: '0.0.0',
			},
		});
	});

	it('should callback with the analytic event on close', () => {
		const callback = jest.fn();

		render(
			<AnalyticsListener channel="atlaskit" onEvent={jest.fn()}>
				<ModalTransition>
					<ModalDialog onClose={callback} testId="modal-analytics" label="Modal Analytics" />
				</ModalTransition>
			</AnalyticsListener>,
		);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(callback.mock.calls[0][1].context).toEqual([
			{
				componentName: 'modalDialog',
				packageName: '@product/platform',
				packageVersion: '0.0.0',
			},
		]);
		expect(callback.mock.calls[0][1].payload).toEqual({
			action: 'closed',
			actionSubject: 'modalDialog',
			attributes: {
				componentName: 'modalDialog',
				packageName: '@product/platform',
				packageVersion: '0.0.0',
			},
		});
	});
});
