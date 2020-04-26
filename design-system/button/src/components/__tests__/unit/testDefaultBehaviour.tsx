import React from 'react';

import { mount, ReactWrapper } from 'enzyme';
import serializer, { matchers } from 'jest-emotion';
import cases from 'jest-in-case';
import * as renderer from 'react-test-renderer';

import Spinner from '@atlaskit/spinner';

import Button from '../../Button';
import InnerWrapper from '../../InnerWrapper';

expect.extend(matchers);
expect.addSnapshotSerializer(serializer);

let wrapper: ReactWrapper | undefined;

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  if (wrapper) wrapper.unmount();
  wrapper = undefined;
});

describe('ak-button/default-behaviour', () => {
  it('button should have type="button" by default', () => {
    wrapper = mount(<Button />);
    expect(wrapper.find('button').props().type).toBe('button');
  });

  it('should render button if there is no href property', () => {
    wrapper = mount(<Button />);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
  });

  it('should render link if href property is set', () => {
    wrapper = mount(<Button href="test" />);
    expect(wrapper.find('a').length).toBe(1);
    expect(wrapper.find('button').length).toBe(0);
  });

  it('should not render link without href prop, even if the target prop is set', () => {
    wrapper = mount(<Button target="something" />);
    expect(wrapper.find('a').length).toBe(0);
    expect(wrapper.find('button').length).toBe(1);
  });

  it('should render span when the button is disabled and has href property', () => {
    wrapper = mount(<Button isDisabled href="test" />);
    expect(wrapper.find('span').first().length).toBe(1);
    expect(wrapper.find('button').length).toBe(0);
    expect(wrapper.find('a').length).toBe(0);
  });

  it("should not render span when the button is disabled, but doesn't have href", () => {
    wrapper = mount(<Button isDisabled />);
    expect(wrapper.find('StyledSpan').length).toBe(0);
    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('a').length).toBe(0);
  });

  it('should render icon if the prop iconBefore is set', () => {
    const Icon = <div id="icon" />;
    wrapper = mount(<Button href="test" iconBefore={Icon} />);
    expect(wrapper.contains(Icon)).toBe(true);
  });

  it('should render iconBefore before children', () => {
    const Icon = <div id="icon">icon</div>;
    wrapper = mount(
      <Button href="test" iconBefore={Icon}>
        button
      </Button>,
    );
    expect(wrapper.text()).toBe('iconbutton');
  });

  it('should render icon if the prop iconAfter is set', () => {
    const Icon = <div id="icon" />;
    wrapper = mount(<Button href="test" iconAfter={Icon} />);
    expect(wrapper.contains(Icon)).toBe(true);
  });

  it('should render iconAfter after children', () => {
    const Icon = <div id="icon">icon</div>;
    wrapper = mount(
      <Button href="test" iconAfter={Icon}>
        button
      </Button>,
    );
    expect(wrapper.text()).toBe('buttonicon');
  });

  it('should render button with full container width', () => {
    wrapper = mount(<Button shouldFitContainer />);
    expect(wrapper.find(InnerWrapper).prop('fit')).toBe(true);
  });

  it('should render button without full container width', () => {
    wrapper = mount(<Button />);
    expect(wrapper.find(InnerWrapper).prop('fit')).toBe(false);
  });

  it('should be able to render both of the icons', () => {
    const Icon1 = <div id="icon">icon1</div>;
    const Icon2 = <div id="icon">icon2</div>;
    wrapper = mount(
      <Button href="test" iconBefore={Icon1} iconAfter={Icon2}>
        button
      </Button>,
    );
    expect(wrapper.contains(Icon1)).toBe(true);
    expect(wrapper.contains(Icon2)).toBe(true);
    expect(wrapper.text()).toBe('icon1buttonicon2');
  });

  it('should call onClick handler when link is clicked', () => {
    const spy = jest.fn();
    wrapper = mount(
      <Button href="test" onClick={spy}>
        button
      </Button>,
    );
    wrapper.find('a').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call onClick handler when button is clicked', () => {
    const spy = jest.fn();
    wrapper = mount(<Button onClick={spy}>button</Button>);
    wrapper.find('button').simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler when button is clicked while loading', () => {
    const spy = jest.fn();
    wrapper = mount(
      <Button isLoading onClick={spy}>
        button
      </Button>,
    );
    wrapper.find(InnerWrapper).simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should render tabIndex attribute when the tabIndex property is set', () => {
    let wrapper = mount(<Button tabIndex={0}>button</Button>);
    expect(wrapper.find('button').is('[tabIndex=0]')).toBe(true);
    wrapper.unmount();
    wrapper = mount(
      <Button href="#" tabIndex={0}>
        link
      </Button>,
    );
    expect(wrapper.find('a').is('[tabIndex=0]')).toBe(true);
    wrapper.unmount();
    wrapper = mount(
      <Button tabIndex={0} isDisabled>
        span
      </Button>,
    );
    expect(wrapper.find('button').is('[tabIndex=0]')).toBe(true);
    wrapper.unmount();
  });

  it('should trigger onFocus handler on focus', () => {
    const spy = jest.fn();
    wrapper = mount(
      <Button tabIndex={0} onFocus={spy}>
        button
      </Button>,
    );
    const button = wrapper.find('button');
    button.prop('onFocus')!({} as any);
    expect(spy).toHaveBeenCalled();
  });

  it('should respect autofocus', () => {
    /**
     * The default `mount()` method mounts into a div but doesn't attach it to the DOM.
     *
     * In order for `document.activeElement` to function as intended we need to explicitly
     * mount it into the DOM. We do this using the `attachTo` property.
     *
     * We mount to a div instead of `document.body` directly to avoid a react render warning.
     */
    const rootElement = document.createElement('div');
    document.body.appendChild(rootElement);
    wrapper = mount(
      <Button id="testId123" tabIndex={0} autoFocus>
        button
      </Button>,
      { attachTo: rootElement },
    );
    const id = document.activeElement ? document.activeElement.id : null;
    expect(wrapper.find('button').prop('id')).toEqual(id);
    rootElement.parentNode!.removeChild(rootElement);
  });

  describe('isLoading', () => {
    it('should render the loading spinner when isLoading is true', () => {
      wrapper = mount(<Button isLoading>Some text</Button>);
      expect(wrapper.find(Spinner).length).toEqual(1);
    });
    it('should not render the loading spinner when isLoading is false', () => {
      wrapper = mount(<Button>Some text</Button>);
      expect(wrapper.find(Spinner).length).toEqual(0);
    });

    it('set the opacity of the text to 0 when isLoading is true', () => {
      const wrapper = renderer
        .create(<Button isLoading>Some text</Button>)
        .toJSON();
      expect(wrapper).toMatchSnapshot();
    });
  });

  it('should trigger onBlur handler on blur', () => {
    const spy = jest.fn();
    wrapper = mount(
      <Button tabIndex={0} onBlur={spy}>
        button
      </Button>,
    );
    const button = wrapper.find('button');
    button.prop('onBlur')!({} as any);
    expect(spy).toHaveBeenCalled();
  });

  cases(
    'onMouse* prop is called',
    ({ key }: { key: string }) => {
      const spy = jest.fn();
      const onMouseHandler = { [key]: spy };
      wrapper = mount(<Button {...onMouseHandler}>Button</Button>);
      const button = wrapper.find('button');
      const event = {
        preventDefault: () => {},
      } as React.MouseEvent<HTMLElement>;
      // @ts-ignore
      button.prop(key)!(event);
      expect(spy).toHaveBeenCalled();
    },
    [
      { key: 'onMouseDown' },
      { key: 'onMouseUp' },
      { key: 'onMouseEnter' },
      { key: 'onMouseLeave' },
    ],
  );
});
