import React from 'react';

import { IntlProvider } from 'react-intl';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { render, screen, userEvent } from '@atlassian/testing-library';

import '@atlaskit/link-test-helpers/jest';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { SmartLinkModalProvider } from '../../../../../../state/modal';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import type { LinkActionProps } from '../../types';
import AutomationAction from '../index';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('AutomationAction', () => {
	const testId = 'smart-action-automation-action';

	const setup = (props?: LinkActionProps) => {
		const onEvent = jest.fn();

		return render(
			<SmartCardProvider>
				<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
					<IntlProvider locale="en">
						<SmartLinkModalProvider>
							<AutomationAction {...props} as="button" />
						</SmartLinkModalProvider>
					</IntlProvider>
				</AnalyticsListener>
			</SmartCardProvider>,
		);
	};

	it('renders stack item action', async () => {
		setup();
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('View automation rules');
	});

	describe('with tooltip', () => {
		it('renders stack item tooltip', async () => {
			setup();

			const element = await screen.findByTestId(testId);
			await userEvent.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Select an automation rule to run');
		});
		it('renders updated tooltip after onClick', async () => {
			setup();

			const element = await screen.findByTestId(testId);
			await userEvent.click(element);

			const modal = await screen.findByTestId('smart-card-automation-action-modal');
			expect(modal).toBeInTheDocument();
		});
	});
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});
});
