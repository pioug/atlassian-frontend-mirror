import { FakeMouseElement } from '../utilities';

import { clearScheduled, scheduleTimeout } from './shared-schedule';

// This file is a singleton for managing tooltips

export type Source =
  | {
      type: 'mouse';
      mouse: FakeMouseElement;
    }
  | { type: 'keyboard' };

export type Entry = {
  source: Source;
  show: (value: { isImmediate: boolean }) => void;
  hide: (value: { isImmediate: boolean }) => void;
  delay: number;
  done: () => void;
};

export type API = {
  isActive: () => boolean;
  getInitialMouse: () => FakeMouseElement | null;
  requestHide: (value: { isImmediate: boolean }) => void;
  finishHideAnimation: () => void;
  keep: () => void;
  abort: () => void;
};

type Phase =
  | 'waiting-to-show'
  | 'shown'
  | 'waiting-to-hide'
  | 'hide-animating'
  | 'done';

type Active = {
  entry: Entry;
  isVisible: () => boolean;
};
let active: Active | null = null;

export function show(entry: Entry): API {
  let phase: Phase = 'waiting-to-show';

  function isActive(): boolean {
    return Boolean(active && active.entry === entry);
  }

  function cleanup() {
    if (isActive()) {
      clearScheduled();
      active = null;
    }
  }
  function done() {
    if (isActive()) {
      entry.done();
    }
    phase = 'done';
    cleanup();
  }

  function immediatelyHideAndDone() {
    if (isActive()) {
      entry.hide({ isImmediate: true });
    }
    done();
  }

  function keep() {
    if (!isActive()) {
      return;
    }

    // aborting a wait to hide
    if (phase === 'waiting-to-hide') {
      phase = 'shown';
      clearScheduled();
      return;
    }

    // aborting hide animation
    if (phase === 'hide-animating') {
      phase = 'shown';
      clearScheduled();
      entry.show({ isImmediate: false });
      return;
    }
  }

  function requestHide({ isImmediate }: { isImmediate: boolean }) {
    if (!isActive()) {
      return;
    }

    // If we were not showing yet anyway; finish straight away
    if (phase === 'waiting-to-show') {
      immediatelyHideAndDone();
      return;
    }

    // already waiting to hide
    if (phase === 'waiting-to-hide') {
      return;
    }

    if (isImmediate) {
      immediatelyHideAndDone();
      return;
    }
    phase = 'waiting-to-hide';
    scheduleTimeout(() => {
      phase = 'hide-animating';
      entry.hide({ isImmediate: false });
    }, entry.delay);
  }

  function finishHideAnimation() {
    if (isActive() && phase === 'hide-animating') {
      done();
    }
  }
  function isVisible(): boolean {
    return (
      phase === 'shown' ||
      phase === 'waiting-to-hide' ||
      phase === 'hide-animating'
    );
  }
  function getInitialMouse(): FakeMouseElement | null {
    if (entry.source.type === 'mouse') {
      return entry.source.mouse;
    }
    return null;
  }

  function start() {
    const showImmediately: boolean = Boolean(active && active.isVisible());

    // If there was an active tooltip; we tell it to remove itself at once!
    if (active) {
      clearScheduled();
      active.entry.hide({ isImmediate: true });
      active.entry.done();
      active = null;
    }

    // this tooltip is now the active tooltip
    active = {
      entry,
      isVisible,
    };

    function show() {
      phase = 'shown';
      entry.show({ isImmediate: showImmediately });
    }

    if (showImmediately) {
      show();
      return;
    }

    phase = 'waiting-to-show';
    scheduleTimeout(show, entry.delay);
  }
  // let's get started!
  start();

  const result: API = {
    keep,
    abort: cleanup,
    isActive,
    requestHide,
    finishHideAnimation,
    getInitialMouse,
  };

  return result;
}
