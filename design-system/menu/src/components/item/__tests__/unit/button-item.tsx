import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';

import { CSSFn } from '../../../types';
import ButtonItem from '../../button-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

const noop = () => {};

window.requestAnimationFrame = cb => {
  cb(-1);
  return -1;
};

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

  it('should not gain focus on mouse down when it had no initial focus', () => {
    // create a random button that will have focus
    const el: HTMLElement = document.createElement('button');
    document.body.appendChild(el);
    el.focus();
    expect(el).toBe(document.activeElement);
    const { getByTestId } = render(
      <ButtonItem testId="target">Hello world</ButtonItem>,
    );

    const allowed: boolean = fireEvent.mouseDown(getByTestId('target'));

    // target didn't get focus
    expect(getByTestId('target')).not.toBe(document.activeElement);
    // mousedown event not prevented
    expect(allowed).toBe(true);
  });

  it('should persist focus if it was focused during mouse down', () => {
    const { getByTestId } = render(
      <ButtonItem testId="target">Hello world</ButtonItem>,
    );

    getByTestId('target').focus();
    fireEvent.mouseDown(getByTestId('target'));

    expect(getByTestId('target') === document.activeElement).toBe(true);
  });

  it('should callback to user supplied mouse down prop', () => {
    const onMouseDown = jest.fn();
    const { getByTestId } = render(
      <ButtonItem onMouseDown={onMouseDown} testId="target">
        Hello world
      </ButtonItem>,
    );

    fireEvent.mouseDown(getByTestId('target'));

    expect(onMouseDown).toHaveBeenCalled();
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
