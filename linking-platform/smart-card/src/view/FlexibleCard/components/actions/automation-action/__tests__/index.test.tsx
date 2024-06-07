import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import '@atlaskit/link-test-helpers/jest';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import AutomationAction from '../index';
import type { LinkActionProps } from '../../types';
import { SmartLinkModalProvider } from '../../../../../../state/modal';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('AutomationAction', () => {
	const testId = 'smart-action-automation-action';

	const setup = (props?: LinkActionProps) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<SmartLinkModalProvider>
						<AutomationAction {...props} as="button" />
					</SmartLinkModalProvider>
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	it('renders stack item action', async () => {
		const { findByTestId } = setup();
		const element = await findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.textContent).toBe('View automation rules...');
	});

	describe('with tooltip', () => {
		it('renders stack item tooltip', async () => {
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			userEvent.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Select an automation rule to run');
		});
		it('renders updated tooltip after onClick', async () => {
			const { findByTestId } = setup();

			const element = await findByTestId(testId);
			userEvent.click(element);

			const modal = await findByTestId('smart-card-automation-action-modal');
			expect(modal).toBeInTheDocument();
		});
	});
});
