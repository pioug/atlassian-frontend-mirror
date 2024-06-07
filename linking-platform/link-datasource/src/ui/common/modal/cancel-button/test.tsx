import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { useDatasourceAnalyticsEvents } from '../../../../analytics';

import { CancelButton, type CancelButtonProps } from './index';

jest.mock('../../../../analytics', () => ({
	useDatasourceAnalyticsEvents: jest.fn(),
}));

describe('CancelButton', () => {
	const analyticsPayload = {
		extensionKey: 'mock-object-provider',
		destinationObjectTypes: ['issue'],
		actions: [],
		searchCount: 0,
	};

	const setup = (propsOverride: Partial<CancelButtonProps> = {}) => {
		const mockOnCancelClick = jest.fn();
		const mockFireEvent = jest.fn();

		(useDatasourceAnalyticsEvents as jest.Mock).mockReturnValue({
			fireEvent: mockFireEvent,
		});

		const component = render(
			<IntlProvider locale="en">
				<CancelButton
					onCancel={mockOnCancelClick}
					getAnalyticsPayload={() => analyticsPayload}
					testId="mock-test-id"
					{...propsOverride}
				/>
			</IntlProvider>,
		);

		return { mockOnCancelClick, mockFireEvent, ...component };
	};

	it('renders the cancel button', () => {
		const { getByText } = setup();

		expect(getByText('Cancel')).toBeInTheDocument();
	});
	it('calls onCancelClick when the button is clicked', () => {
		const { getByText, mockOnCancelClick } = setup();

		fireEvent.click(getByText('Cancel'));

		expect(mockOnCancelClick).toHaveBeenCalledTimes(1);
	});

	it('fires analytic event when the cancel button is clicked', () => {
		const { getByText, mockFireEvent } = setup();

		fireEvent.click(getByText('Cancel'));

		expect(mockFireEvent).toHaveBeenCalledWith('ui.button.clicked.cancel', analyticsPayload);
	});
});
