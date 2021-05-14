import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { Notifications } from '../../Notifications';

describe('NotificationDrawerContents', () => {
  let container: HTMLDivElement;

  beforeAll(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterAll(() => {
    document.body.removeChild(container);
  });

  const testIframeUrl = (notifications: ReactWrapper, src: string) => {
    expect(notifications.find('iframe').props()).toMatchObject({ src });
  };

  it('should add the correct url to the iframe by default', () => {
    const notifications = mount(<Notifications />);
    testIframeUrl(notifications, '/home/notificationsDrawer/iframe.html');
  });

  it('should add the correct url to the iframe when a locale is provided', () => {
    const notifications = mount(<Notifications locale="en" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?locale=en',
    );
  });

  it('should add the correct url to the iframe when a product is provided', () => {
    const notifications = mount(<Notifications product="jira" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?product=jira',
    );
  });

  it('should add the correct url to the iframe when a locale and product is provided', () => {
    const notifications = mount(<Notifications locale="en" product="jira" />);
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?locale=en&product=jira',
    );
  });

  it('should ignore subproduct in legacy experience', () => {
    const notifications = mount(
      <Notifications locale="en" product="jira" subproduct="jira_software" />,
    );
    testIframeUrl(
      notifications,
      '/home/notificationsDrawer/iframe.html?locale=en&product=jira',
    );
  });

  it('should add the correct url to the iframe when the new experience is enabled', () => {
    const notifications = mount(
      <Notifications
        locale="en"
        product="jira"
        subproduct="software"
        isNewExperience
      />,
    );
    testIframeUrl(
      notifications,
      '/home/notificationList/index.html?locale=en&product=jira&subproduct=software',
    );
  });

  it('should add override the default URL when passing the `_url` prop', () => {
    const notifications = mount(
      <Notifications
        _url="http://example.com/foo.html?foo=bar&bar=baz"
        locale="en"
        product="jira"
      />,
    );
    testIframeUrl(notifications, 'http://example.com/foo.html?foo=bar&bar=baz');
  });
});
