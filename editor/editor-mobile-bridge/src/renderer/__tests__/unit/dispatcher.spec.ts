import { eventDispatcher, EmitterEvents } from '../../dispatcher';

describe('event dispatcher', () => {
  it('should register event listener with passed event', () => {
    expect(
      eventDispatcher.listeners(EmitterEvents.SET_RENDERER_CONTENT).length,
    ).toBe(0);
    const callbackMethodListener = jest.fn();
    eventDispatcher.on(
      EmitterEvents.SET_RENDERER_CONTENT,
      callbackMethodListener,
    );
    expect(
      eventDispatcher.listeners(EmitterEvents.SET_RENDERER_CONTENT).length,
    ).toBe(1);
    expect(
      eventDispatcher.listeners(EmitterEvents.SET_RENDERER_CONTENT)[0],
    ).toBe(callbackMethodListener);
  });
});
