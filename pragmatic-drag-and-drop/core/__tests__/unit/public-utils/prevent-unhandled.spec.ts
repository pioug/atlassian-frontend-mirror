import { fireEvent } from '@testing-library/dom';

import { combine } from '../../../src/entry-point/combine';
import {
  draggable,
  dropTargetForElements,
} from '../../../src/entry-point/element/adapter';
import { preventUnhandled } from '../../../src/entry-point/prevent-unhandled';
import { appendToBody, getElements, reset, userEvent } from '../_util';

afterEach(reset);

it('should work with explicit cancels', () => {
  const [draggableEl] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];

  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({
      element: draggableEl,
      onDragStart() {
        ordered.push('start');
      },
      onDrop({ drop }) {
        ordered.push('drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  userEvent.cancel(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  cleanup();
});

it('should accept drops, even when over no drop targets', () => {
  const [draggableEl, sibling] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];

  const cleanup = combine(
    appendToBody(draggableEl, sibling),
    draggable({
      element: draggableEl,
      onDragStart() {
        ordered.push('start');
        preventUnhandled.start();
      },
      onDrop({ drop }) {
        ordered.push('drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // cancelling "dragenter" and "dragover" result in a drop being accepted.
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }

  userEvent.drop(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  cleanup();
});

it('should not override the drop effect of a drop target', () => {
  const [A] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart() {
        ordered.push('draggable:start');
        preventUnhandled.start();
      },
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);
  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  userEvent.drop(A);
  expect(ordered).toEqual(['draggable:drop', 'dropTarget:drop']);

  // not being set to "none" or "move"
  expect(dropEffect).toEqual(['link']);

  cleanup();
});

it('should only apply to a single drag operation', () => {
  const [draggableEl, sibling] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];
  let isEnabled: boolean = true;

  const cleanup = combine(
    appendToBody(draggableEl, sibling),
    draggable({
      element: draggableEl,
      onDragStart() {
        ordered.push('start');
        if (isEnabled) {
          preventUnhandled.start();
        }
      },
      onDrop({ drop }) {
        ordered.push('drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // cancelling "dragenter" and "dragover" result in a drop being accepted.
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }

  userEvent.drop(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  ordered.length = 0;
  dropEffect.length = 0;

  // doing another drag
  isEnabled = false;

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // "dragenter" and "dragover" no longer cancelled
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }

  // a "drop" event won't fire
  fireEvent.dragEnd(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  cleanup();
});

it('should be able to be disabled and enabled during a drag', () => {
  const [draggableEl, siblingA, siblingB] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];

  const cleanup = combine(
    appendToBody(draggableEl, siblingA, siblingB),
    draggable({
      element: draggableEl,
      onDragStart() {
        ordered.push('start');
        preventUnhandled.start();
      },
      onDrop({ drop }) {
        ordered.push('drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // cancelling "dragenter" and "dragover" result in a drop being accepted.
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    siblingA.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    siblingA.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }

  preventUnhandled.stop();

  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    siblingB.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    siblingB.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }

  preventUnhandled.start();

  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    siblingA.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    siblingA.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }

  fireEvent.dragEnd(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  cleanup();
});

it('should stop not block a future drag operation if a drag operation was aborted', () => {
  const [draggableEl, sibling] = getElements('div');
  const ordered: string[] = [];
  const dropEffect: DataTransfer['dropEffect'][] = [];
  let isEnabled: boolean = true;

  const cleanup = combine(
    appendToBody(draggableEl, sibling),
    draggable({
      element: draggableEl,
      onDragStart() {
        ordered.push('start');
        if (isEnabled) {
          preventUnhandled.start();
        }
      },
      onDrop({ drop }) {
        ordered.push('drop');
        dropEffect.push(drop.dropEffect);
      },
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // cancelling "dragenter" and "dragover" result in a drop being accepted.
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(event.dataTransfer?.dropEffect).toBe('move');
  }

  // breaking a drag operation
  userEvent.rougePointerMoves();

  expect(ordered).toEqual(['drop']);
  // broken drags result in a "none"
  expect(dropEffect).toEqual(['none']);

  ordered.length = 0;
  dropEffect.length = 0;

  // doing another drag
  isEnabled = false;

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // "dragenter" and "dragover" no longer cancelled
  {
    const event = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }
  {
    const event = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    sibling.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(event.dataTransfer?.dropEffect).toBe('none');
  }

  // a "drop" event won't fire
  fireEvent.dragEnd(draggableEl);

  expect(ordered).toEqual(['drop']);
  expect(dropEffect).toEqual(['none']);

  cleanup();
});
