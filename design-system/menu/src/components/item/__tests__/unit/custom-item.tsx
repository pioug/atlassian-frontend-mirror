import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';

import { CSSFn, CustomItemComponentProps } from '../../../types';
import CustomItem from '../../custom-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

describe('<CustomItem />', () => {
  const Component = (props: CustomItemComponentProps) => <div {...props} />;

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
    const { getByTestId } = render(
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
    const component = getByTestId('component');

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
      </div>,
    );

    fireEvent.dragStart(getByTestId('target'));

    expect(getByTestId('target').getAttribute('draggable')).toEqual('false');
    //  Default was prevented?
    expect(dragStartEvent.mock.results[0].value).toEqual(true);
  });

  it('should pass through extra props to the component', () => {
    const Link = ({
      children,
      ...props
    }: CustomItemComponentProps & { href: string }) => (
      <a {...props}>{children}</a>
    );

    const { getByTestId } = render(
      <CustomItem href="/my-details" component={Link} testId="target">
        Hello world
      </CustomItem>,
    );

    expect(getByTestId('target').getAttribute('href')).toEqual('/my-details');
  });
});
