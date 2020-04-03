/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';

import {
  AnalyticsDecorator,
  AnalyticsListener,
  cleanProps,
  withAnalytics,
} from '../..';

const Button = withAnalytics(
  class B extends Component {
    onClick = () => {
      this.props.fireAnalyticsEvent('click');
      this.props.firePrivateAnalyticsEvent('private.button.click', {
        one: 1,
      });
    };

    render() {
      const props = cleanProps(this.props);
      return <button {...props} onClick={this.onClick} />;
    }
  },
);

describe('AnalyticsDecorator', () => {
  it('should create a decorator component', () => {
    const component = shallow(
      <AnalyticsDecorator onEvent={() => {}}>
        <div />
      </AnalyticsDecorator>,
    );
    expect(component).not.toBe(undefined);
  });

  it('should extend eventData for analytics events', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should override existing eventData fields', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ one: 2 }}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 2 });
  });

  it('should be nestable with other AnalyticsDecorators', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ three: 3 }}>
          <AnalyticsDecorator data={{ two: 2 }}>
            <Button analyticsId="button" analyticsData={{ one: 1 }} />
          </AnalyticsDecorator>
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', {
      one: 1,
      two: 2,
      three: 3,
    });
  });

  it('should extend eventData by calling a function', () => {
    const spy = jest.fn();
    const getData = () => ({ two: 2 });
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator getData={getData}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should not extend public eventData when matchPrivate is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} matchPrivate>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should extend private eventData when matchPrivate is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} matchPrivate>
        <AnalyticsDecorator data={{ two: 2 }} matchPrivate>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('private.button.click', {
      one: 1,
      two: 2,
    });
  });

  it('should not extend private eventData when matchPrivate is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} matchPrivate>
        <AnalyticsDecorator data={{ two: 2 }}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('private.button.click', { one: 1 });
  });

  it('should not extend public eventData when match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} matchPrivate>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should extend eventData when partial string match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match="button.">
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should extend eventData when full string match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match="button.click">
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should not extend eventData when string match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match="no">
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should extend eventData when regex match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match={/^bu.*$/}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should not extend eventData when regex match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match={/^no.*$/}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should extend eventData when function match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match={() => true}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1, two: 2 });
  });

  it('should not extend eventData when function match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <AnalyticsDecorator data={{ two: 2 }} match={() => false}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsDecorator>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });
});
