import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import ColorPicker from '../..';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { IntlProvider } from 'react-intl-next';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFF = getBooleanFF as jest.MockedFunction<typeof getBooleanFF>;

describe('Analytics on Tigger', () => {
	const mockFn = jest.fn();

	const renderUI = () => {
		const palette = [
			{ value: 'blue', label: 'Blue' },
			{ value: 'red', label: 'Red' },
		];
		return render(
			<IntlProvider locale="en">
				<ColorPicker palette={palette} onChange={mockFn} />
			</IntlProvider>,
		);
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('Analytics event should occur on color change', async () => {
		const { getByLabelText, getAllByRole } = renderUI();

		// get color button or Trigger
		const colorButton = getByLabelText('Blue selected, Color picker');
		expect(colorButton).toHaveAttribute('aria-expanded', 'false');
		expect(colorButton).toBeInTheDocument();

		// click on trigger
		await userEvent.click(colorButton);
		expect(colorButton).toHaveAttribute('aria-expanded', 'true');

		// click on color option and check onChange called with Analytics
		await userEvent.click(getAllByRole('radio')[1]);
		expect(mockFn.mock.calls.length).toBe(1);
		expect(mockFn).toBeCalledWith('red', expect.any(UIAnalyticsEvent));
	});

	describe('FFs true', () => {
		beforeEach(() => {
			mockGetBooleanFF.mockReturnValue(true);
		});

		it('Analytics event should occur on color change', async () => {
			const { getByLabelText, getAllByRole } = renderUI();
			// get color button or Trigger
			const colorButton = getByLabelText('Blue selected, Color picker');
			expect(colorButton).toHaveAttribute('aria-expanded', 'false');
			expect(colorButton).toBeInTheDocument();

			// click on trigger
			await userEvent.click(colorButton);
			expect(colorButton).toHaveAttribute('aria-expanded', 'true');

			// click on color option and check onChange called with Analytics
			await userEvent.click(getAllByRole('radio')[1]);
			expect(mockFn.mock.calls.length).toBe(1);
			expect(mockFn).toBeCalledWith('red', expect.any(UIAnalyticsEvent));
		});
	});
});
