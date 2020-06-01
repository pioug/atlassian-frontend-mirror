import React from 'react';
import { mount } from 'enzyme';
import Link from '../../../../react/marks/link';

describe('Renderer - React/Marks/Link', () => {
  const createLink = () =>
    mount(
      <Link
        dataAttributes={{ 'data-renderer-mark': true }}
        href="https://www.atlassian.com"
        target="_blank"
      >
        This is a link
      </Link>,
    );

  it('should wrap content with <a>-tag', () => {
    const mark = createLink();
    expect(mark.find('a').length).toEqual(1);
    mark.unmount();
  });

  it('should set href to attrs.href', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty(
      'href',
      'https://www.atlassian.com',
    );
    mark.unmount();
  });

  it('should set target to _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('target', '_blank');
    mark.unmount();
  });

  it('should not set target by default', () => {
    const mark = mount(
      <Link
        dataAttributes={{ 'data-renderer-mark': true }}
        href="https://www.atlassian.com"
      >
        This is a link
      </Link>,
    );
    expect(mark.find('a').props()).toHaveProperty('target', undefined);
    mark.unmount();
  });

  it('should set target to whatever props.target was', () => {
    const mark = mount(
      <Link
        dataAttributes={{ 'data-renderer-mark': true }}
        href="https://www.atlassian.com"
        target="_top"
      >
        This is a link
      </Link>,
    );
    expect(mark.find('a').props()).toHaveProperty('target', '_top');
    mark.unmount();
  });

  it('should set safety rel on links with target _blank', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('rel', 'noreferrer noopener');
    mark.unmount();
  });

  it('should not set safety rel on links with target _blank', () => {
    const mark = mount(
      <Link
        dataAttributes={{ 'data-renderer-mark': true }}
        href="https://www.atlassian.com"
        target="_top"
      >
        This is a link
      </Link>,
    );
    expect(mark.find('a').props()).not.toHaveProperty('rel');
    mark.unmount();
  });

  it('should set onClick handler when isMediaLink is false', () => {
    const mark = createLink();
    expect(mark.find('a').props()).toHaveProperty('onClick');
    mark.unmount();
  });

  it('should only render children without wrapping <a> when isMediaLink is true', () => {
    const mark = mount(
      <Link
        dataAttributes={{ 'data-renderer-mark': true }}
        href="https://www.atlassian.com"
        target="_top"
        isMediaLink
      >
        <div>test</div>
      </Link>,
    );

    expect(mark.getDOMNode().tagName).toEqual('DIV');
    mark.unmount();
  });

  describe('analytics', () => {
    it('fires on click', () => {
      const fireAnalyticsEvent = jest.fn();
      const linkAroundText = mount(
        <Link
          dataAttributes={{ 'data-renderer-mark': true }}
          href="https://www.atlassian.com"
          target="_top"
          fireAnalyticsEvent={fireAnalyticsEvent}
        >
          Sail ho shrouds spirits.
        </Link>,
      );

      fireAnalyticsEvent.mockClear();
      linkAroundText.find('a').simulate('click');

      expect(fireAnalyticsEvent).toHaveBeenCalledWith({
        action: 'visited',
        actionSubject: 'link',
        attributes: {
          platform: 'web',
          mode: 'renderer',
        },
        eventType: 'track',
      });
    });
  });
});
