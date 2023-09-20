import React from 'react';
import ColorPalette from '../../../../components/internal/color-palette';
import { renderWithIntl } from '../../helpers/_testing-library';
import { fireEvent, screen } from '@testing-library/react';

describe('ColorPalette', () => {
  it('should render 6 colors', () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    renderWithIntl(
      <ColorPalette
        onClick={onClick}
        onHover={onHover}
        selectedColor={'red'}
      />,
    );

    const colorComponents = screen.getAllByRole('button');
    expect(colorComponents.length).toBe(6);
    expect(colorComponents[0]).toHaveAttribute('tabindex', '0');
  });

  it('should have role list', () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    renderWithIntl(
      <ColorPalette
        onClick={onClick}
        onHover={onHover}
        selectedColor={'red'}
      />,
    );

    const colorComponentsList = screen.queryAllByRole('list');
    expect(colorComponentsList.length).toBe(1);
  });

  it('should select selected color', () => {
    renderWithIntl(<ColorPalette onClick={jest.fn()} selectedColor={'red'} />);

    const selectedButton = screen.getByRole('button', { pressed: true });
    expect(selectedButton.classList.contains('selected')).toBe(true);
    expect(selectedButton).toHaveAttribute('tabindex', '-1');
    expect(selectedButton).toHaveAttribute('title', 'Red');
  });

  it('should not select if no selected color', () => {
    renderWithIntl(<ColorPalette onClick={jest.fn()} />);
    const selectedButton = screen.queryByRole('button', { pressed: true });
    expect(selectedButton).toBe(null);
  });
});

describe('ColorPalette keyboard navigation', () => {
  it('should focus next color on right arrow', async () => {
    renderWithIntl(
      <ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />,
    );
    // Simulate pressing of right arrow. Colors order defined internally in color-palette.tsx
    const list = screen.getByRole('list');
    fireEvent.keyDown(list, {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: 39,
    });

    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons[1]).toHaveFocus(); // Purple
  });

  it('should select first color on when reaches the last one', () => {
    renderWithIntl(
      <ColorPalette onClick={jest.fn()} selectedColor={'green'} />,
    );
    const list = screen.getByRole('list');
    for (let i = 0; i < 6; i++) {
      fireEvent.keyDown(list, {
        key: 'ArrowRight',
        code: 'ArrowRight',
        keyCode: 39,
      });
    }
    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons[0]).toHaveFocus(); // Grey
  });

  it('should select last color on leftArrow press at first color', () => {
    renderWithIntl(
      <ColorPalette onClick={jest.fn()} selectedColor={'neutral'} />,
    );
    const list = screen.getByRole('list');
    fireEvent.keyDown(list, {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: 37,
    });
    const colorButtons = screen.getAllByRole('button');
    expect(colorButtons[5]).toHaveFocus(); //green
  });
});
