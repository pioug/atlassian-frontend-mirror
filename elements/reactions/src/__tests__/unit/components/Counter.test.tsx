import { mount } from 'enzyme';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  containerStyle,
  Counter,
  highlightStyle,
  Props,
  slideDownStyle,
  slideUpStyle,
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
    const counter = renderCounter({ value: 5 });

    expect(counter.find(CSSTransition).prop('in')).toBeFalsy();

    counter.setProps({ value: 6, highlight: true });

    expect(counter.state('previous')).toEqual({
      highlight: false,
      value: 5,
    });
    expect(counter.find(CSSTransition).prop('in')).toBeTruthy();
    expect(counter.find(CSSTransition).prop('classNames')).toHaveProperty(
      'enter',
      slideUpStyle,
    );

    const container = counter.find(`.${containerStyle}`);
    expect(container.childAt(0).prop('className')).not.toContain(
      highlightStyle,
    );
    expect(container.childAt(0).text()).toEqual('5');
    expect(container.childAt(1).prop('className')).toContain(highlightStyle);
    expect(container.childAt(1).text()).toEqual('6');

    jest.runTimersToTime(300);

    expect(counter.state('previous')).toBeUndefined();
    counter.update();
    expect(counter.find(CSSTransition).prop('in')).toBeFalsy();
  });

  it('should animate number when value decrease', () => {
    const counter = renderCounter({ value: 5, highlight: true });

    expect(counter.find(CSSTransition).prop('in')).toBeFalsy();

    counter.setProps({ value: 4, highlight: false });

    expect(counter.state('previous')).toEqual({
      highlight: true,
      value: 5,
    });
    expect(counter.find(CSSTransition).prop('in')).toBeTruthy();
    expect(counter.find(CSSTransition).prop('classNames')).toHaveProperty(
      'enter',
      slideDownStyle,
    );

    const container = counter.find(`.${containerStyle}`);
    expect(container.childAt(0).prop('className')).not.toContain(
      highlightStyle,
    );
    expect(container.childAt(0).text()).toEqual('4');
    expect(container.childAt(1).prop('className')).toContain(highlightStyle);
    expect(container.childAt(1).text()).toEqual('5');

    jest.runTimersToTime(300);

    expect(counter.state('previous')).toBeUndefined();
    counter.update();
    expect(counter.find(CSSTransition).prop('in')).toBeFalsy();
  });
});
