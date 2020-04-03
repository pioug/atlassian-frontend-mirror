import React from 'react';
import { mount } from 'enzyme';
import NotificationDrawer from '../../index';

describe('NotificationDrawerContents', () => {
  it('should add the correct url to the iframe', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    expect(
      wrapper
        .find('iframe')
        .props()
        .src.endsWith(
          '/home/notificationsDrawer/iframe.html?locale=en&product=jira',
        ),
    ).toBeTruthy();
  });

  it('should add spinner when iframe is loading', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    expect(wrapper.find('Spinner').exists()).toBeTruthy();
  });

  it('should remove spinner when iframe is finished loading', () => {
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);
    wrapper.find('iframe').simulate('load');

    expect(wrapper.find('Spinner').exists()).toBeFalsy();
  });

  it('should add an event listener to listen to "postMessage" messages when mounting', () => {
    const spy = jest.spyOn(window, 'addEventListener');
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);

    const { handleMessage } = wrapper.instance();

    expect(spy).toHaveBeenCalledWith('message', handleMessage);
  });

  it('should remove the event listener listening to "postMessage" messages when unmounting', () => {
    const spy = jest.spyOn(window, 'removeEventListener');
    const wrapper = mount(<NotificationDrawer locale="en" product="jira" />);
    const { handleMessage } = wrapper.instance();

    wrapper.unmount();

    expect(spy).toHaveBeenCalledWith('message', handleMessage);
  });
});
