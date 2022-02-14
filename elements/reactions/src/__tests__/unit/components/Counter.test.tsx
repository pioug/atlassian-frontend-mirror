import { mount } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { easeIn, easeOut } from '@atlaskit/motion/curves';

import {
  containerStyle,
  Counter,
  highlightStyle,
  Props,
} from '../../../components/Counter';

jest.useFakeTimers();

const renderCounter = (props: Props) => {
  return mount(<Counter {...props} />);
};

describe('Counter', () => {
  it('should render counter', () => {
    const counter = renderCounter({ value: 10 });
    expect(counter.text()).toEqual('10');
  });

  it('should render over limit label', () => {
    const counter = renderCounter({ value: 100 });
    expect(counter.text()).toEqual('99+');
  });

  it('should render using custom limit and label', () => {
    const counter = renderCounter({
      value: 10,
      limit: 10,
      overLimitLabel: '9+',
    });
    expect(counter.text()).toEqual('9+');
  });

  it('should add highlight class', () => {
    const counter = renderCounter({ value: 10, highlight: true });
    expect(counter.find(`div.${highlightStyle}`).exists()).toBeTruthy();
  });

  it('should set width to avoid resizing', () => {
    const counter = renderCounter({ value: 11 });

    expect(counter.children().first().prop('style')).toHaveProperty(
      'width',
      14,
    );
  });

  it('should animate number when value increase', () => {
    const animationDuration = 300;
    const counter = renderCounter({ value: 5, animationDuration });

    expect(counter);

    counter.setProps({ value: 6, highlight: true });

    // in the middle of animation
    act(() => {
      jest.runTimersToTime(animationDuration / 2);
    });

    // previous counter container
    const previousContainer = counter.find(`.${containerStyle}`).at(0);

    // current counter container
    const container = counter.find(`.${containerStyle}`).at(1);

    expect(previousContainer.childAt(0).prop('className')).not.toContain(
      highlightStyle,
    );
    expect(
      getComputedStyle(previousContainer.getDOMNode()).animationTimingFunction,
    ).toEqual(easeIn);

    expect(container.childAt(0).prop('className')).toContain(highlightStyle);
    expect(
      getComputedStyle(container.getDOMNode()).animationTimingFunction,
    ).toEqual(easeOut);

    // finished animation
    act(() => {
      jest.runTimersToTime(animationDuration);
    });

    expect(counter.text()).toEqual('6');
    expect(
      getComputedStyle(container.getDOMNode()).animationTimingFunction,
    ).toEqual('');
  });

  it('should animate number when value decrease', () => {
    const animationDuration = 300;
    const counter = renderCounter({
      value: 5,
      highlight: true,
      animationDuration,
    });

    expect(counter);

    counter.setProps({ value: 4, highlight: false });

    // in the middle of animation
    act(() => {
      jest.runTimersToTime(animationDuration / 2);
    });

    // previous counter container
    const previousContainer = counter.find(`.${containerStyle}`).at(0);

    // current container of SlideIn count
    const container = counter.find(`.${containerStyle}`).at(1);

    expect(previousContainer.childAt(0).prop('className')).toContain(
      highlightStyle,
    );

    expect(
      getComputedStyle(previousContainer.getDOMNode()).animationTimingFunction,
    ).toEqual(easeIn);

    expect(container.childAt(0).prop('className')).not.toContain(
      highlightStyle,
    );
    expect(
      getComputedStyle(container.getDOMNode()).animationTimingFunction,
    ).toEqual(easeOut);

    // finished animation
    act(() => {
      jest.runTimersToTime(animationDuration);
    });

    expect(counter.text()).toEqual('4');
    expect(
      getComputedStyle(container.getDOMNode()).animationTimingFunction,
    ).toEqual('');
  });
});
