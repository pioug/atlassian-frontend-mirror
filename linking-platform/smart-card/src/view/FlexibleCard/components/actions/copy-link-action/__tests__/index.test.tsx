import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl-next';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import CopyLinkAction from '../index';
import { type CopyLinkActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('CopyLinkAction', () => {
	const testId = 'smart-action-copy-link-action';

	const setup = (props?: CopyLinkActionProps) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<CopyLinkAction {...props} as="stack-item" />
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	it('renders stack item action', async () => {
		const { findByTestId } = setup();
		const element = await findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.textContent).toBe('Copy link');
	});

	describe('with tooltip', () => {
		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Copy link');
		});

		it('renders updated tooltip after onClick', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			await user.click(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Copied!');
		});

		it('resets tooltip message after tooltip hides', async () => {
			const user = userEvent.setup();
			const { findAllByText, queryAllByText, findByTestId } = setup();

			const element = await findByTestId(testId);

			await user.click(element);
			await findAllByText('Copied!');

			await user.unhover(element);
			await waitForElementToBeRemoved(() => queryAllByText(`Copied!`));

			await userEvent.hover(element);
			const tooltip = await findAllByText('Copy link');
			expect(tooltip).toBeTruthy();
		});
	});
});
