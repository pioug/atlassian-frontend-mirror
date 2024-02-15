import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPaletteMenuWithoutAnalytics as ColorPaletteMenu } from '../..';

describe('ColorPaletteMenu', () => {
  const mockFn = jest.fn();

  const renderUI = () => {
    const palette = [
      { value: 'blue', label: 'Blue' },
      { value: 'red', label: 'Red' },
    ];
    return render(
      <ColorPaletteMenu
        palette={palette}
        onChange={mockFn}
        selectedColor="blue"
        cols={3}
      />,
    );
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should render ColorPaletteMenu with ColorCard', () => {
    const { getByRole, getAllByRole } = renderUI();

    const colorPaletteMenu = getByRole('radiogroup');
    expect(colorPaletteMenu).toBeInTheDocument();
    expect(colorPaletteMenu).toHaveAttribute(
      'aria-label',
      'Color picker, Blue selected',
    );

    const colorCard = getAllByRole('radio');
    expect(colorCard).toHaveLength(2);
    expect(colorCard[0]).toHaveAttribute('aria-label', 'Blue');
    expect(colorCard[0]).toHaveAttribute('aria-checked', 'true');
  });

  test('should call onChange prop onClick and onKeydown', async () => {
    const { getByRole, getAllByRole } = renderUI();

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
    expect(mockFn).toBeCalled();

    // onKeydown - blue color
    await userEvent.tab();
    expect(blueOption).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(mockFn).toBeCalled();
  });
});
