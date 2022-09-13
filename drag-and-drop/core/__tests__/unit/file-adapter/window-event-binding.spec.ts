// Note: not using '@testing-library/dom' in this file as it can
// add it's own "error" event listeners when other events are being fired
// This file uses vanilla event firing so that we are in total control

import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getElements, userEvent } from '../_util';

let addEventListener = jest.spyOn(window, 'addEventListener');
let removeEventListener = jest.spyOn(window, 'removeEventListener');

jest.resetModules();

afterEach(() => {
  addEventListener.mockClear();
  removeEventListener.mockClear();
  jest.resetModules();
});

afterEach(() => {
  // cleanup any pending drags
  window.dispatchEvent(
    new DragEvent('dragend', { cancelable: true, bubbles: true }),
  );
});

it('should add event listeners when the first drop target is mounted', () => {
  expect(addEventListener).not.toHaveBeenCalled();
  const {
    dropTargetForFiles,
  } = require('../../../src/entry-point/adapter/file');

  const [A] = getElements();
  const unbind = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
  );

  // initial listener
  expect(addEventListener).toHaveBeenCalledTimes(1);
  unbind();
});

it('should not add event listeners when multiple drop targets are mounted', () => {
  expect(addEventListener).not.toHaveBeenCalled();
  const {
    dropTargetForFiles,
  } = require('../../../src/entry-point/adapter/file');

  const [A, B] = getElements();
  const unbind = combine(
    dropTargetForFiles({
      element: A,
    }),
    dropTargetForFiles({
      element: B,
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  unbind();
});

it('should not add event listeners when only a monitor is mounted', () => {
  const { monitorForFiles } = require('../../../src/entry-point/adapter/file');

  const unbind = combine(monitorForFiles({}));

  expect(addEventListener).not.toHaveBeenCalled();
  unbind();
});

it('should remove initiating event listener when an only drop target is removed', () => {
  const {
    dropTargetForFiles,
  } = require('../../../src/entry-point/adapter/file');

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // nothing removed yet
  expect(removeEventListener).not.toHaveBeenCalled();

  unbindA();

  expect(removeEventListener).toHaveBeenCalledTimes(1);
});

it('should remove initiating event listener when the last drop target is removed', () => {
  const {
    dropTargetForFiles,
  } = require('../../../src/entry-point/adapter/file');

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A, B] = getElements();
  const unbindA = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
  );
  const unbindB = combine(
    appendToBody(B),
    dropTargetForFiles({
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

it('should bind event listeners needed for the drag only while dragging', () => {
  const {
    dropTargetForFiles,
    monitorForFiles,
  } = require('../../../src/entry-point/adapter/file');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
    monitorForFiles({
      onDragStart: () => ordered.push('start'),
      onDrop: () => ordered.push('drop'),
    }),
  );

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  userEvent.startExternalDrag({ types: ['Files'] });
  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const postLiftAddEventListenerCount = addEventListener.mock.calls.length - 1;
  expect(postLiftAddEventListenerCount).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // finish the drag
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

it('should keep dragging event listeners bound even if only drop target is removed mid drag', () => {
  const {
    dropTargetForFiles,
    monitorForFiles,
  } = require('../../../src/entry-point/adapter/file');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
      onDrop: () => ordered.push('draggable:drop'),
    }),
  );
  const unbindMonitor = monitorForFiles({
    onDragStart: () => ordered.push('monitor:start'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  userEvent.startExternalDrag({ types: ['Files'] });
  expect(ordered).toEqual(['monitor:start']);
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

it('should keep dragging event listeners bound if only drop  is remounted mid drag', () => {
  const {
    dropTargetForFiles,
    monitorForFiles,
  } = require('../../../src/entry-point/adapter/file');
  const ordered: string[] = [];

  // no event listeners added or removed yet
  expect(addEventListener).not.toHaveBeenCalled();
  expect(removeEventListener).not.toHaveBeenCalled();

  const [A] = getElements();
  const unbindA1 = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
      onDropTargetChange: () => ordered.push('a(1):change'),
      onDrop: () => ordered.push('a(1):drop'),
    }),
  );
  const unbindMonitor = monitorForFiles({
    onDragStart: () => ordered.push('monitor:start'),
    onDrop: () => ordered.push('monitor:drop'),
  });

  expect(addEventListener).toHaveBeenCalledTimes(1);
  // Note: Cannot reset the mock. It causes internal reference mismatches
  // addEventListener.mockReset();

  // let's start a drag
  userEvent.startExternalDrag({ types: ['Files'] });
  expect(ordered).toEqual(['monitor:start']);
  ordered.length = 0;

  // we expect that *new* event listeners have been added for the duration of a the drag
  const eventListenersAddedForDragging = addEventListener.mock.calls.length - 1;
  expect(eventListenersAddedForDragging).toBeGreaterThan(0);
  expect(removeEventListener).not.toHaveBeenCalled();

  // entering into A
  A.dispatchEvent(
    new DragEvent('dragenter', { cancelable: true, bubbles: true }),
  );
  expect(ordered).toEqual(['a(1):change']);
  ordered.length = 0;

  // unbinding the only drop target mid drag
  unbindA1();
  // "dragenter" event listener removed, but other event listeners for the drag are still active
  expect(removeEventListener).toHaveBeenCalledTimes(1);

  const unbindA2 = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
      onDropTargetChange: () => ordered.push('a(2):change'),
      onDrop: () => ordered.push('a(2):drop'),
    }),
  );

  // drop on A
  A.dispatchEvent(new DragEvent('drop', { cancelable: true, bubbles: true }));

  // because 'A' is the key, A2 is treated as the original drop target
  expect(ordered).toEqual(['a(2):drop', 'monitor:drop']);

  // all event listeners removed (including initiating event listener)
  expect(removeEventListener).toHaveBeenCalledTimes(
    eventListenersAddedForDragging + 1,
  );
  // a new "dragenter" listener has been added to start listening for drags again
  expect(addEventListener).toHaveBeenCalledTimes(
    eventListenersAddedForDragging + 2,
  );

  unbindMonitor();
  unbindA2();
});
