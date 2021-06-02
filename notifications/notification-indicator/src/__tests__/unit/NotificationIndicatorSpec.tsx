import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as sinon from 'sinon';

import Badge from '@atlaskit/badge';
import {
  NotificationLogClient,
  NotificationCountResponse,
} from '@atlaskit/notification-log-client';

import NotificationIndicator, {
  ValueUpdatingParams,
  ValueUpdatingResult,
} from '../../NotificationIndicator';

class MockNotificationLogClient extends NotificationLogClient {
  private response?: Promise<NotificationCountResponse>;

  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return (
      this.response ||
      Promise.resolve({
        count: 5,
      })
    );
  }

  public setResponse(response: Promise<NotificationCountResponse>) {
    this.response = response;
  }
}

describe('NotificationIndicator', () => {
  const simulatedClock = sinon.useFakeTimers();

  let notificationLogClient: MockNotificationLogClient;

  function returnCount(count: number): Promise<NotificationCountResponse> {
    return Promise.resolve({ count });
  }

  function returnError(): Promise<NotificationCountResponse> {
    return Promise.reject(new Error());
  }

  async function renderNotificationIndicator(
    response: Promise<NotificationCountResponse>,
    props: object = {},
  ) {
    notificationLogClient.setResponse(response);
    const clientPromise = Promise.resolve(notificationLogClient);

    const wrapper = mount(
      <NotificationIndicator
        notificationLogProvider={clientPromise}
        refreshOnHidden={true}
        {...props}
      />,
    );

    try {
      await clientPromise;
    } catch (e) {}

    try {
      await response;
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

  function triggerVisibilityChange() {
    const visibilityChange = document.createEvent('HTMLEvents');
    visibilityChange.initEvent('visibilitychange', true, true);
    document.body.dispatchEvent(visibilityChange);
  }

  beforeEach(() => {
    notificationLogClient = new MockNotificationLogClient();
    simulatedClock.reset();
  });

  it('Should pass props to badge', async () => {
    const wrapper = await renderNotificationIndicator(returnCount(5), {
      max: 10,
      appearance: 'primary',
    });

    await asyncUpdateComponentTick(wrapper);
    const badge = wrapper.find(Badge);

    expect(badge.prop('children')).toEqual(5);
    expect(badge.prop('max')).toEqual(10);
    expect(badge.prop('appearance')).toEqual('primary');
  });

  it('Should render data-test-selector="NotificationIndicator"', async () => {
    const wrapper = await renderNotificationIndicator(returnCount(5), {
      max: 10,
      appearance: 'primary',
    });

    await asyncUpdateComponentTick(wrapper);
    const dataTestSelector = wrapper.childAt(0);

    expect(dataTestSelector.prop('data-test-selector')).toEqual(
      'NotificationIndicator',
    );
  });

  it('Should not render indicator when there are no new notifications', async () => {
    const wrapper = await renderNotificationIndicator(returnCount(0));

    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.find(Badge).length).toEqual(0);
  });

  it('Should not render indicator when there is an error', async () => {
    const wrapper = await renderNotificationIndicator(returnError());

    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.find(Badge).length).toEqual(0);
  });

  it('Should not refresh when skip=true on call to onCountUpdating', async () => {
    const onCountUpdating = (
      event: ValueUpdatingParams,
    ): ValueUpdatingResult => ({ skip: true });
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      onCountUpdating,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(onCountUpdated.called).toEqual(false);
  });

  it('Should override count when countOverride is set on call to onCountUpdating', async () => {
    const onCountUpdating = (
      event: ValueUpdatingParams,
    ): ValueUpdatingResult => ({ countOverride: 3 });
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnError(), {
      onCountUpdating,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(onCountUpdated.called).toEqual(true);
    expect(wrapper.state('count')).toEqual(3);
  });

  it('Should call onCountUpdated on new count', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(onCountUpdated.called).toEqual(true);
  });

  it('Should call onCountUpdated after refresh returns 0', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(0), {
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(onCountUpdated.called).toEqual(true);
  });

  it('Should call onCountUpdated once after multiple 0 counts', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(0), {
      refreshRate: 1,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(onCountUpdated.callCount).toEqual(1);
  });

  it('Should auto refresh when specified', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 1,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.state('intervalId')).not.toEqual(null);
    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(2));
    simulatedClock.tick(1);
    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.state('count')).toEqual(2);

    wrapper.unmount();
    simulatedClock.tick(1);
    await asyncUpdateComponentTick(wrapper);

    // Ensure window.setInterval has been cleared
    expect(onCountUpdated.callCount).toEqual(2);
  });

  it('Should update refresh interval when refreshRate prop changes', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 1,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('intervalId')).not.toEqual(null);
    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(2));
    simulatedClock.tick(1);
    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.state('count')).toEqual(2);

    // Ensure the original window.setInterval has been removed
    notificationLogClient.setResponse(returnCount(3));
    wrapper.setProps({ refreshRate: 100 });

    simulatedClock.tick(50);
    await asyncUpdateComponentTick(wrapper);
    expect(onCountUpdated.callCount).toEqual(2);

    // Ensure the new window.setInterval has been applied
    wrapper.setProps({ refreshRate: 1 });
    await asyncUpdateComponentTick(wrapper);
    expect(onCountUpdated.callCount).toEqual(2);

    simulatedClock.tick(1); // Wait for the next tick to complete
    await asyncUpdateComponentTick(wrapper);
    expect(onCountUpdated.callCount).toEqual(3);
  });

  it('Should not refresh on visibilitychange if refreshOnVisibilityChange=false', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 99999,
      refreshOnVisibilityChange: false,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await asyncUpdateComponentTick(wrapper);

    // no change
    expect(wrapper.state('count')).toEqual(1);
  });

  it('Should refresh on visibilitychange if document is visible for refreshOnVisibilityChange=true', async () => {
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 99999,
      onCountUpdated,
    });

    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(1);

    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await asyncUpdateComponentTick(wrapper);

    expect(wrapper.state('count')).toEqual(5);
  });

  it('Should not refresh on visibilitychange when skipping too many eager fetches on tab change', async () => {
    const onCountUpdating = ({
      visibilityChangesSinceTimer,
    }: ValueUpdatingParams): ValueUpdatingResult => {
      if ((visibilityChangesSinceTimer as number) > 1) {
        return { skip: true };
      }
      return {};
    };
    const onCountUpdated = sinon.spy();
    const wrapper = await renderNotificationIndicator(returnCount(1), {
      refreshRate: 2,
      onCountUpdating,
      onCountUpdated,
    });
    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(1);

    // initial visibilitychange
    notificationLogClient.setResponse(returnCount(5));
    triggerVisibilityChange();
    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(5);

    // ignore next visibilitychange until timer cycles
    notificationLogClient.setResponse(returnCount(6));
    triggerVisibilityChange();
    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(5);

    // timer has cycled, update on visibilitychange
    simulatedClock.tick(5);
    triggerVisibilityChange();
    await asyncUpdateComponentTick(wrapper);
    expect(wrapper.state('count')).toEqual(6);
  });
});
