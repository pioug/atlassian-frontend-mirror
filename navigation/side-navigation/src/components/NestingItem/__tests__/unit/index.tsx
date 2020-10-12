import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { ButtonItem, CustomItemComponentProps } from '../../../Item';
import { ROOT_ID } from '../../../NestableNavigationContent';
import { NestedContext } from '../../../NestableNavigationContent/context';
import { default as NestingItem } from '../../index';

describe('<NestingItem />', () => {
  const callbacks = {
    currentStackId: ROOT_ID,
    onNest: jest.fn(),
    onUnNest: jest.fn(),
    stack: [],
    parentId: ROOT_ID,
  };

  it('should render a title string as the button item when closed', () => {
    const { queryByText } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem id="1" title="Nest">
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Nest')).toBeDefined();
    expect(queryByText('Hello world')).toBeFalsy();
  });

  it('should render custom component as the button item when closed', () => {
    const { queryByText } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem id="1" title={<p>Custom Title</p>}>
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Custom Title')).toBeDefined();
  });

  it('should render children when it is the current layer', () => {
    const { queryByText } = render(
      <NestedContext.Provider value={{ ...callbacks, currentStackId: '1' }}>
        <NestingItem id="1" title="Nest">
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('Nest')).toBe(null);
    expect(queryByText('Hello world')).toBeDefined();
  });

  it('should callback once when clicked twice to prevent accidental double clicks', () => {
    const callback = jest.fn();
    const onNest = jest.fn();
    const { getByText } = render(
      <NestedContext.Provider value={{ ...callbacks, onNest }}>
        <NestingItem id="1" onClick={callback} title="Nest">
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    fireEvent.click(getByText('Nest'));
    fireEvent.click(getByText('Nest'));

    expect(onNest).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should callback to nested context with id when clicked', () => {
    const onNest = jest.fn();
    const { getByText } = render(
      <NestedContext.Provider value={{ ...callbacks, onNest }}>
        <NestingItem id="1" title="Nest">
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    fireEvent.click(getByText('Nest'));

    expect(onNest).toHaveBeenCalledWith('1');
  });

  it('should always place a right arrow icon in the button item', () => {
    const { queryByTestId } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem testId="nest" title="Nest" id="more-important">
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );
    expect(queryByTestId('nest--item--right-arrow')).not.toBeNull();
  });

  it('should customize the after element for the button item', () => {
    const { container, queryByTestId, queryByText } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem
          iconAfter={<span>custom</span>}
          testId="nest"
          title="Nest"
          id="more-important"
        >
          <ButtonItem>Hello world</ButtonItem>
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(queryByText('custom')).not.toBeNull();
    expect(container.querySelector('[data-custom-icon]')).not.toBeNull();
    expect(queryByTestId('nest--item--right-arrow')).not.toBeNull();
  });

  it('should pass through extra props to the component', () => {
    const Link = ({
      children,
      ...props
    }: CustomItemComponentProps & { href: string }) => (
      <a {...props}>{children}</a>
    );

    const { getByTestId } = render(
      <NestedContext.Provider value={{ ...callbacks }}>
        <NestingItem
          id="hello"
          title="yeah"
          href="/my-details"
          component={Link}
          testId="target"
        >
          Hello world
        </NestingItem>
      </NestedContext.Provider>,
    );

    expect(getByTestId('target--item').getAttribute('href')).toEqual(
      '/my-details',
    );
  });
});
