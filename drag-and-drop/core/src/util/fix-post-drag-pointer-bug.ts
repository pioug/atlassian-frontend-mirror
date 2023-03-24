import { bindAll } from 'bind-event-listener';

import { DragLocationHistory } from '../internal-types';

import { combine } from './combine';

type CleanupFn = () => void;

/** Set a `style` property on a `HTMLElement`
 *
 * @returns a `cleanup` function to restore the `style` property to it's original state
 */
function setStyle<Property extends string & keyof CSSStyleDeclaration>(
  el: HTMLElement,
  {
    property,
    rule,
  }: { property: Property; rule: CSSStyleDeclaration[Property] },
): CleanupFn {
  const original = el.style[property];
  el.style[property] = rule;
  return function cleanup() {
    el.style[property] = original;
  };
}

function noop() {}

/**
 * Allow the user to continue to interact with what their cursor is over at the end of the drag.
 *
 * @description
 *
 * 1. Allow pointer events on the element under the users pointer
 * 2. Block pointer events for all children
 *      This is done as the element under the users pointer might
 *      contain elements that will incorrectly get browser selection
 *
 * @returns a `cleanup` function to restore all elements under the users pointer to their original state
 */
function fixUnderPointer(location: DragLocationHistory): CleanupFn {
  const underUsersPointer = document.elementFromPoint(
    location.current.input.clientX,
    location.current.input.clientY,
  );
  if (!(underUsersPointer instanceof HTMLElement)) {
    return noop;
  }

  // Disabling pointer events on all first level children
  // Equivalent of '> * { pointer-events: none; }', except we don't need
  // to insert / remove a style rule
  const unsetChildren: CleanupFn[] = Array.from(underUsersPointer.children).map(
    (child): CleanupFn => {
      if (!(child instanceof HTMLElement)) {
        return noop;
      }
      return setStyle(child, {
        property: 'pointerEvents',
        rule: 'none',
      });
    },
  );

  return combine(
    setStyle(underUsersPointer, {
      property: 'pointerEvents',
      rule: 'auto',
    }),
    ...unsetChildren,
  );
}

/** 🔥🤮 Fix (Chrome, Safari and Firefox) bug where the element under where the user started dragging
 * (on the viewport) is entered into by the browser after a drag finishes ("drop" or "dragend")
 *
 * @description
 *
 * Block pointer events on all elements except for the specific element that pointer is currently over
 *
 * Conceptually this is what we are doing (but without adding any new style rules to the page)
 * ```css
 * body { pointer-events: none; }
 * elementUnderPointer { pointer-events: auto; }
 * elementUnderPointer > * { pointer-events: none; }
 * ```
 *
 * - [Visual explanation of bug](https://twitter.com/alexandereardon/status/1633614212873465856)
 * - [Chrome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=410328)
 */
export function fixPostDragPointerBug(location: DragLocationHistory) {
  // Queuing a microtask to give any opportunity for frameworks to update their UI in a microtask
  // Note: react@18 does standard state updates in a microtask
  // We do this so our `atDestination` gets the _actual_ element that is under the users pointer
  // at the end of the drag.
  queueMicrotask(() => {
    // we need to get `atDestination` before turning off pointer events on the body,
    // or `document.elementFromPoint` will just return the `html` element (`document.documentElement`)

    // We are allowing pointer events on the element under the users cursor,
    // but _not_ on children of that element
    const unsetUnderPointer = fixUnderPointer(location);

    const unsetBodyStyles = setStyle(document.body, {
      property: 'pointerEvents',
      rule: 'none',
    });

    function cleanup() {
      unbindEvents();
      unsetBodyStyles();
      unsetUnderPointer();
    }

    const unbindEvents = bindAll(
      window,
      [
        { type: 'pointerdown', listener: cleanup },
        { type: 'pointermove', listener: cleanup },
        { type: 'focusin', listener: cleanup },
        { type: 'focusout', listener: cleanup },
        // a 'pointerdown' should happen before 'dragstart', but just being super safe
        { type: 'dragstart', listener: cleanup },
      ],
      {
        // Using `capture` is more likely to not be impacted by consumers stopping events
        capture: true,
      },
    );
  });
}
