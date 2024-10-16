import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { FormattedMessage, IntlProvider } from 'react-intl-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import FollowAction from '../index';
import { messages } from '../../../../../../messages';

import type { FollowActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiAnalyticsContext: jest.fn(),
	useFlexibleUiContext: jest.fn().mockReturnValue({
		actions: {
			FollowAction: {
				action: {
					actionType: 'UnfollowEntityAction',
					resourceIdentifiers: {
						ari: 'some-resource-identifier',
					},
				},
				providerKey: 'object-provider',
				value: false,
				isProject: false,
			},
		},
	}),
}));

jest.mock('../../../../../../state/hooks/use-invoke', () => jest.fn().mockReturnValue(jest.fn()));

describe('Unfollow Goal Action', () => {
	const testId = 'smart-action-follow-action';

	const setup = (props?: Partial<FollowActionProps>) =>
		render(
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FollowAction {...props} />
				</SmartCardProvider>
			</IntlProvider>,
		);

	describe('new stack item unfollow goal', () => {
		it('renders unfollow stack item action', async () => {
			setup({ as: 'stack-item' });
			const element = await screen.findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element.textContent).toBe('Unfollow goal');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			setup({ as: 'stack-item' });

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip.textContent).toBe('Unfollow to stop receiving notifications for this goal');
		});

		it('renders project icon', async () => {
			setup({ as: 'stack-item' });
			const element = await screen.findByTestId('smart-action-follow-action-goal-icon');
			expect(element).toBeInTheDocument();
		});
	});

	it('invokes onClick callback', async () => {
		userEvent.setup();

		const mockOnClick = jest.fn();

		setup({
			as: 'stack-item',
			onClick: mockOnClick,
		});

		const element = screen.getByTestId(testId);
		await userEvent.click(element);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('invokes error callback on failure', async () => {
		userEvent.setup();

		const mockErrorCallback = jest.fn();
		const mockOnClick = jest.fn().mockImplementation(() => {
			throw new Error('Error');
		});

		setup({
			as: 'stack-item',
			onError: mockErrorCallback,
			onClick: mockOnClick,
		});

		const element = await screen.findByTestId(testId);
		await userEvent.click(element);

		expect(mockErrorCallback).toHaveBeenCalledWith({
			appearance: 'error',
			title: <FormattedMessage {...messages.unfollow_goal_error} />,
		});
	});
});
