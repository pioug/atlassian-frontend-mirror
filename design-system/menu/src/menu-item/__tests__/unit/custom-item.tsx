import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';
import { HashRouter, Link } from 'react-router-dom';

import type { CSSFn, CustomItemComponentProps } from '../../../types';
import CustomItem from '../../custom-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
  cb(-1);
  return -1;
};

describe('<CustomItem />', () => {
  const Component = (props: CustomItemComponentProps) => (
    <button type="button" {...props} />
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

  it('should not gain focus on mouse down when it had no initial focus', () => {
    // create a random button that will have focus
    const el: HTMLElement = document.createElement('button');
    document.body.appendChild(el);
    el.focus();
    expect(el).toBe(document.activeElement);
    const { getByTestId } = render(
      <CustomItem component={Component} testId="target">
        Hello world
      </CustomItem>,
    );

    const allowed: boolean = fireEvent.mouseDown(getByTestId('target'));

    // target didn't get focus
    expect(getByTestId('target')).not.toBe(document.activeElement);
    // mousedown event not prevented
    expect(allowed).toBe(true);
  });

  it('should persist focus if it was focused during mouse down', () => {
    const { getByTestId } = render(
      <CustomItem component={Component} testId="target">
        Hello world
      </CustomItem>,
    );

    getByTestId('target').focus();
    fireEvent.mouseDown(getByTestId('target'));

    expect(getByTestId('target') === document.activeElement).toBe(true);
  });

  it('should callback to user supplied mouse down prop', () => {
    const onMouseDown = jest.fn();
    const { getByTestId } = render(
      <CustomItem
        component={Component}
        onMouseDown={onMouseDown}
        testId="target"
      >
        Hello world
      </CustomItem>,
    );

    fireEvent.mouseDown(getByTestId('target'));

    expect(onMouseDown).toHaveBeenCalled();
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
    const customCss: CSSFn = (state) => ({
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
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
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
    const dragStartEvent = jest.fn((e) => e.defaultPrevented);
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
    }: CustomItemComponentProps & {
      href: string;
    }) => <a {...props}>{children}</a>;

    const { getByTestId } = render(
      <CustomItem href="/my-details" component={Link} testId="target">
        Hello world
      </CustomItem>,
    );

    expect(getByTestId('target').getAttribute('href')).toEqual('/my-details');
  });

  it('should work with a component from an external library', () => {
    const { getByTestId } = render(
      <HashRouter>
        <CustomItem to="/my-details" component={Link} testId="target">
          Hello world
        </CustomItem>
      </HashRouter>,
    );

    expect(getByTestId('target').getAttribute('href')).toEqual('#/my-details');
  });
});
