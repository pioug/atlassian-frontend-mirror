import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
  ElementEventPayloadMap,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { DragLocation, Input } from '../../../../src/entry-point/types';
import { combine } from '../../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getDefaultInput,
  userEvent,
} from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

test('scenario: [A] -> [] -> cancel', () => {
  const [draggableEl, dropTarget] = getBubbleOrderedTree();
  const monitorOnGenerateDragPreview = jest.fn();
  const monitorOnDragStart = jest.fn();
  const monitorOnDrag = jest.fn();
  const monitorOnDropTargetChange = jest.fn();
  const monitorOnDrop = jest.fn();
  const dropTargetOnGenerateDragPreview = jest.fn();
  const dropTargetOnDragStart = jest.fn();
  const dropTargetOnDrag = jest.fn();
  const dropTargetOnDropTargetChange = jest.fn();
  const dropTargetOnDrop = jest.fn();
  const draggableOnGenerateDragPreview = jest.fn();
  const draggableOnDragStart = jest.fn();
  const draggableOnDrag = jest.fn();
  const draggableOnDropTargetChange = jest.fn();
  const draggableOnDrop = jest.fn();
  const draggableData = { name: 'Alex' };
  const getInitialData = () => draggableData;
  const dropTargetData = { type: 'Person' };
  const getData = () => dropTargetData;

  const firstInput: Input = {
    ...getDefaultInput(),
    pageX: 5,
  };
  const cleanup = combine(
    appendToBody(dropTarget),
    dropTargetForElements({
      element: dropTarget,
      getData,
      onGenerateDragPreview: dropTargetOnGenerateDragPreview,
      onDragStart: dropTargetOnDragStart,
      onDrag: dropTargetOnDrag,
      onDropTargetChange: dropTargetOnDropTargetChange,
      onDrop: dropTargetOnDrop,
    }),
    monitorForElements({
      onGenerateDragPreview: monitorOnGenerateDragPreview,
      onDragStart: monitorOnDragStart,
      onDrag: monitorOnDrag,
      onDropTargetChange: monitorOnDropTargetChange,
      onDrop: monitorOnDrop,
    }),
    draggable({
      element: draggableEl,
      getInitialData,
      onGenerateDragPreview: draggableOnGenerateDragPreview,
      onDragStart: draggableOnDragStart,
      onDrag: draggableOnDrag,
      onDropTargetChange: draggableOnDropTargetChange,
      onDrop: draggableOnDrop,
    }),
  );

  fireEvent.dragStart(draggableEl, firstInput);

  const initial: DragLocation = {
    input: firstInput,
    dropTargets: [
      {
        element: dropTarget,
        data: dropTargetData,
        sticky: false,
        dropEffect: 'move',
      },
    ],
  };

  {
    const expected: ElementEventPayloadMap['onGenerateDragPreview'] = {
      location: {
        initial,
        previous: {
          dropTargets: [],
        },
        current: initial,
      },
      source: {
        data: draggableData,
        dragHandle: null,
        element: draggableEl,
      },
      nativeSetDragImage: expect.any(Function),
    };
    expect(draggableOnGenerateDragPreview).toHaveBeenCalledWith(expected);
    expect(dropTargetOnGenerateDragPreview).toHaveBeenCalledWith({
      ...expected,
      self: initial.dropTargets[0],
    });
    expect(monitorOnGenerateDragPreview).toHaveBeenCalledWith(expected);
  }

  // @ts-ignore
  requestAnimationFrame.step();

  {
    const expected: ElementEventPayloadMap['onDragStart'] = {
      location: {
        initial,
        previous: {
          dropTargets: [],
        },
        current: initial,
      },
      source: {
        data: draggableData,
        dragHandle: null,
        element: draggableEl,
      },
    };
    expect(draggableOnDragStart).toHaveBeenCalledWith(expected);
    expect(dropTargetOnDragStart).toHaveBeenCalledWith({
      ...expected,
      self: initial.dropTargets[0],
    });
    expect(monitorOnDragStart).toHaveBeenCalledWith(expected);
  }

  const secondInput: Input = {
    ...firstInput,
    pageX: 10,
  };
  fireEvent.dragOver(dropTarget, secondInput);
  // not called until the next frame
  expect(draggableOnDrag).not.toHaveBeenCalled();
  expect(dropTargetOnDrag).not.toHaveBeenCalled();
  expect(monitorOnDrag).not.toHaveBeenCalled();
  // @ts-ignore
  requestAnimationFrame.step();

  {
    const expected: ElementEventPayloadMap['onDrag'] = {
      location: {
        initial,
        previous: {
          dropTargets: initial.dropTargets,
        },
        current: {
          dropTargets: initial.dropTargets,
          input: secondInput,
        },
      },
      source: {
        data: draggableData,
        dragHandle: null,
        element: draggableEl,
      },
    };
    expect(draggableOnDrag).toHaveBeenCalledWith(expected);
    expect(dropTargetOnDrag).toHaveBeenCalledWith({
      ...expected,
      self: initial.dropTargets[0],
    });
    expect(monitorOnDrag).toHaveBeenCalledWith(expected);
  }

  // Leaving A
  const thirdInput: Input = {
    ...secondInput,
    pageX: 15,
  };

  fireEvent.dragEnter(document.body, thirdInput);

  {
    const expected: ElementEventPayloadMap['onDropTargetChange'] = {
      location: {
        initial,
        previous: {
          dropTargets: initial.dropTargets,
        },
        current: {
          dropTargets: [],
          input: thirdInput,
        },
      },
      source: {
        data: draggableData,
        dragHandle: null,
        element: draggableEl,
      },
    };
    expect(draggableOnDropTargetChange).toHaveBeenCalledWith(expected);
    expect(dropTargetOnDropTargetChange).toHaveBeenCalledWith({
      ...expected,
      self: initial.dropTargets[0],
    });
    expect(monitorOnDropTargetChange).toHaveBeenCalledWith(expected);
  }

  userEvent.cancel();

  {
    const expected: ElementEventPayloadMap['onDrop'] = {
      location: {
        initial,
        // there are no 'current' drop targets,
        // so the 'cancel' is not considered another action
        previous: {
          dropTargets: initial.dropTargets,
        },
        current: {
          dropTargets: [],
          input: thirdInput,
        },
      },
      source: {
        data: draggableData,
        dragHandle: null,
        element: draggableEl,
      },
    };
    expect(draggableOnDrop).toHaveBeenCalledWith(expected);
    expect(monitorOnDrop).toHaveBeenCalledWith(expected);
    // not dropped on
    expect(dropTargetOnDrop).not.toHaveBeenCalled();
  }

  // validation
  expect(draggableOnGenerateDragPreview).toHaveBeenCalledTimes(1);
  expect(draggableOnDragStart).toHaveBeenCalledTimes(1);
  expect(draggableOnDrag).toHaveBeenCalledTimes(1);
  expect(draggableOnDropTargetChange).toHaveBeenCalledTimes(1);
  expect(draggableOnDrop).toHaveBeenCalledTimes(1);
  expect(dropTargetOnGenerateDragPreview).toHaveBeenCalledTimes(1);
  expect(dropTargetOnDragStart).toHaveBeenCalledTimes(1);
  expect(dropTargetOnDrag).toHaveBeenCalledTimes(1);
  expect(dropTargetOnDropTargetChange).toHaveBeenCalledTimes(1);
  // not dropped on
  expect(dropTargetOnDrop).toHaveBeenCalledTimes(0);
  expect(monitorOnGenerateDragPreview).toHaveBeenCalledTimes(1);
  expect(monitorOnDragStart).toHaveBeenCalledTimes(1);
  expect(monitorOnDrag).toHaveBeenCalledTimes(1);
  expect(monitorOnDropTargetChange).toHaveBeenCalledTimes(1);
  expect(monitorOnDrop).toHaveBeenCalledTimes(1);

  cleanup();
});
