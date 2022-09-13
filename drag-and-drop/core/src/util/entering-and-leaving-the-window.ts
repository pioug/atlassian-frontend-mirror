import { bindAll } from 'bind-event-listener';

// *Usually* to detect if you are entering / leaving a window you can
// use the `event.relatedTarget` property:

// "dragenter":
// - `event.relatedTarget` should point to the element that you are coming from
//   - Scenario: A -> B
//   - `event.target`: `B` (entering B)
//   - `event.relatedTarget`: `A`: (leaving A - where you are coming from)
// - if `event.relatedTarget` is `null` then you are entering the window (coming from `null`)
//
// "dragleave"
// - `event.relatedTarget` should point to the element you are going to
//   - Scenario: A -> B (entered B, leaving A)
//   - `event.target`: `A` (leaving A)
//   - `event.relatedTarget`: `B`: (entering into B - where you are going to)
// - if `event.relatedTarget` is `null` then you are leaving the window (going to `null`)
//
// Unfortunately in Safari `event.relatedTarget` is *always* set to `null`
// Safari bug: https://bugs.webkit.org/show_bug.cgi?id=242627
// To work around this we count "dragenter" and "dragleave" events
const safariFix = {
  isSafari: false,
  // Using symbols for event properties so we don't clash with
  // anything on the `event` object
  leavingWindow: Symbol('leaving'),
  enteringWindow: Symbol('entering'),
};

export function isEnteringWindow({
  dragEnter,
}: {
  dragEnter: DragEvent;
}): boolean {
  if (dragEnter.type !== 'dragenter') {
    return false;
  }
  if (safariFix.isSafari) {
    return dragEnter.hasOwnProperty(safariFix.enteringWindow);
  }
  // This is the standard check.
  // if `relatedTarget` is `null` during a "dragenter"
  // then we are entering the`window`
  return dragEnter.relatedTarget == null;
}

export function isLeavingWindow({
  dragLeave,
}: {
  dragLeave: DragEvent;
}): boolean {
  if (dragLeave.type !== 'dragleave') {
    return false;
  }
  if (safariFix.isSafari) {
    return dragLeave.hasOwnProperty(safariFix.leavingWindow);
  }
  // This is the standard check.
  // if `relatedTarget` is `null` during a "dragleave"
  // then we are leave the `window`
  return dragLeave.relatedTarget == null;
}

// NOTE: this fix currently has no test coverage
// - our drag and drop browser tests currently only run in Chrome due to tooling limitations
// - it didn't feel helpful to unit test as it is merely replicating a bug

(function fixSafari() {
  // Don't do anything when server side rendering
  if (typeof window === 'undefined') {
    return;
  }

  // rather than checking the userAgent for "jsdom" we can do this check
  // so that the check will be removed completely in production code
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  const { userAgent } = navigator;

  const isSafari: boolean =
    userAgent.includes('AppleWebKit') && !userAgent.includes('Chrome');

  if (!isSafari) {
    return;
  }

  safariFix.isSafari = true;

  type State = {
    enterCount: number;
    isOverWindow: boolean;
  };

  function getInitialState(): State {
    return {
      enterCount: 0,
      isOverWindow: false,
    };
  }

  let state: State = getInitialState();

  function resetState() {
    state = getInitialState();
  }

  // These event listeners are bound _forever_ and _never_ removed
  // We don't bother cleaning up these event listeners (for now)
  // as this workaround is only for Safari

  // This is how the event count works:
  //
  // lift (+1 enterCount)
  // - dragstart(draggable) [enterCount: 0]
  // - dragenter(draggable) [enterCount: 1]
  // leaving draggable (+0 enterCount)
  // - dragenter(document.body) [enterCount: 2]
  // - dragleave(draggable) [enterCount: 1]
  // leaving window (-1 enterCount)
  // - dragleave(document.body) [enterCount: 0] {leaving the window}

  // Things to note:
  // - dragenter and dragleave bubble
  // - the first dragenter when entering a window might not be on `window`
  //   - it could be on an element that is pressed up against the window
  //   - (so we cannot rely on `event.target` values)

  bindAll(
    window,
    [
      {
        type: 'dragstart',
        listener: () => {
          state.enterCount = 0;
          // drag start occurs in the source window
          state.isOverWindow = true;

          // When a drag first starts it will also trigger a "dragenter" on the draggable element
        },
      },
      {
        type: 'drop',
        listener: resetState,
      },
      {
        type: 'dragend',
        listener: resetState,
      },
      {
        type: 'dragenter',
        listener: (event: DragEvent) => {
          if (!state.isOverWindow && state.enterCount === 0) {
            // Patching the `event` object
            // The `event` object is shared with all event listeners for the event
            // @ts-ignore
            event[safariFix.enteringWindow] = true;
          }
          state.isOverWindow = true;
          state.enterCount++;
        },
      },
      {
        type: 'dragleave',
        listener: event => {
          state.enterCount--;
          if (state.isOverWindow && state.enterCount === 0) {
            // Patching the `event` object as it is shared with all event listeners
            // The `event` object is shared with all event listeners for the event
            // @ts-ignore
            event[safariFix.leavingWindow] = true;
            state.isOverWindow = false;
          }
        },
      },
    ],
    // using `capture: true` so that adding event listeners
    // in bubble phase will have the correct symbols
    { capture: true },
  );
})();
