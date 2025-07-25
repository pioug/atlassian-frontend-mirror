import React from 'react';

import { ColorPickerWithoutAnalytics as ColorPicker, type ColorPickerProps } from '../..';
import Trigger from '../../components/Trigger';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFG = fg as jest.MockedFunction<typeof fg>;
const onMenuOpenMock = jest.fn();

describe('ColorPicker', () => {
	const mockFn = jest.fn();

	const renderUI = () => {
		const palette = [
			{ value: 'blue', label: 'Blue' },
			{ value: 'red', label: 'Red' },
		];
		const popperProps: ColorPickerProps['popperProps'] = {
			placement: 'bottom',
		};
		return render(
			<IntlProvider locale="en">
				<ColorPicker
					palette={palette}
					onChange={mockFn}
					popperProps={popperProps}
					onMenuOpen={onMenuOpenMock}
				/>
			</IntlProvider>,
		);
	};

	beforeEach(() => {
		mockGetBooleanFG.mockReturnValue(false);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('should render ColorPickerMenu on ColorPicker click', async () => {
		renderUI();
		const colorButton = screen.getByLabelText('Blue selected, Color picker');
		expect(colorButton).toHaveAttribute('aria-expanded', 'false');
		expect(colorButton).toBeInTheDocument();

		// click on trigger
		await userEvent.click(colorButton);
		expect(colorButton).toHaveAttribute('aria-expanded', 'true');

		// popup to have color options
		expect(screen.getAllByRole('radio')).toHaveLength(2);
	});

	describe('FFs enabled', () => {
		beforeEach(() => {
			mockGetBooleanFG.mockReturnValue(true);
		});

		test('should capture and report a11y violations', async () => {
			const { container } = renderUI();

			const colorButton = screen.getByLabelText('Blue selected, Color picker');
			colorButton.click();

			await expect(container).toBeAccessible();
		});

		test('should render ColorPicker', () => {
			renderUI();
			const colorButton = screen.getByLabelText('Blue selected, Color picker');

			expect(colorButton).toBeInTheDocument();
		});

		test('should render ColorPickerMenu on ColorPicker click', async () => {
			renderUI();
			const colorButton = screen.getByLabelText('Blue selected, Color picker');
			expect(colorButton).toHaveAttribute('aria-expanded', 'false');
			expect(colorButton).toBeInTheDocument();

			// click on trigger
			await userEvent.click(colorButton);
			expect(colorButton).toHaveAttribute('aria-expanded', 'true');

			// popup to have color options
			expect(screen.getAllByRole('radio')).toHaveLength(2);
		});

		test('should not submit form when click on trigger', async () => {
			const mockSubmit = jest.fn();
			render(
				<form onSubmit={mockSubmit}>
					<Trigger value="blue" label="Blue" expanded={false} />
				</form>,
			);

			await userEvent.click(screen.getByRole('button'));
			expect(mockSubmit.mock.calls.length).toBe(0);
		});

		test('should call onMenuOpen on ColorPicker open', async () => {
			renderUI();
			const colorButton = screen.getByLabelText('Blue selected, Color picker');
			await userEvent.click(colorButton);
			expect(onMenuOpenMock).toHaveBeenCalledTimes(1);
		});
	});
});
