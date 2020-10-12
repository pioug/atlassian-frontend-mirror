import React from 'react';
import { UnwrappedAnalyticsEventFiredOnMount } from '../../AnalyticsEventFiredOnMount';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { mount } from 'enzyme';
import { CreateAnalyticsEventFn } from '../../types';
import { DEFAULT_GAS_CHANNEL } from '../../../../util/analytics-util';

const mockPayloadA: GasPayload = {
  action: 'action-A',
  actionSubject: 'actionSubject-A',
  eventType: 'screen',
  source: 'source-A',
};

const mockPayloadB: GasPayload = {
  action: 'action-B',
  actionSubject: 'actionSubject-B',
  eventType: 'screen',
  source: 'source-B',
};

describe('AnalyticsEventFiredOnMount', () => {
  let createAnalyticsEventStub: CreateAnalyticsEventFn;
  let onEventFiredStub: jest.Mock;
  let payloadProviderStub: jest.Mock;
  let mockEvent: { context?: never[]; update: any; fire: any };

  beforeEach(() => {
    onEventFiredStub = jest.fn();
    payloadProviderStub = jest
      .fn()
      .mockReturnValueOnce(mockPayloadA)
      .mockReturnValueOnce(mockPayloadB);
    mockEvent = {
      context: [],
      update: jest.fn(() => mockEvent),
      fire: jest.fn(() => mockEvent),
    };
    createAnalyticsEventStub = jest.fn().mockReturnValue(mockEvent);
  });

  it('should fire the correct event with the supplied payload, and the callback', () => {
    mount(
      <UnwrappedAnalyticsEventFiredOnMount
        onEventFired={onEventFiredStub}
        payloadProvider={payloadProviderStub}
        createAnalyticsEvent={createAnalyticsEventStub}
      />,
    );

    // ensure event payload is updated with the correct payload.
    expect(mockEvent.update.mock.calls.length).toBe(1);
    expect(mockEvent.update.mock.calls[0][0]).toBe(mockPayloadA);

    // ensure event fired once on the correct channel
    expect(mockEvent.fire.mock.calls.length).toBe(1);
    expect(mockEvent.fire.mock.calls[0][0]).toBe(DEFAULT_GAS_CHANNEL);

    // ensure callback called
    expect(onEventFiredStub.mock.calls.length).toBe(1);
  });

  it('should fire the correct event wth the supplier payload after subsequent unmount/mounts', () => {
    const wrapper = mount(
      <UnwrappedAnalyticsEventFiredOnMount
        onEventFired={onEventFiredStub}
        payloadProvider={payloadProviderStub}
        createAnalyticsEvent={createAnalyticsEventStub}
      />,
    );

    // unmount and mount to simulate the component's lifecycle
    wrapper.unmount();
    wrapper.mount();

    // ensure event payload is correct
    expect(mockEvent.update.mock.calls.length).toBe(2);
    expect(mockEvent.update.mock.calls[1][0]).toBe(mockPayloadB);

    // ensure event fired twice on the correct channel
    expect(mockEvent.fire.mock.calls.length).toBe(2);
    expect(mockEvent.fire.mock.calls[1][0]).toBe(DEFAULT_GAS_CHANNEL);

    // ensure callback called twice
    expect(onEventFiredStub.mock.calls.length).toBe(2);
  });
});
