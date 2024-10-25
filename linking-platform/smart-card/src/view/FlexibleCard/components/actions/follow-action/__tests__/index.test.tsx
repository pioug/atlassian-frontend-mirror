import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import FollowAction from '../index';
import { type FollowActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('FollowAction', () => {
	const testId = 'smart-action-follow-action';

	const setup = (props?: Partial<FollowActionProps>) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<SmartCardProvider>
						<FollowAction {...props} />
					</SmartCardProvider>
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	describe('existing follow action button', () => {
		it('renders follow action button', async () => {
			setup();
			const element = await screen.findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element.textContent).toBe('Follow');
		});

		it('renders tooltip', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip.textContent).toBe('Follow');
		});
	});
});
