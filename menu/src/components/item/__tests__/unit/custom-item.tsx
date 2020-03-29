import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';
import CustomItem from '../../custom-item';
import { CustomItemComponentProps, CSSFn } from '../../../types';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

describe('<CustomItem />', () => {
  const Component = ({ wrapperClass, ...props }: CustomItemComponentProps) => (
    <div className={wrapperClass} {...props}></div>
  );

  it('should callback on click', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <CustomItem component={Component} onClick={callback} testId="target">
        Hello world
      </CustomItem>,
    );

    fireEvent.click(getByTestId('target'));

    expect(callback).toHaveBeenCalled();
  });

  it('should not callback on click when disabled', () => {
    const callback = jest.fn();
    const { getByTestId } = render(
      <CustomItem
        component={Component}
        isDisabled
        onClick={callback}
        testId="target"
      >
        Hello world
      </CustomItem>,
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
      <CustomItem
        component={Component}
        testId="component"
        cssFn={customCss}
        isSelected
        isDisabled
      >
        Helloo
      </CustomItem>,
    );
    const component = getByTestId(container, 'component');

    expect(component).toHaveStyleRule('padding', '10px');
    expect(component).toHaveStyleRule('opacity', '0.75');
    expect(component).toHaveStyleRule('border-radius', '5px');
    expect(component).toHaveStyleRule('border', '1px solid');
  });

  it('should prevent dragging so the transparent artefact isnt shown', () => {
    // Return if default was prevented which we will then assert later
    const dragStartEvent = jest.fn(e => e.defaultPrevented);
    const { getByTestId } = render(
      <div onDragStart={dragStartEvent}>
        <CustomItem component={Component} testId="target">
          Hello world
        </CustomItem>
        ,
      </div>,
    );

    fireEvent.dragStart(getByTestId('target'));

    expect(getByTestId('target').getAttribute('draggable')).toEqual('false');
    //  Default was prevented?
    expect(dragStartEvent.mock.results[0].value).toEqual(true);
  });
});
