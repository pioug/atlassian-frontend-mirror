/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { fireEvent, render } from '@testing-library/react';
import serializer, { matchers } from 'jest-emotion';

import type { CSSFn } from '../../../types';
import LinkItem from '../../link-item';

expect.addSnapshotSerializer(serializer);
expect.extend(matchers);

window.requestAnimationFrame = (cb) => {
  cb(-1);
  return -1;
};

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

  // This behaviour exists only as a side effect for spread props.
  // When we remove the ability for spread props in a future major version
  // This test can be deleted.
  it('should take a data-testid directly', () => {
    const { getByTestId } = render(
      <LinkItem data-testid="link">Hello world</LinkItem>,
    );

    expect(getByTestId('link')).toBeDefined();
  });

  it('should override styles without stripping them', () => {
    const hackStyles = css({
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
      backgroundColor: 'red',
    });

    const { getByTestId } = render(
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      <LinkItem css={hackStyles} testId="link">
        Hello world
      </LinkItem>,
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
      <LinkItem testId="target">Hello world</LinkItem>,
    );

    const allowed: boolean = fireEvent.mouseDown(getByTestId('target'));

    // target didn't get focus
    expect(getByTestId('target')).not.toBe(document.activeElement);
    // mousedown event not prevented
    expect(allowed).toBe(true);
  });

  it('should persist focus if it was focused during mouse down', () => {
    const { getByTestId } = render(
      <LinkItem href="#" testId="target">
        Hello world
      </LinkItem>,
    );

    getByTestId('target').focus();
    fireEvent.mouseDown(getByTestId('target'));

    expect(getByTestId('target') === document.activeElement).toBe(true);
  });

  it('should callback to user supplied mouse down prop', () => {
    const onMouseDown = jest.fn();
    const { getByTestId } = render(
      <LinkItem onMouseDown={onMouseDown} testId="target">
        Hello world
      </LinkItem>,
    );

    fireEvent.mouseDown(getByTestId('target'));

    expect(onMouseDown).toHaveBeenCalled();
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
    const customCss: CSSFn = (state) => ({
      ...(state.isSelected && { border: '1px solid' }),
      ...(state.isDisabled && { pointerEvents: 'none' as const }),
      padding: '10px',
      opacity: 0.75,
      borderRadius: '5px',
    });
    const { container } = render(
      <LinkItem
        // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
        cssFn={customCss}
        isSelected
        isDisabled
        href="#"
      >
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
    const dragStartEvent = jest.fn((e) => e.defaultPrevented);
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

  it('should have "aria-current=page" when link item is selected', () => {
    const { getByTestId } = render(
      <LinkItem href="#" isSelected testId="target">
        Hello world
      </LinkItem>,
    );

    expect(getByTestId('target')).toHaveAttribute('aria-current', 'page');
  });
});
