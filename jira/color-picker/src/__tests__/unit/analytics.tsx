import React from 'react';

import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import ColorPicker from '../..';

jest.mock('@atlaskit/platform-feature-flags/fg');
const mockGetBooleanFG = fg as jest.MockedFunction<typeof fg>;

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
		const { getByLabelText } = renderUI();

		// get color button or Trigger
		const colorButton = getByLabelText('Blue selected, Color picker');
		expect(colorButton).toHaveAttribute('aria-expanded', 'false');
		expect(colorButton).toBeInTheDocument();

		// click on trigger
		await userEvent.click(colorButton);
		expect(colorButton).toHaveAttribute('aria-expanded', 'true');

		// click on color option and check onChange called with Analytics
		await userEvent.click(getByLabelText('Red'));
		expect(mockFn.mock.calls.length).toBe(1);
		expect(mockFn).toHaveBeenCalledWith('red', expect.any(UIAnalyticsEvent));

		await expect(document.body).toBeAccessible();
	});

	describe('FFs true', () => {
		beforeEach(() => {
			// Exclude the top-layer gates: when ON, @atlaskit/popup and @atlaskit/tooltip use the native Popover API
			// which JSDOM does not implement — clicks inside the popup and close events become no-ops.
			mockGetBooleanFG.mockImplementation(
				(flag: string) =>
					flag !== 'platform-dst-top-layer' && flag !== 'platform-dst-top-layer-tooltip',
			);
		});

		it('Analytics event should occur on color change', async () => {
			const { getByLabelText } = renderUI();
			// get color button or Trigger
			const colorButton = getByLabelText('Blue selected, Color picker');
			expect(colorButton).toHaveAttribute('aria-expanded', 'false');
			expect(colorButton).toBeInTheDocument();

			// click on trigger
			await userEvent.click(colorButton);
			expect(colorButton).toHaveAttribute('aria-expanded', 'true');

			// click on color option and check onChange called with Analytics
			await userEvent.click(getByLabelText('Red'));
			expect(mockFn.mock.calls.length).toBe(1);
			expect(mockFn).toHaveBeenCalledWith('red', expect.any(UIAnalyticsEvent));

			await expect(document.body).toBeAccessible();
		});
	});
});
