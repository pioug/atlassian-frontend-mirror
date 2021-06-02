import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as sinon from 'sinon';

import {
  NotificationLogClient,
  NotificationCountResponse,
  NotificationLogProvider,
} from '@atlaskit/notification-log-client';

import NotificationIndicator from '../../NotificationIndicator';

class MockNotificationLogClient extends NotificationLogClient {
  private response: Promise<NotificationCountResponse>;

  constructor(response: Promise<NotificationCountResponse>) {
    super('', '');
    this.response = response;
  }

  public async countUnseenNotifications() {
    return this.response;
  }

  public setResponse(response: Promise<NotificationCountResponse>) {
    this.response = response;
  }
}

describe('NotificationIndicator', () => {
  const simulatedClock = sinon.useFakeTimers();

  let notificationLogClient: MockNotificationLogClient;
  let mockCreateAnalyticsEvent: any;
  let mockClientPromise: Promise<NotificationLogProvider>;
  let notificationLogResponse: Promise<NotificationCountResponse>;

  function setMockResponseCount(count: number) {
    notificationLogResponse = Promise.resolve({ count });
    notificationLogClient.setResponse(notificationLogResponse);
    mockClientPromise = Promise.resolve(notificationLogClient);
  }

  async function renderNotificationIndicator(props: Object = {}) {
    const wrapper = mount(
      <NotificationIndicator
        notificationLogProvider={mockClientPromise}
        refreshOnHidden={true}
        createAnalyticsEvent={mockCreateAnalyticsEvent}
        {...props}
      />,
    );

    try {
      await mockClientPromise;
    } catch (e) {}

    try {
      await notificationLogResponse;
    } catch (e) {}

    return wrapper;
  }

  async function asyncUpdateComponentTick(wrapper: ReactWrapper) {
    return new Promise((tickFinished) => {
      process.nextTick(() => {
        wrapper.update();
        tickFinished();
      });
    });
  }

  beforeEach(() => {
    notificationLogClient = new MockNotificationLogClient(
      Promise.resolve({ count: 0 }),
    );
    mockCreateAnalyticsEvent = jest.fn((analytics) => {
      return {
        fire: () => null,
      };
    });
    simulatedClock.reset();
  });

  it('Should trigger analytics events when activating on mount', async () => {
    setMockResponseCount(7);
    const wrapper = await renderNotificationIndicator({
      max: 10,
      appearance: 'primary',
    });

    await asyncUpdateComponentTick(wrapper);

    expect(mockCreateAnalyticsEvent.mock.calls.length).toBe(2);
    expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'activated',
      attributes: {
        badgeCount: 7,
        refreshSource: 'mount',
      },
    });
    expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'updated',
      attributes: {
        oldCount: 0,
        newCount: 7,
        refreshSource: 'mount',
      },
    });
  });

  it('Should trigger analytics events when activating on timer', async () => {
    setMockResponseCount(0);
    const wrapper = await renderNotificationIndicator({
      max: 10,
      appearance: 'primary',
      refreshRate: 20,
    });
    await asyncUpdateComponentTick(wrapper);
    expect(mockCreateAnalyticsEvent.mock.calls.length).toBe(0);

    setMockResponseCount(10);
    simulatedClock.tick(20);
    await asyncUpdateComponentTick(wrapper);

    expect(mockCreateAnalyticsEvent.mock.calls.length).toBe(2);
    expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'activated',
      attributes: {
        badgeCount: 10,
        refreshSource: 'timer',
      },
    });
    expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'updated',
      attributes: {
        oldCount: 0,
        newCount: 10,
        refreshSource: 'timer',
      },
    });
  });

  it('Should not trigger an activated event more than once', async () => {
    setMockResponseCount(7);
    const wrapper = await renderNotificationIndicator({
      max: 10,
      appearance: 'primary',
      refreshRate: 20,
    });
    await asyncUpdateComponentTick(wrapper);

    // Mount events
    expect(mockCreateAnalyticsEvent.mock.calls.length).toBe(2);
    expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'activated',
      attributes: {
        badgeCount: 7,
        refreshSource: 'mount',
      },
    });
    expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'updated',
      attributes: {
        oldCount: 0,
        newCount: 7,
        refreshSource: 'mount',
      },
    });

    setMockResponseCount(10);
    simulatedClock.tick(20);
    await asyncUpdateComponentTick(wrapper);

    // On refresh we only expect the updated event because the indicator was already 'activated'
    expect(mockCreateAnalyticsEvent.mock.calls.length).toBe(3);
    expect(mockCreateAnalyticsEvent.mock.calls[2][0]).toEqual({
      actionSubject: 'notificationIndicator',
      action: 'updated',
      attributes: {
        oldCount: 7,
        newCount: 10,
        refreshSource: 'timer',
      },
    });
  });
});
