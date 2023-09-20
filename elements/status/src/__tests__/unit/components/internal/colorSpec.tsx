import React from 'react';
import { ANALYTICS_HOVER_DELAY } from '../../../../components/constants';
import Color from '../../../../components/internal/color';
import { renderWithIntl } from '../../helpers/_testing-library';
import { fireEvent, screen } from '@testing-library/react';

describe('Color', () => {
  it('should render color button', () => {
    renderWithIntl(
      <Color
        value={'red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        iconColor={'iconColor'}
      />,
    );

    expect(screen.getAllByRole('button').length).toBe(1);
  });

  it('should be a list item', () => {
    renderWithIntl(
      <Color
        value={'red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        iconColor={'iconColor'}
      />,
    );

    expect(screen.getAllByRole('listitem').length).toBe(1);
  });

  it('should render done icon when selected', () => {
    renderWithIntl(
      <Color
        value={'red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        iconColor={'iconColor'}
        isSelected={true}
      />,
    );

    expect(screen.getAllByRole('img').length).toBe(1);
  });

  it('should not render done icon when not selected', () => {
    renderWithIntl(
      <Color
        value={'red'}
        onClick={jest.fn()}
        backgroundColor={'backgroundColor'}
        borderColor={'borderColor'}
        iconColor={'iconColor'}
        isSelected={false}
      />,
    );

    expect(screen.queryByRole('img')).toBe(null);
  });

  it('should call onClick handler prop on click', () => {
    const onClick = jest.fn();
    const value = 'red';
    renderWithIntl(
      <Color
        value={value}
        onClick={onClick}
        backgroundColor={'backgroundColor'}
        iconColor={'iconColor'}
        borderColor={'borderColor'}
        isSelected={false}
      />,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(value);
  });

  describe('Color onHover', () => {
    let realDateNow: () => number;
    let dateNowStub: jest.Mock;

    beforeEach(() => {
      realDateNow = Date.now;
      dateNowStub = jest.fn();
      Date.now = dateNowStub;
    });

    afterEach(() => {
      Date.now = realDateNow;
    });

    it('should call onHover handler', () => {
      const now = realDateNow();
      const onHover = jest.fn();
      const value = 'purple';
      renderWithIntl(
        <Color
          value={value}
          onClick={jest.fn()}
          onHover={onHover}
          backgroundColor={'backgroundColor'}
          iconColor={'iconColor'}
          borderColor={'borderColor'}
          isSelected={false}
        />,
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      dateNowStub.mockReturnValue(now);
      fireEvent.mouseEnter(button);

      dateNowStub.mockReturnValue(now + ANALYTICS_HOVER_DELAY + 10);
      fireEvent.mouseLeave(button);

      expect(onHover).toHaveBeenCalledWith(value);
    });
  });
});
