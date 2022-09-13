import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getElements,
  userEvent,
} from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

test('scenario: [] (lifting outside a drop target)', () => {
  const [draggableEl] = getElements();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['draggable:start']);

  cleanup();
});

test('scenario: [B, A] (lifting inside drop targets)', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
    }),
    dropTargetForElements({
      element: A,
      onDragStart: () => ordered.push('a:start'),
    }),
    dropTargetForElements({
      element: B,
      onDragStart: () => ordered.push('b:start'),
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);

  cleanup();
});
