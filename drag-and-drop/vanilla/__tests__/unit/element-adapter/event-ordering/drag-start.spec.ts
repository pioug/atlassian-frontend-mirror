import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, getBubbleOrderedTree } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

test('should notify the source draggable, drop targets in bubble order, then monitors in bind order', () => {
  const [draggableEl, child, parent] = getBubbleOrderedTree();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(parent),
    monitorForElements({
      onDragStart: () => ordered.push('monitor1'),
    }),
    dropTargetForElements({
      element: parent,
      onDragStart: () => ordered.push('parent:start'),
    }),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable'),
    }),
    dropTargetForElements({
      element: child,
      onDragStart: () => ordered.push('child:start'),
    }),
    monitorForElements({
      onDragStart: () => ordered.push('monitor2'),
    }),
  );

  fireEvent.dragStart(draggableEl);

  // dragStart fires after an animation frame
  expect(ordered).toEqual([]);

  // @ts-ignore
  requestAnimationFrame.step();

  expect(ordered).toEqual([
    // draggable source
    'draggable',
    // bubble ordered drop targets
    'child:start',
    'parent:start',
    // monitors ordered in bind order
    'monitor1',
    'monitor2',
  ]);

  cleanup();
});
