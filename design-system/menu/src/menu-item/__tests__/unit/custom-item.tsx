/** @jsx jsx */
import { createSerializer, matchers } from '@emotion/jest';
import { css, jsx } from '@emotion/react';
import { fireEvent, render } from '@testing-library/react';
import { HashRouter, Link } from 'react-router-dom';

import type { CSSFn, CustomItemComponentProps } from '../../../types';
import CustomItem from '../../custom-item';

expect.addSnapshotSerializer(createSerializer());
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
  cb(-1);
  return -1;
};

describe('<CustomItem />', () => {
  const Component = (props: CustomItemComponentProps) => (
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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

  // This behaviour exists only as a side effect for spread props.
  // When we remove the ability for spread props in a future major version
  // This test can be deleted.
  it('should take a data-testid directly', () => {
    const { getByTestId } = render(
      <CustomItem component={Component} data-testid="link">
        Hello world
      </CustomItem>,
    );

    expect(getByTestId('link')).toBeDefined();
  });

  // The purpose of this test is to confirm that this functionality still
  // works as expected. We **do not** want people to use this. You can see
  // that TS throws that `css` doesn't exist in the allowed props. This is
  // desired and expected.
  //
  // TL;DR: we don't want you to use it (type fail), but if you're already using it, it should work
  it('should override styles without stripping them', () => {
    const hackStyles = css({
      backgroundColor: 'red',
    });

    const { getByTestId } = render(
      /* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
      // @ts-ignore
      <CustomItem component={Component} css={hackStyles} testId="link">
        Hello world
      </CustomItem>,
      /* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
    );

    expect(getByTestId('link')).toHaveStyleRule('background-color', 'red');
    expect(getByTestId('link')).toHaveStyleRule('color', 'currentColor');
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
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
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
