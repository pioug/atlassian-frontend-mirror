/* eslint-disable */
/* prettier-ignore */

import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';

import { AnalyticsListener, cleanProps, withAnalytics } from '../..';

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

describe('AnalyticsListener', () => {
  it('should create a listener component', () => {
    const component = shallow(
      <AnalyticsListener onEvent={() => {}}>
        <div />
      </AnalyticsListener>,
    );
    expect(component).not.toBe(undefined);
  });

  it('should send public event', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy}>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should be nestable with other AnalyticsListeners', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy2}>
        <AnalyticsListener onEvent={spy1}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsListener>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy1).toHaveBeenCalledWith('button.click', { one: 1 });

    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should send private event when matchPrivate is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} matchPrivate>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('private.button.click', { one: 1 });
  });

  it('should send private and public events when nested', () => {
    const privateSpy = jest.fn();
    const publicSpy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={privateSpy} matchPrivate>
        <AnalyticsListener onEvent={publicSpy}>
          <Button analyticsId="button" analyticsData={{ one: 1 }} />
        </AnalyticsListener>
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(privateSpy).toHaveBeenCalledTimes(1);
    expect(privateSpy).toHaveBeenCalledWith('private.button.click', { one: 1 });

    expect(publicSpy).toHaveBeenCalledTimes(1);
    expect(publicSpy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should send event when partial string match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match="button.">
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should send event when full string match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match="button.click">
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should not send event when string match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match="no">
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should send event when regex match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match={/^bu.*$/}>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should not send event when regex match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match={/^no.*$/}>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should send event when function match is true', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match={() => true}>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('button.click', { one: 1 });
  });

  it('should not send event when function match is false', () => {
    const spy = jest.fn();
    const listener = mount(
      <AnalyticsListener onEvent={spy} match={() => false}>
        <Button analyticsId="button" analyticsData={{ one: 1 }} />
      </AnalyticsListener>,
    );

    listener.find(Button).simulate('click');
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
