import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPaletteMenuWithoutAnalytics as ColorPaletteMenu } from '../..';
import { fg } from '@atlaskit/platform-feature-flags';
import { toBeAccessible } from '@atlassian/a11y-jest-testing';

jest.mock('@atlaskit/platform-feature-flags');
const mockGetBooleanFG = fg as jest.MockedFunction<typeof fg>;

describe('ColorPaletteMenu', () => {
	const mockFn = jest.fn();

	const renderUI = () => {
		const palette = [
			{ value: 'blue', label: 'Blue' },
			{ value: 'red', label: 'Red' },
		];
		return render(
			<ColorPaletteMenu palette={palette} selectedColor="blue" cols={3} onChange={mockFn} />,
		);
	};

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('All FFs enabled', () => {
		beforeEach(() => {
			mockGetBooleanFG.mockReturnValue(true);
		});

		test('should capture and report a11y violations', async () => {
			expect.extend({ toBeAccessible });
			const { container } = renderUI();

			await expect(container).toBeAccessible();
		});

		test('should render ColorPaletteMenu with ColorCard', async () => {
			const { getByRole, getAllByRole } = renderUI();

			const colorPaletteMenu = getByRole('menu');
			expect(colorPaletteMenu).toBeInTheDocument();
			expect(colorPaletteMenu).toHaveAttribute('aria-label', 'Color picker, Blue selected');

			const colorCard = getAllByRole('menuitemradio');
			expect(colorCard).toHaveLength(2);
			expect(colorCard[0]).toHaveAttribute('aria-label', 'Blue');
			expect(colorCard[0]).toHaveAttribute('aria-checked', 'true');
		});

		test('should call onChange prop onClick and onKeydown', async () => {
			const { getByRole, getAllByRole } = renderUI();

			const colorPaletteMenu = getByRole('menu');
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
