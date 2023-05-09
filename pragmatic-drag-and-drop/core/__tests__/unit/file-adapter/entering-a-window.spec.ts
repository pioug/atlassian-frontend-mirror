import {
  dropTargetForFiles,
  FileEventPayloadMap,
  monitorForFiles,
} from '../../../src/entry-point/adapter/file';
import { combine } from '../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getEmptyHistory,
  reset,
  userEvent,
} from '../_util';

afterEach(reset);

test('enter-window[body] => []', () => {
  const [A] = getBubbleOrderedTree();
  const monitorOnDragStart = jest.fn();
  const cleanup = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
    monitorForFiles({
      onDragStart: monitorOnDragStart,
    }),
  );

  userEvent.startExternalDrag({ types: [] });

  expect(monitorOnDragStart).toHaveBeenCalledTimes(0);

  // Entering the window with files will start a drag
  userEvent.startExternalDrag({ types: ['Files'] });

  expect(monitorOnDragStart).toHaveBeenCalledTimes(1);
  const expected: FileEventPayloadMap['onDragStart'] = {
    // not starting in any drop target
    location: getEmptyHistory(),
    source: {
      items: null,
    },
  };
  expect(monitorOnDragStart).toHaveBeenCalledWith(expected);

  cleanup();
});

test('enter-window[A] => []', () => {
  const [A] = getBubbleOrderedTree();
  const monitorOnDragStart = jest.fn();
  const cleanup = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
    monitorForFiles({
      onDragStart: monitorOnDragStart,
    }),
  );

  // First enter event is into A
  userEvent.startExternalDrag({ types: ['Files'], target: A });

  expect(monitorOnDragStart).toHaveBeenCalledTimes(1);
  const expected: FileEventPayloadMap['onDragStart'] = {
    // not starting in any drop target even though we entered
    // the window straight into A
    location: getEmptyHistory(),
    source: {
      items: null,
    },
  };
  expect(monitorOnDragStart).toHaveBeenCalledWith(expected);

  cleanup();
});
