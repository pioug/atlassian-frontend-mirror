import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import { mockAnalytics } from '../../../../utils/mocks';
import { InlineCardUnauthorizedView } from '../index';

describe('Unauthorised View', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	ffTest.both('smart-card-migrate-track-analytics', 'Unauthorised View', () => {
		it('should have correct text', () => {
			const testUrl = 'http://unauthorised-test/';
			const { container } = render(
				<IntlProvider locale="en">
					<InlineCardUnauthorizedView url={testUrl} analytics={mockAnalytics} />
				</IntlProvider>,
			);

			expect(container.textContent).toEqual(testUrl);
		});

		it('should have a link to the url', () => {
			const testUrl = 'http://unauthorised-test/';
			render(
				<IntlProvider locale="en">
					<InlineCardUnauthorizedView url={testUrl} analytics={mockAnalytics} />
				</IntlProvider>,
			);
			const link = screen.getByText(testUrl, { exact: false }).closest('a');

			expect(link).not.toBeNull;
			expect(link!.href).toBe(testUrl);
		});

		it('should show correct text if action is available', () => {
			const testUrl = 'http://unauthorised-test/';

			const { container } = render(
				<IntlProvider locale="en">
					<InlineCardUnauthorizedView
						context="3P"
						url={testUrl}
						onAuthorise={jest.fn()}
						analytics={mockAnalytics}
					/>
				</IntlProvider>,
			);

			expect(container.textContent).toEqual(`${testUrl}Connect your 3P account`);
		});

		it('should not redirect user if they do not click on the authorize button', () => {
			const onClick = jest.fn();
			const onAuthorise = jest.fn();
			const testUrl = 'http://unauthorised-test/';
			render(
				<IntlProvider locale="en">
					<InlineCardUnauthorizedView
						url={testUrl}
						onClick={onClick}
						onAuthorise={onAuthorise}
						analytics={mockAnalytics}
					/>
				</IntlProvider>,
			);

			const message = screen.getByText(testUrl);
			fireEvent.click(message!);
			expect(onClick).toHaveBeenCalled();
			expect(onAuthorise).not.toHaveBeenCalled();
		});
	});
});
