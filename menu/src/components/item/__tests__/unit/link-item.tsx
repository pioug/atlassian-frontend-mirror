import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';
import { CSSFn } from '../../../types';
import LinkItem from '../../link-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

describe('<LinkItem />', () => {
  it('should callback on click', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <LinkItem onClick={callback} testId="target">
        Hello world
      </LinkItem>,
    );

    fireEvent.click(getByTestId('target'));

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback on click when disabled', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <LinkItem isDisabled onClick={callback} testId="target">
        Hello world
      </LinkItem>,
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
      <LinkItem cssFn={customCss} isSelected isDisabled href="#">
        Helloo
      </LinkItem>,
    );

    expect(container.firstChild).toHaveStyleRule('padding', '10px');
    expect(container.firstChild).toHaveStyleRule('opacity', '0.75');
    expect(container.firstChild).toHaveStyleRule('border-radius', '5px');
    expect(container.firstChild).toHaveStyleRule('border', '1px solid');
  });

  it('should prevent dragging so the transparent artefact isnt shown', () => {
    // Return if default was prevented which we will then assert later
    const dragStartEvent = jest.fn(e => e.defaultPrevented);
    const { getByTestId } = render(
      <div onDragStart={dragStartEvent}>
        <LinkItem testId="target">Hello world</LinkItem>
      </div>,
    );

    fireEvent.dragStart(getByTestId('target'));

    expect(getByTestId('target').getAttribute('draggable')).toEqual('false');
    //  Default was prevented?
    expect(dragStartEvent.mock.results[0].value).toEqual(true);
  });
});
