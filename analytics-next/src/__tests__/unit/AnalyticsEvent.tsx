import { AnalyticsEvent } from '../..';

it('should be constructed with both action and payload args', () => {
  const analyticsEvent = new AnalyticsEvent({
    payload: { action: 'b' },
  });
  expect(analyticsEvent).toEqual(expect.any(AnalyticsEvent));
  expect(analyticsEvent.payload).toEqual({ action: 'b' });
});

it('can be cloned into a new event which has the same action and payload', () => {
  const analyticsEvent = new AnalyticsEvent({
    payload: {
      action: 'c',
    },
  });
  const clonedEvent = analyticsEvent.clone();
  expect(analyticsEvent.payload).toEqual(clonedEvent!.payload);
});

it('should deep clone event payloads when cloning', () => {
  const analyticsEvent = new AnalyticsEvent({
    payload: {
      action: 'a',
      user: {
        id: 1,
      },
    },
  });
  const clonedEvent = analyticsEvent.clone();
  expect(analyticsEvent).not.toBe(clonedEvent);
  expect(analyticsEvent.payload).not.toBe(clonedEvent!.payload);
  expect(analyticsEvent.payload.user).not.toBe(clonedEvent!.payload.user);
});

it('payload can be updated with an object that is shallow merged', () => {
  const analyticsEvent = new AnalyticsEvent({
    payload: {
      action: 'c',
    },
  });
  analyticsEvent.update({ d: 'e' });
  expect(analyticsEvent.payload).toEqual({
    action: 'c',
    d: 'e',
  });

  analyticsEvent.update({ action: 'g' });
  expect(analyticsEvent.payload).toEqual({
    action: 'g',
    d: 'e',
  });
});

it('payload can be updated with a function', () => {
  const analyticsEvent = new AnalyticsEvent({
    payload: {
      d: { b: 'c' },
      action: 'e',
    },
  });

  analyticsEvent.update(payload => ({
    ...payload,
    d: {
      ...payload.d,
      f: 'g',
    },
  }));
  expect(analyticsEvent.payload).toEqual({
    d: { b: 'c', f: 'g' },
    action: 'e',
  });
});
