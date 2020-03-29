import {
  UIAnalyticsEvent,
  UIAnalyticsEventProps,
  UIAnalyticsEventHandler,
} from '../..';

let consoleHandler: UIAnalyticsEventHandler;
let standardEventArgs: UIAnalyticsEventProps;

beforeEach(() => {
  consoleHandler = jest.fn();
  standardEventArgs = {
    payload: { action: 'b' },
    context: [{ product: 'abc' }, { location: 'xyz' }],
    handlers: [consoleHandler],
  };
});

it('should construct with required args', () => {
  const analyticsEvent = new UIAnalyticsEvent({
    payload: { action: 'b' },
  });

  expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
  expect(analyticsEvent.payload).toEqual({ action: 'b' });
  expect(analyticsEvent.context).toEqual([]);
  expect(analyticsEvent.handlers).toEqual([]);
});

it('should construct with optional args', () => {
  const analyticsEvent = new UIAnalyticsEvent(standardEventArgs);

  expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
  expect(analyticsEvent.context).toEqual([
    { product: 'abc' },
    { location: 'xyz' },
  ]);
  expect(analyticsEvent.handlers).toEqual([consoleHandler]);
});

it('can be cloned into a new event', () => {
  const analyticsEvent = new UIAnalyticsEvent(standardEventArgs);

  const newEvent = analyticsEvent.clone();

  expect(analyticsEvent).not.toBe(newEvent);
  expect(analyticsEvent.payload).toEqual(newEvent!.payload);
  expect(analyticsEvent.context).toEqual(newEvent!.context);
  expect(analyticsEvent.handlers).toEqual(newEvent!.handlers);
});

it('should deep clone event payloads when cloning', () => {
  const analyticsEvent = new UIAnalyticsEvent({
    context: [],
    handlers: [],
    payload: {
      action: 'click',
      a: { b: 'c' },
    },
  });
  const clonedEvent = analyticsEvent.clone();

  expect(analyticsEvent).not.toBe(clonedEvent);
  expect(analyticsEvent.payload).not.toBe(clonedEvent!.payload);
  expect(analyticsEvent.payload.a).not.toBe(clonedEvent!.payload.a);
});

it('payload can be updated with an object that is shallow merged', () => {
  const analyticsEvent = new UIAnalyticsEvent({
    context: [],
    handlers: [],
    payload: {
      action: 'click',
      a: { b: 'c' },
    },
  });
  analyticsEvent.update({ d: 'e' });
  expect(analyticsEvent.payload).toEqual({
    action: 'click',
    a: { b: 'c' },
    d: 'e',
  });

  analyticsEvent.update({ a: { f: 'g' } });
  expect(analyticsEvent.payload).toEqual({
    action: 'click',
    a: { f: 'g' },
    d: 'e',
  });
});

it('payload can be updated with a function', () => {
  const analyticsEvent = new UIAnalyticsEvent({
    context: [],
    handlers: [],
    payload: {
      action: 'click',
      a: { b: 'c' },
      d: 'e',
    },
  });

  analyticsEvent.update(payload => ({
    ...payload,
    a: {
      ...payload.a,
      f: 'g',
    },
  }));
  expect(analyticsEvent.payload).toEqual({
    action: 'click',
    a: { b: 'c', f: 'g' },
    d: 'e',
  });
});

it('executes all event handlers when fired without a channel', () => {
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  const analyticsEvent = new UIAnalyticsEvent({
    ...standardEventArgs,
    handlers: [handler1, handler2],
  });

  expect(handler1).not.toHaveBeenCalled();
  expect(handler2).not.toHaveBeenCalled();
  analyticsEvent.fire();
  expect(handler1).toHaveBeenCalledWith(analyticsEvent, undefined);
  expect(handler2).toHaveBeenCalledWith(analyticsEvent, undefined);
});

it('executes all event handlers when fired with a channel', () => {
  const handler1 = jest.fn();
  const handler2 = jest.fn();
  const analyticsEvent = new UIAnalyticsEvent({
    ...standardEventArgs,
    handlers: [handler1, handler2],
  });

  expect(handler1).not.toHaveBeenCalled();
  expect(handler2).not.toHaveBeenCalled();
  analyticsEvent.fire('abc');
  expect(handler1).toHaveBeenCalledWith(analyticsEvent, 'abc');
  expect(handler2).toHaveBeenCalledWith(analyticsEvent, 'abc');
});

it('method calls do not work after being fired', () => {
  const analyticsEvent = new UIAnalyticsEvent(standardEventArgs);
  analyticsEvent.fire();
  expect(consoleHandler).toHaveBeenCalledTimes(1);

  const newEvent = analyticsEvent.clone();
  expect(newEvent).toBeNull();

  analyticsEvent.update({ a: 'c' });
  expect(analyticsEvent.payload).toEqual({ action: 'b' });

  analyticsEvent.fire();
  expect(consoleHandler).toHaveBeenCalledTimes(1);
});
