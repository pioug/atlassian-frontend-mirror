import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPaletteMenuWithoutAnalytics as ColorPaletteMenu } from '../..';
import { fg } from '@atlaskit/platform-feature-flags';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFG = fg as jest.MockedFunction<typeof fg>;

describe('ColorPaletteMenu', () => {
	const mockFnOld = jest.fn();
	const mockFn = jest.fn();

	const renderUI = (withEventCallback = true) => {
		const palette = [
			{ value: 'blue', label: 'Blue' },
			{ value: 'red', label: 'Red' },
		];
		return render(
			<ColorPaletteMenu
				palette={palette}
				selectedColor="blue"
				cols={3}
				{...(withEventCallback ? { onChange: mockFn } : { onChangeOld: mockFnOld })}
			/>,
		);
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('should render ColorPaletteMenu with ColorCard', async () => {
		const { getByRole, getAllByRole } = renderUI(false);

		const colorPaletteMenu = getByRole('radiogroup');
		expect(colorPaletteMenu).toBeInTheDocument();
		expect(colorPaletteMenu).toHaveAttribute('aria-label', 'Color picker, Blue selected');

		const colorCard = getAllByRole('radio');
		expect(colorCard).toHaveLength(2);
		expect(colorCard[0]).toHaveAttribute('aria-label', 'Blue');
		expect(colorCard[0]).toHaveAttribute('aria-checked', 'true');
	});

	test('should call onChange prop onClick and onKeydown', async () => {
		const { getByRole, getAllByRole } = renderUI(false);

		const colorPaletteMenu = getByRole('radiogroup');
		expect(colorPaletteMenu).toBeInTheDocument();

		// render - blue selected
		const colorCard = getAllByRole('radio');
		expect(colorCard).toHaveLength(2);
		const [blueOption, redOption] = colorCard;
		expect(blueOption).toHaveAttribute('aria-checked', 'true');
		expect(redOption).toHaveAttribute('aria-checked', 'false');

		// onClick - on red color
		await userEvent.click(redOption);
		expect(mockFnOld).toHaveBeenCalled();

		// onKeydown - blue color
		await userEvent.tab();
		expect(blueOption).toHaveFocus();
		await userEvent.keyboard('{Enter}');
		expect(mockFnOld).toHaveBeenCalled();
	});

	describe('All FFs enabled', () => {
		beforeEach(() => {
			mockGetBooleanFG.mockReturnValue(true);
		});

		test('should render ColorPaletteMenu with ColorCard', async () => {
			const { getByRole, getAllByRole } = renderUI();

			const colorPaletteMenu = getByRole('group');
			expect(colorPaletteMenu).toBeInTheDocument();
			expect(colorPaletteMenu).toHaveAttribute('aria-label', 'Color picker, Blue selected');

			const colorCard = getAllByRole('menuitemradio');
			expect(colorCard).toHaveLength(2);
			expect(colorCard[0]).toHaveAttribute('aria-label', 'Blue');
			expect(colorCard[0]).toHaveAttribute('aria-checked', 'true');
		});

		test('should call onChange prop onClick and onKeydown', async () => {
			const { getByRole, getAllByRole } = renderUI();

			const colorPaletteMenu = getByRole('group');
			expect(colorPaletteMenu).toBeInTheDocument();

			// render - blue selected
			const colorCard = getAllByRole('menuitemradio');
			expect(colorCard).toHaveLength(2);
			const [blueOption, redOption] = colorCard;
			expect(blueOption).toHaveAttribute('aria-checked', 'true');
			expect(redOption).toHaveAttribute('aria-checked', 'false');

			// onClick - on red color
			await userEvent.click(redOption);
			expect(mockFn).toHaveBeenCalledTimes(1);
			expect(mockFn).toHaveBeenCalledWith(expect.anything(), 'red', undefined);

			// onKeydown - blue color
			await userEvent.tab();
			expect(blueOption).toHaveFocus();
			await userEvent.keyboard('{Enter}');
			expect(mockFn).toHaveBeenCalledTimes(2);
		});
	});
});
