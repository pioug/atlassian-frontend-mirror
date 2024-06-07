import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl-next';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import PreviewAction from '../index';
import { type PreviewActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('PreviewAction', () => {
	const testId = 'smart-action-preview-action';
	const modalTestId = 'smart-embed-preview-modal';

	const setup = (props?: Partial<PreviewActionProps>) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<PreviewAction {...props} />
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	it('renders action', async () => {
		const { findByTestId } = setup();
		const element = await findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.textContent).toBe('Open preview');
	});

	it('opens embed modal on click', async () => {
		const user = userEvent.setup();
		const onClick = jest.fn();

		const { findByTestId } = setup({ onClick });
		const element = await findByTestId(testId);

		user.click(element);

		const modal = await findByTestId(modalTestId);
		expect(modal).toBeInTheDocument();
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	describe('with tooltip', () => {
		it('renders tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Open preview');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup({ as: 'stack-item' });

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Open a full screen preview of this link');
		});
	});
});
