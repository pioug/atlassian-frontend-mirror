import {
  dropTargetForFiles,
  FileDropTargetEventPayloadMap,
  FileEventPayloadMap,
  monitorForFiles,
} from '../../../src/entry-point/adapter/file';
import {
  DragLocationHistory,
  DropTargetRecord,
} from '../../../src/entry-point/types';
import { combine } from '../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getDefaultInput,
  getEmptyHistory,
  reset,
} from '../_util';

afterEach(reset);

it('should expose files (items) only during the drop event', () => {
  const [A] = getBubbleOrderedTree();
  const monitorOnDragStart = jest.fn();
  const dropTargetOnDragEnter = jest.fn();
  const dropTargetOnDrag = jest.fn();
  const dropTargetOnDrop = jest.fn();
  const cleanup = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
      onDragEnter: dropTargetOnDragEnter,
      onDrag: dropTargetOnDrag,
      onDrop: dropTargetOnDrop,
    }),
    monitorForFiles({
      onDragStart: monitorOnDragStart,
    }),
  );
  const self: DropTargetRecord = {
    data: {},
    dropEffect: 'copy',
    element: A,
    isActiveDueToStickiness: false,
  };

  {
    const enterWindow = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    // @ts-expect-error
    enterWindow.dataTransfer?.types.push('Files');
    enterWindow.dataTransfer?.items.add(
      new File(['🕺💃'], 'dance.png', { type: 'image/png' }),
    );
    window.dispatchEvent(enterWindow);
    // @ts-expect-error
    requestAnimationFrame.step();

    const expected: FileEventPayloadMap['onDragStart'] = {
      location: getEmptyHistory(),
      // items are null until the drop
      source: {
        items: null,
      },
    };
    expect(monitorOnDragStart).toHaveBeenCalledWith(expected);
  }

  // Entering into A
  {
    const enterA = new DragEvent('dragenter', {
      cancelable: true,
      bubbles: true,
    });
    // @ts-expect-error
    enterA.dataTransfer?.types.push('Files');
    enterA.dataTransfer?.items.add(
      new File(['🕺💃'], 'dance.png', { type: 'image/png' }),
    );
    A.dispatchEvent(enterA);

    const location: DragLocationHistory = {
      ...getEmptyHistory(),
      current: {
        input: getDefaultInput(),
        dropTargets: [self],
      },
    };
    const expected: FileDropTargetEventPayloadMap['onDragEnter'] = {
      location,
      self,
      // items are null until the drop
      source: {
        items: null,
      },
    };
    expect(dropTargetOnDragEnter).toHaveBeenCalledWith(expected);
  }

  // Dragging over A
  {
    const overA = new DragEvent('dragover', {
      cancelable: true,
      bubbles: true,
    });
    // @ts-expect-error
    overA.dataTransfer?.types.push('Files');
    overA.dataTransfer?.items.add(
      new File(['🕺💃'], 'dance.png', { type: 'image/png' }),
    );
    A.dispatchEvent(overA);

    // drags are scheduled in the next animation frame
    expect(dropTargetOnDrag).not.toHaveBeenCalled();

    // @ts-expect-error
    requestAnimationFrame.step();

    const location: DragLocationHistory = {
      ...getEmptyHistory(),
      previous: {
        dropTargets: [self],
      },
      current: {
        input: getDefaultInput(),
        dropTargets: [self],
      },
    };
    const expected: FileDropTargetEventPayloadMap['onDrag'] = {
      location,
      self,
      // items are null until the drop
      source: {
        items: null,
      },
    };
    expect(dropTargetOnDrag).toHaveBeenCalledWith(expected);
  }

  // Dropping on A
  {
    const file = new File(['🕺💃'], 'another-dance.png', { type: 'image/png' });
    const dropOnA = new DragEvent('drop', {
      cancelable: true,
      bubbles: true,
    });
    const items = dropOnA.dataTransfer?.items;
    // @ts-expect-error
    dropOnA.dataTransfer?.types.push('Files');
    items?.add(file);
    A.dispatchEvent(dropOnA);

    // @ts-expect-error
    requestAnimationFrame.step();

    const location: DragLocationHistory = {
      ...getEmptyHistory(),
      previous: {
        dropTargets: [self],
      },
      current: {
        input: getDefaultInput(),
        dropTargets: [self],
      },
    };
    const expected: FileDropTargetEventPayloadMap['onDrop'] = {
      location,
      self,
      // items are null until the drop
      source: {
        items: expect.any(Object),
      },
    };
    expect(dropTargetOnDrop).toHaveBeenCalledWith(expected);
    const providedItems = dropTargetOnDrop.mock.calls[0][0].source.items;
    expect(providedItems.length).toBe(1);
    // checking we got the reference to the latest `items`
    // (we need to ensure`items` is recollected in the drop)
    expect(providedItems).toBe(items);
    expect(providedItems[0].getAsFile()).toBe(file);
  }

  cleanup();
});

it('should filter out items that are not files', () => {
  const [A] = getBubbleOrderedTree();
  const monitorOnDragStart = jest.fn();
  const dropTargetOnDrop = jest.fn();
  const cleanup = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
      onDrop: dropTargetOnDrop,
    }),
    monitorForFiles({
      onDragStart: monitorOnDragStart,
    }),
  );
  const file = new File(['🕺💃'], 'dance.png', { type: 'image/png' });

  const enterWindow = new DragEvent('dragenter', {
    cancelable: true,
    bubbles: true,
  });
  // @ts-expect-error
  enterWindow.dataTransfer?.types.push('Files');
  window.dispatchEvent(enterWindow);
  // @ts-expect-error
  requestAnimationFrame.step();

  expect(monitorOnDragStart).toHaveBeenCalledTimes(1);

  // Entering into A
  const enterA = new DragEvent('dragenter', {
    cancelable: true,
    bubbles: true,
  });
  A.dispatchEvent(enterA);

  // Dropping on A
  const dropOnA = new DragEvent('drop', {
    cancelable: true,
    bubbles: true,
  });
  // @ts-expect-error
  dropOnA.dataTransfer?.types.push('Files');
  dropOnA.dataTransfer?.items.add(file);
  dropOnA.dataTransfer?.items.add('<h1>hi</h1>', 'text/html');
  // two items in the data transfer
  expect(dropOnA.dataTransfer?.items.length).toBe(2);

  A.dispatchEvent(dropOnA);

  // items given to consumer has had non-files stripped out
  expect(dropTargetOnDrop).toHaveBeenCalledTimes(1);
  const items = dropTargetOnDrop.mock.calls[0][0].source.items;
  expect(items.length).toBe(1);
  expect(items[0].getAsFile()).toEqual(file);

  cleanup();
});
