import { fireEvent } from '@testing-library/dom';

import {
  CleanupFn,
  DragLocation,
  DragLocationHistory,
  DropTargetRecord,
  Input,
} from '../../src/entry-point/types';
// import { fireEvent } from '@testing-library/dom';

export function getDefaultInput(overrides: Partial<Input> = {}): Input {
  const defaults: Input = {
    // user input
    altKey: false,
    button: 0,
    buttons: 0,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,

    // coordinates
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
  };

  return {
    ...defaults,
    ...overrides,
  };
}

export function appendToBody(...elements: Element[]): CleanupFn {
  elements.forEach(element => {
    document.body.appendChild(element);
  });

  return function removeFromBody() {
    elements.forEach(element => {
      document.body.removeChild(element);
    });
  };
}

export function getEmptyHistory(
  input: Input = getDefaultInput(),
): DragLocationHistory {
  const noWhere: DragLocation = {
    input,
    dropTargets: [],
  };

  return {
    initial: noWhere,
    previous: {
      dropTargets: noWhere.dropTargets,
    },
    current: noWhere,
  };
}

export function getInitialHistory(
  dropTargets: DropTargetRecord[],
  input: Input = getDefaultInput(),
): DragLocationHistory {
  const location: DragLocation = {
    input,
    dropTargets,
  };

  return {
    initial: location,
    current: location,
    previous: {
      dropTargets: [],
    },
  };
}

export function setBoundingClientRect(
  el: HTMLElement,
  rect: DOMRect,
): CleanupFn {
  const original = el.getBoundingClientRect;

  el.getBoundingClientRect = () => rect;
  return () => {
    el.getBoundingClientRect = original;
  };
}

export function getRect(box: {
  top: number;
  bottom: number;
  left: number;
  right: number;
}): DOMRect {
  return {
    top: box.top,
    right: box.right,
    bottom: box.bottom,
    left: box.left,
    // calculated
    height: box.bottom - box.top,
    width: box.right - box.left,
    x: box.left,
    y: box.top,
    toJSON: function () {
      return JSON.stringify(this);
    },
  };
}

export function setElementFromPoint(el: Element | null): CleanupFn {
  const original = document.elementFromPoint;

  document.elementFromPoint = () => el;

  return () => {
    document.elementFromPoint = original;
  };
}
// usage: const [A, B, C, D, F] = getElements();
export function getElements(
  tagName: keyof HTMLElementTagNameMap = 'div',
): Iterable<HTMLElement> {
  const iterator = {
    next() {
      return {
        done: false,
        value: document.createElement(tagName),
      };
    },
    [Symbol.iterator]() {
      return iterator;
    },
  };
  return iterator;
}

/**
 * Returns a connected tree of elements
 * `[grandChild, parent, grandParent]`
 */
export function getBubbleOrderedTree(
  tagName: keyof HTMLElementTagNameMap = 'div',
): Iterable<HTMLElement> {
  let last: HTMLElement | null;
  const iterator = {
    next() {
      const element = document.createElement(tagName);

      if (last) {
        element.appendChild(last);
      }
      last = element;

      return {
        done: false,
        value: element,
      };
    },
    [Symbol.iterator]() {
      return iterator;
    },
  };
  return iterator;
}

export const userEvent = {
  lift(target: HTMLElement, input?: Input) {
    // will fire `onGenerateDragPreview`
    fireEvent.dragStart(target, input);

    // after an animation frame we fire `onDragStart`
    // @ts-ignore
    requestAnimationFrame.step();
  },
  drop(target: Element) {
    fireEvent.drop(target);
  },
  cancel(target: Element = document.body) {
    fireEvent.dragEnd(target);
  },
  leaveWindow() {
    fireEvent.dragLeave(document.documentElement, { relatedTarget: null });
  },
  startExternalDrag({
    types,
    target = document.body,
  }: {
    types: string[];
    target?: Element;
  }) {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    for (const type of types) {
      // @ts-expect-error
      event.dataTransfer?.types.push(type);
    }
    target.dispatchEvent(event);
    // @ts-expect-error
    requestAnimationFrame.step();
  },
  rougePointerMoves() {
    // first 20 are ignored due to firefox issue
    // 21st pointermove will cancel a drag
    for (let i = 0; i < 21; i++) {
      fireEvent.pointerMove(document.body);
    }
  },
  // dragOver(target: Element) {
  //   fireEvent.dragOver(target);
  //   // we schedule "drag" updates in an animation frame
  //   // @ts-ignore
  //   requestAnimationFrame.step();
  // },
  // drag() {
  //   fireEvent.dragLeave(target: Element);
  //   // after an animation frame we fire `onDragStart`
  //   // @ts-ignore
  //   requestAnimationFrame.step();
  // }
};
