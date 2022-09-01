import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { matchers } from '@emotion/jest';
import { easeIn, easeOut } from '@atlaskit/motion/curves';
import { renderWithIntl } from '../../__tests__/_testing-library';
import {
  Counter,
  RENDER_COUNTER_TESTID,
  CounterProps,
  RENDER_COUNTER_WRAPPER_TESTID,
} from './Counter';
import * as styles from './styles';

expect.extend(matchers);

jest.useFakeTimers();

const renderCounter = (props: CounterProps) => {
  return mount(<Counter {...props} />);
};

describe('@atlaskit/reactions/components/Counter', () => {
  it('should render counter', () => {
    const counter = renderCounter({ value: 10 });
    expect(counter.text()).toEqual('10');
  });

  it('should render over limit label', () => {
    const counter = renderCounter({ value: 1000 });
    expect(counter.text()).toEqual('1k+');
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
    expect(
      counter.find(`div.css-${styles.highlightStyle.name}`).exists(),
    ).toBeTruthy();
  });

  it('should set width to avoid resizing', async () => {
    renderWithIntl(<Counter value={11} />);

    const wrapperDiv = await screen.findByTestId(RENDER_COUNTER_WRAPPER_TESTID);
    expect(wrapperDiv).toHaveStyleRule('width', '14px');
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
    const previousContainer = counter
      .find(`div[data-testid="${RENDER_COUNTER_TESTID}"]`)
      .at(0);

    // current counter container
    const container = counter
      .find(`div[data-testid="${RENDER_COUNTER_TESTID}"]`)
      .at(1);

    expect(
      previousContainer
        .childAt(0)
        .childAt(0)
        .hasClass(`css-${styles.highlightStyle.name}`),
    ).toBe(false);
    expect(
      getComputedStyle(previousContainer.getDOMNode()).animationTimingFunction,
    ).toEqual(easeIn);

    expect(
      container
        .childAt(0)
        .childAt(0)
        .hasClass(`css-${styles.highlightStyle.name}`),
    ).toBe(true);
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
    const previousContainer = counter
      .find(`div[data-testid="${RENDER_COUNTER_TESTID}"]`)
      .at(0);

    // current counter container
    const container = counter
      .find(`div[data-testid="${RENDER_COUNTER_TESTID}"]`)
      .at(1);

    expect(
      previousContainer
        .childAt(0)
        .childAt(0)
        .hasClass(`css-${styles.highlightStyle.name}`),
    ).toBe(true);

    expect(
      getComputedStyle(previousContainer.getDOMNode()).animationTimingFunction,
    ).toEqual(easeIn);

    expect(
      container
        .childAt(0)
        .childAt(0)
        .hasClass(`css-${styles.highlightStyle.name}`),
    ).toBe(false);
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
