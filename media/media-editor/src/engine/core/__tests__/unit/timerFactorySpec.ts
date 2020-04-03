import { TimerHandle, TimerFactory } from '../../timerFactory';

type TimerCallback = () => {};

describe('MediaEditor TimerFactory', () => {
  let lastHandle: TimerHandle = 0;
  let timerCallbacks: { [handle: number]: TimerCallback };
  let timerFactory: TimerFactory;

  // When a new timer is started, its callback is placed to timerCallbacks.
  // Timer handles start from 1 because a handle can not be 0.
  const timerStarter = (callback: TimerCallback) => {
    const handle = ++lastHandle;

    expect(handle).not.toBe(0);
    expect(timerCallbacks[handle]).toBeUndefined();
    timerCallbacks[handle] = callback;

    return handle;
  };

  const timerStopper = (handle: TimerHandle) => {
    expect(timerCallbacks[handle]).toBeDefined();
    delete timerCallbacks[handle];
  };

  let lastIdTicked: number; // last id of the timer that ticked

  beforeEach(() => {
    lastHandle = 0;
    timerCallbacks = {};

    // TODO: Media migration to new repo - typescript error - void is not assignable to {}
    timerFactory = new TimerFactory(
      id => {
        lastIdTicked = id;
      },
      timerStarter as any,
      timerStopper,
    );
  });

  afterEach(() => {
    timerFactory.unload();
  });

  it('should returns different ids for createTimer', () => {
    const first = timerFactory.createTimer();
    const second = timerFactory.createTimer();
    expect(first).not.toBe(second);
  });

  it('should not start timer after createTimer', () => {
    timerFactory.createTimer();
    expect(timerCallbacks[1]).toBeUndefined();
  });

  it('should trigger ticks after timer starts', () => {
    const id = timerFactory.createTimer();
    timerFactory.startTimer(id, 100);
    expect(timerCallbacks[1]).not.toBeUndefined();

    timerCallbacks[1]();
    expect(lastIdTicked).toBe(id);
    lastIdTicked = -1;

    timerCallbacks[1]();
    expect(lastIdTicked).toBe(id);

    timerFactory.stopTimer(id);
    expect(timerCallbacks[1]).toBeUndefined();
  });

  it('should trigger ticks for correct timer', () => {
    const firstId = timerFactory.createTimer();
    const secondId = timerFactory.createTimer();

    timerFactory.startTimer(firstId, 100);
    timerFactory.startTimer(secondId, 200);

    timerCallbacks[1]();
    expect(lastIdTicked).toBe(firstId);
    lastIdTicked = -1;

    timerCallbacks[2]();
    expect(lastIdTicked).toBe(secondId);
    lastIdTicked = -1;

    timerCallbacks[2]();
    expect(lastIdTicked).toBe(secondId);
    lastIdTicked = -1;

    timerCallbacks[1]();
    expect(lastIdTicked).toBe(firstId);
    lastIdTicked = -1;

    timerFactory.stopTimer(secondId);
    expect(timerCallbacks[1]).not.toBeUndefined();
    expect(timerCallbacks[2]).toBeUndefined();

    timerFactory.stopTimer(firstId);
    expect(timerCallbacks[1]).toBeUndefined();
  });

  it('should ignore stop for not started', () => {
    const id = timerFactory.createTimer();
    timerFactory.stopTimer(id);
    expect(timerCallbacks[1]).toBeUndefined();
  });

  it('should ignore stop for invalid id', () => {
    const id = timerFactory.createTimer();
    timerFactory.startTimer(id, 100);
    timerFactory.stopTimer(id + 1);
  });

  it('should safely handle double stop', () => {
    const id = timerFactory.createTimer();

    timerFactory.startTimer(id, 100);
    expect(timerCallbacks[1]).not.toBeUndefined();

    timerFactory.stopTimer(id);
    expect(timerCallbacks[1]).toBeUndefined();

    timerFactory.stopTimer(id);
  });

  it('should delete active timers at unload', () => {
    const firstId = timerFactory.createTimer();
    const secondId = timerFactory.createTimer();

    timerFactory.startTimer(firstId, 100);
    timerFactory.startTimer(secondId, 100);
    expect(timerCallbacks[1]).not.toBeUndefined();
    expect(timerCallbacks[2]).not.toBeUndefined();

    timerFactory.unload();
    expect(timerCallbacks[1]).toBeUndefined();
    expect(timerCallbacks[2]).toBeUndefined();
  });
});
