import * as Core from './binaries/mediaEditor';

// Called on the timer tick, accepts a timer id
export type TimerTickHandler = (id: number) => void;

// For better testing we provide functions that can be used to start and stop timers.
// The starter function starts the timer immediately and returns a nonzero handle that can be used
// to stop the timer with the stopper function.
export type TimerCallback = () => void;
export type TimerHandle = number;
export type TimerStarter = (
  callback: TimerCallback,
  msecInterval: number,
) => TimerHandle;
export type TimerStopper = (handle: TimerHandle) => void;

// Active timer that starts when constructed. To stop it call unload()
class ActiveTimer {
  private handle: TimerHandle;

  constructor(
    callback: TimerCallback,
    msecInterval: number,
    starter: TimerStarter,
    private stopper: TimerStopper,
  ) {
    this.handle = starter(callback, msecInterval);
  }

  unload(): void {
    if (this.handle !== 0) {
      this.stopper(this.handle);
      this.handle = 0;
    }
  }
}

// Responsible for providing timers for the core.
//
// The core creates a timer with createTimer() and receives the id.
// Then it may call startTimer() and stopTimer() on the same id many times.
export class TimerFactory implements Core.TimerFactoryInterop {
  private lastId: number = 0;
  private activeTimers: { [id: number]: ActiveTimer } = {};

  constructor(
    private onTick: TimerTickHandler,
    private timerStarter?: TimerStarter,
    private timerStopper?: TimerStopper,
  ) {}

  unload(): void {
    for (let id in this.activeTimers) {
      this.activeTimers[id].unload();
    }
  }

  createTimer(): number {
    return this.lastId++;
  }

  startTimer(id: number, msecInterval: number): void {
    // If the timer with this id already running, we must stop it
    this.unloadTimer(id);

    this.activeTimers[id] = new ActiveTimer(
      () => {
        this.onTick(id);
      },
      msecInterval,
      this.timerStarter || TimerFactory.defaultStarter,
      this.timerStopper || TimerFactory.defaultStopper,
    );
  }

  stopTimer(id: number): void {
    this.unloadTimer(id);
    delete this.activeTimers[id];
  }

  private unloadTimer(id: number): void {
    const current = this.activeTimers[id];
    if (current) {
      current.unload();
    }
  }

  private static defaultStarter(
    callback: TimerCallback,
    msecInterval: number,
  ): TimerHandle {
    return window.setInterval(callback, msecInterval);
  }

  private static defaultStopper(handle: TimerHandle): void {
    clearInterval(handle);
  }
}
