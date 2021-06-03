import React from 'react';

import { mount, render } from 'enzyme';

import Tooltip from '@atlaskit/tooltip';

import GlobalNavigationItemPrimitive from '../../primitives';

const styles = () => ({
  itemBase: {},
});

describe('GlobalNavigationItemPrimitive', () => {
  let defaultProps;
  let defaultDataset;

  beforeEach(() => {
    jest.resetModules();
    defaultProps = {
      isFocused: false,
    };
    defaultDataset = {
      'data-testid': 'GlobalNavigationItem',
    };
  });

  it('should be wrapped using withGlobalTheme HOC', () => {
    const WrappedWithGlobalTheme = () => null;
    const MockWithGlobalTheme = jest.fn(() => WrappedWithGlobalTheme);
    jest.doMock('../../../../../theme', () => ({
      withGlobalTheme: MockWithGlobalTheme,
      styleReducerNoOp: jest.fn((s) => s),
    }));

    const { BaseGlobalNavigationItemPrimitive } = require('../../primitives');
    expect(MockWithGlobalTheme).toHaveBeenCalledWith(
      BaseGlobalNavigationItemPrimitive,
    );
  });

  it('should render an anchor when an href prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        styles={styles}
        href="www.example.com"
      />,
    );
    const anchor = wrapper.find('a[href="www.example.com"]');
    expect(anchor).toHaveLength(1);
    expect(anchor.props()).toEqual({
      ...defaultDataset,
      children: null,
      className: expect.any(String),
      href: 'www.example.com',
    });
  });

  it('should render a button when an onClick prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        styles={styles}
        onClick={() => {}}
      />,
    );
    const button = wrapper.find('button');
    expect(button).toHaveLength(1);
    expect(button.props()).toEqual({
      children: null,
      className: expect.any(String),
      onClick: expect.any(Function),
      ...defaultDataset,
    });
  });

  it('should render a CustomComponent when a component prop is passed', () => {
    const MyComponent = ({ className, children, onClick }) => (
      <button className={className} onClick={onClick} id="customComponent">
        {children}
      </button>
    );
    const onClick = () => {};
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        component={MyComponent}
        label="my-label"
        id="my-id"
        onClick={onClick}
        styles={styles}
      />,
    );

    const componentEl = wrapper.find(MyComponent);
    expect(componentEl).toHaveLength(1);
    expect(componentEl.props()).toEqual({
      children: null,
      className: expect.any(String),
      component: MyComponent,
      dataset: defaultDataset,
      id: 'my-id',
      isSelected: false,
      label: 'my-label',
      onClick,
      size: 'large',
      styles,
    });
  });

  it('should render a span if neither an href, onClick or component prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive {...defaultProps} styles={styles} />,
    );
    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.props()).toEqual({
      ...defaultDataset,
      children: null,
      className: expect.any(String),
    });
  });

  it('should render badge and icon when badge and icon props are passed', () => {
    const MyBadge = () => <div id="badge" />;
    const MyIcon = () => <div id="icon" />;
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        styles={styles}
        badge={MyBadge}
        icon={MyIcon}
        onClick={() => {}}
      />,
    );

    expect(wrapper.find(MyBadge)).toHaveLength(1);
    expect(wrapper.find(MyIcon)).toHaveLength(1);
  });

  [
    { subject: 'the default element', selector: 'span', props: {} },
    { subject: 'an anchor', selector: 'a', props: { href: '/' } },
    { subject: 'a button', selector: 'button', props: { onClick: jest.fn() } },
  ].forEach(({ selector, subject, props }) => {
    it(`should apply a custom dataset to ${subject} when dataset is provided`, () => {
      expect(
        render(
          <GlobalNavigationItemPrimitive
            {...defaultProps}
            {...props}
            dataset={{ 'data-foo': 'foo', 'data-bar': 'bar' }}
          />,
        )
          .find(selector)
          .data(),
      ).toEqual({
        foo: 'foo',
        bar: 'bar',
      });
    });
  });

  it('should render a tooltip when a tooltip prop is passed', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        component={({ className, children, onClick }) => (
          <button className={className} onClick={onClick} id="customComponent">
            {children}
          </button>
        )}
        styles={styles}
        tooltip="Test tooltip"
      />,
    );
    expect(wrapper.find(Tooltip).length).toBe(1);
  });

  it('should render a tooltip without text if element is selected', () => {
    const wrapper = mount(
      <GlobalNavigationItemPrimitive
        {...defaultProps}
        component={() => <button id="customComponent" />}
        styles={styles}
        tooltip="Test tooltip"
        isSelected
      />,
    );
    expect(wrapper.find(Tooltip).props().content).toBe(undefined);
  });
});
