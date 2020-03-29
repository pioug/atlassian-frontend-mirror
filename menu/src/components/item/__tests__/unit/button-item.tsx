import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';
import { CSSFn } from '../../../types';
import ButtonItem from '../../button-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

const noop = () => {};

describe('<ButtonItem />', () => {
  it('should callback on click', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <ButtonItem onClick={callback} testId="target">
        Hello world
      </ButtonItem>,
    );

    fireEvent.click(getByTestId('target'));

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback on click when disabled', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <ButtonItem isDisabled onClick={callback} testId="target">
        Hello world
      </ButtonItem>,
    );

    fireEvent.click(getByTestId('target'));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should respect the cssFn prop', () => {
    const customCss: CSSFn = (currentStyles, state) => ({
      ...currentStyles,
      ...(state.isSelected && { border: '1px solid' }),
      ...(state.isDisabled && { pointerEvents: 'none' as const }),
      padding: '10px',
      opacity: 0.75,
      borderRadius: '5px',
    });
    const { container } = render(
      <ButtonItem cssFn={customCss} isSelected isDisabled onClick={noop}>
        Helloo
      </ButtonItem>,
    );

    expect(container.firstChild).toHaveStyleRule('padding', '10px');
    expect(container.firstChild).toHaveStyleRule('opacity', '0.75');
    expect(container.firstChild).toHaveStyleRule('border-radius', '5px');
    expect(container.firstChild).toHaveStyleRule('border', '1px solid');
  });
});
