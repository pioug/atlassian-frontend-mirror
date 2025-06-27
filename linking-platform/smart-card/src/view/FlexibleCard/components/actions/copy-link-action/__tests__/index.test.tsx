import '@atlaskit/link-test-helpers/jest';

import React from 'react';

import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import * as useInvokeClientAction from '../../../../../../state/hooks/use-invoke-client-action';
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
		setup();
		const element = await screen.findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveTextContent('Copy link');
	});

	it('invokes action', async () => {
		const invoke = jest.fn();
		const spy = jest.spyOn(useInvokeClientAction, 'default').mockReturnValue(invoke);

		setup();

		const element = await screen.findByTestId(testId);
		await userEvent.click(element);

		expect(invoke).toHaveBeenCalledTimes(1);

		spy.mockRestore();
	});

	describe('with tooltip', () => {
		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);
			await user.hover(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Copy link');
		});

		it('renders updated tooltip after onClick', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);
			await user.click(element);

			const tooltip = await screen.findByRole('tooltip');
			expect(tooltip).toHaveTextContent('Copied!');
		});

		it('resets tooltip message after tooltip hides', async () => {
			const user = userEvent.setup();
			setup();

			const element = await screen.findByTestId(testId);

			await user.click(element);
			await screen.findAllByText('Copied!');

			await user.unhover(element);
			await waitForElementToBeRemoved(() => screen.queryAllByText(`Copied!`));

			await userEvent.hover(element);
			const tooltip = await screen.findAllByText('Copy link');
			expect(tooltip).toBeTruthy();
		});
	});
	it('should capture and report a11y violations', async () => {
		const { container } = setup();
		await expect(container).toBeAccessible();
	});
});
