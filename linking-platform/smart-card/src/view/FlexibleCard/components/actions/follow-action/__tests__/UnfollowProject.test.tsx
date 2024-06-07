import React from 'react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { FormattedMessage, IntlProvider } from 'react-intl-next';
import { SmartCardProvider } from '@atlaskit/link-provider';

import FollowAction from '../index';
import { messages } from '../../../../../../messages';

import type { FollowActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
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
				isProject: true,
			},
		},
	}),
}));

jest.mock('../../../../../../state/hooks/use-invoke', () => jest.fn().mockReturnValue(jest.fn()));

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiAnalyticsContext: jest.fn(),
}));

describe('UnfollowAction', () => {
	const testId = 'smart-action-follow-action';

	const setup = (props?: Partial<FollowActionProps>) =>
		render(
			<IntlProvider locale="en">
				<SmartCardProvider>
					<FollowAction {...props} />
				</SmartCardProvider>
			</IntlProvider>,
		);

	describe('existing unfollow action button', () => {
		it('renders unfollow action button', async () => {
			const { findByTestId } = setup();
			const element = await findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element.textContent).toBe('Unfollow');
		});

		it('renders tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Unfollow');
		});
	});

	describe('new stack item unfollow project', () => {
		it('renders unfollow stack item action', async () => {
			const { findByTestId } = setup({ as: 'stack-item' });
			const element = await findByTestId(testId);
			expect(element).toBeInTheDocument();
			expect(element.textContent).toBe('Unfollow project');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup({ as: 'stack-item' });

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Unfollow to stop receiving project notifications');
		});

		it('renders project icon', async () => {
			const { findByTestId } = setup({ as: 'stack-item' });
			const element = await findByTestId('smart-action-follow-action-projects-icon');
			expect(element).toBeInTheDocument();
		});
	});

	it('invokes onClick callback', async () => {
		userEvent.setup();

		const mockOnClick = jest.fn();

		const { getByTestId } = setup({
			as: 'stack-item',
			onClick: mockOnClick,
		});

		const element = getByTestId(testId);
		await userEvent.click(element);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('invokes error callback on failure', async () => {
		userEvent.setup();

		const mockErrorCallback = jest.fn();
		const mockOnClick = jest.fn().mockImplementation(() => {
			throw new Error('Error');
		});

		const { findByTestId } = setup({
			as: 'stack-item',
			onError: mockErrorCallback,
			onClick: mockOnClick,
		});

		const element = await findByTestId(testId);
		await userEvent.click(element);

		expect(mockErrorCallback).toHaveBeenCalledWith({
			appearance: 'error',
			title: <FormattedMessage {...messages.unfollow_project_error} />,
		});
	});
});
