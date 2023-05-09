// Note: not using '@testing-library/dom' in this file as it can
// add it's own "error" event listeners when other events are being fired
// This file uses vanilla event firing so that we are in total control

import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getElements } from '../_util';

let addEventListener = jest.spyOn(window, 'addEventListener');
let removeEventListener = jest.spyOn(window, 'removeEventListener');

jest.resetModules();

afterEach(() => {
  addEventListener.mockClear();
  removeEventListener.mockClear();
  jest.resetModules();
});

afterEach(async () => {
  // cleanup any pending drags
  window.dispatchEvent(
    new DragEvent('dragend', { cancelable: true, bubbles: true }),
  );

  // Flushing postDropBugFix
  await 'microtask';
  window.dispatchEvent(new Event('pointerdown'));
});

it('should add event listeners when the first draggable is mounted', () => {
  expect(addEventListener).not.toHaveBeenCalled();
  const { draggable } = require('../../../src/entry-point/adapter/element');

  const [A] = getElements();
  const unbind = combine(
    appendToBody(A),
    draggable({
      element: A,
    }),
  );

  // initial listener
  expect(addEventListener).toHaveBeenCalledTimes(1);
  unbind();
});

it('should not add event listeners when multiple draggables are mounted', () => {
  expect(addEventListener).not.toHaveBeenCalled();
  const { draggable } = require('../../../src/entry-point/adapter/element');

  const [A, B] = getElements();
  const unbind = combine(
    draggable({
      element: A,
    }),
    draggable({
      element: B,
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  unbind();
});

it('should not add event listeners when only a drop target is mounted', () => {
  const {
    dropTargetForElements,
  } = require('../../../src/entry-point/adapter/element');

  const [el] = getElements();
  const unbind = combine(
    appendToBody(el),
    dropTargetForElements({
      element: el,
    }),
  );

  expect(addEventListener).not.toHaveBeenCalled();
  unbind();
});

it('should remove initiating event listener when an only draggable is removed', () => {
  const { draggable } = require('../../../src/entry-point/adapter/element');

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    draggable({
      element: A,
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // nothing removed yet
  expect(removeEventListener).not.toHaveBeenCalled();

  unbindA();

  expect(removeEventListener).toHaveBeenCalledTimes(1);
});

it('should remove initiating event listener when the last draggable is removed', () => {
  const { draggable } = require('../../../src/entry-point/adapter/element');

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A, B] = getElements();
  const unbindA = combine(
    appendToBody(A),
    draggable({
      element: A,
    }),
  );
  const unbindB = combine(
    appendToBody(B),
    draggable({
      element: B,
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // nothing removed yet
  expect(removeEventListener).not.toHaveBeenCalled();

  unbindA();

  // not removed yet
  expect(removeEventListener).not.toHaveBeenCalled();

  unbindB();

  expect(removeEventListener).toHaveBeenCalledTimes(1);
});

it('should bind event listeners needed for the drag only while dragging (drag cancelled)', () => {
  const { draggable } = require('../../../src/entry-point/adapter/element');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('preview'),
      onDragStart: () => ordered.push('start'),
      onDrop: () => ordered.push('drop'),
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  A.dispatchEvent(
    new DragEvent('dragstart', { cancelable: true, bubbles: true }),
  );
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['preview', 'start']);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const postLiftAddEventListenerCount = addEventListener.mock.calls.length - 1;
  expect(postLiftAddEventListenerCount).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // finish the drag
  // cleanup any pending drags
  window.dispatchEvent(
    new DragEvent('dragend', { cancelable: true, bubbles: true }),
  );

  expect(ordered).toEqual(['drop']);

  // all new event listeners have been removed
  expect(removeEventListener).toHaveBeenCalledTimes(
    postLiftAddEventListenerCount,
  );
  // no more event listeners added
  expect(addEventListener).toHaveBeenCalledTimes(
    postLiftAddEventListenerCount + 1,
  );

  unbindA();
});

it('should bind event listeners needed for the drag only while dragging (successful drop)', () => {
  const { draggable } = require('../../../src/entry-point/adapter/element');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('preview'),
      onDragStart: () => ordered.push('start'),
      onDrop: () => ordered.push('drop'),
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  A.dispatchEvent(
    new DragEvent('dragstart', { cancelable: true, bubbles: true }),
  );
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['preview', 'start']);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const postLiftAddEventListenerCount = addEventListener.mock.calls.length - 1;
  expect(postLiftAddEventListenerCount).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // finish the drag
  // cleanup any pending drags
  A.dispatchEvent(new DragEvent('drop', { cancelable: true, bubbles: true }));

  expect(ordered).toEqual(['drop']);

  // all new event listeners have been removed
  expect(removeEventListener).toHaveBeenCalledTimes(
    postLiftAddEventListenerCount,
  );
  // no more event listeners added
  expect(addEventListener).toHaveBeenCalledTimes(
    postLiftAddEventListenerCount + 1,
  );

  unbindA();
});

it('should keep dragging event listeners bound even if only draggable is removed mid drag', () => {
  const {
    draggable,
    monitorForElements,
  } = require('../../../src/entry-point/adapter/element');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('draggable:preview'),
      onDragStart: () => ordered.push('draggable:start'),
      onDrop: () => ordered.push('draggable:drop'),
    }),
  );
  const unbindMonitor = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  A.dispatchEvent(
    new DragEvent('dragstart', { cancelable: true, bubbles: true }),
  );
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual([
    'draggable:preview',
    'monitor:preview',
    'draggable:start',
    'monitor:start',
  ]);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const postLiftAddEventListenerCount = addEventListener.mock.calls.length - 1;
  expect(postLiftAddEventListenerCount).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // unbinding the only draggable mid drag
  unbindA();
  // "dragstart" event listener removed, but other event listeners for the drag are still active
  expect(removeEventListener).toHaveBeenCalledTimes(1);

  // finish the drag
  window.dispatchEvent(
    new DragEvent('dragend', { cancelable: true, bubbles: true }),
  );

  // monitor still told about the drop
  expect(ordered).toEqual(['monitor:drop']);

  // all event listeners removed (including initiating event listener)
  expect(removeEventListener).toHaveBeenCalledTimes(
    postLiftAddEventListenerCount + 1,
  );

  unbindMonitor();
});

it('should keep dragging event listeners bound if only draggable is remounted mid drag', () => {
  const {
    draggable,
    monitorForElements,
  } = require('../../../src/entry-point/adapter/element');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA1 = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('draggable(1):preview'),
      onDragStart: () => ordered.push('draggable(1):start'),
      onDrop: () => ordered.push('draggable(1):drop'),
    }),
  );
  const unbindMonitor = monitorForElements({
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
    onDragStart: () => ordered.push('monitor:start'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  A.dispatchEvent(
    new DragEvent('dragstart', { cancelable: true, bubbles: true }),
  );
  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual([
    'draggable(1):preview',
    'monitor:preview',
    'draggable(1):start',
    'monitor:start',
  ]);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const eventListenersAddedForDragging = addEventListener.mock.calls.length - 1;
  expect(eventListenersAddedForDragging).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // unbinding the only draggable mid drag
  unbindA1();
  // "dragstart" event listener removed, but other event listeners for the drag are still active
  expect(removeEventListener).toHaveBeenCalledTimes(1);

  const unbindA2 = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('draggable(2):preview'),
      onDragStart: () => ordered.push('draggable(2):start'),
      onDrop: () => ordered.push('draggable(2):drop'),
    }),
  );

  // finish the drag
  window.dispatchEvent(
    new DragEvent('dragend', { cancelable: true, bubbles: true }),
  );

  // because 'A' is the key, A2 is treated as the original draggable
  expect(ordered).toEqual(['draggable(2):drop', 'monitor:drop']);

  // all event listeners removed (including initiating event listener)
  expect(removeEventListener).toHaveBeenCalledTimes(
    eventListenersAddedForDragging + 1,
  );
  // a new "dragstart" listener has been added to start listening for drags again
  expect(addEventListener).toHaveBeenCalledTimes(
    eventListenersAddedForDragging + 2,
  );

  unbindMonitor();
  unbindA2();
});
