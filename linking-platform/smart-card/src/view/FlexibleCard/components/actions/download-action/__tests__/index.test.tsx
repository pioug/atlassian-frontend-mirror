import { AnalyticsListener } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import '@atlaskit/link-test-helpers/jest';
import { IntlProvider } from 'react-intl-next';
import mockContext from '../../../../../../__fixtures__/flexible-ui-data-context';
import { ANALYTICS_CHANNEL } from '../../../../../../utils/analytics';
import DownloadAction from '../index';
import { type DownloadActionProps } from '../types';

jest.mock('../../../../../../state/flexible-ui-context', () => ({
	...jest.requireActual('../../../../../../state/flexible-ui-context'),
	useFlexibleUiContext: jest.fn().mockReturnValue(mockContext),
}));

describe('DownloadAction', () => {
	const testId = 'smart-action-download-action';

	const setup = (props?: Partial<DownloadActionProps>) => {
		const onEvent = jest.fn();

		return render(
			<AnalyticsListener onEvent={onEvent} channel={ANALYTICS_CHANNEL}>
				<IntlProvider locale="en">
					<DownloadAction {...props} />
				</IntlProvider>
			</AnalyticsListener>,
		);
	};

	it('renders action', async () => {
		const { findByTestId } = setup();
		const element = await findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.textContent).toBe('Download');
	});

	it('renders stack item action', async () => {
		const { findByTestId } = setup({ as: 'stack-item' });
		const element = await findByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.textContent).toBe('Download file');
	});

	describe('with tooltip', () => {
		it('renders tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup();

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Download');
		});

		it('renders stack item tooltip', async () => {
			const user = userEvent.setup();
			const { findByRole, findByTestId } = setup({ as: 'stack-item' });

			const element = await findByTestId(testId);
			await user.hover(element);

			const tooltip = await findByRole('tooltip');
			expect(tooltip.textContent).toBe('Download this file into your local storage');
		});
	});
});
