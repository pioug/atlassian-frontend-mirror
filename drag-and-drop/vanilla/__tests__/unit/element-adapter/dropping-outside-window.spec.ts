import { fireEvent } from '@testing-library/dom';

import { draggable } from '../../../src/entry-point/adapter/element';
import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getElements, userEvent } from '../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should cancel the drag', () => {
  const [draggableEl] = getElements();
  const ordered: string[] = [];
  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('start'),
      onDrop: () => ordered.push('drop'),
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  userEvent.leaveWindow();

  // no changes yet
  expect(ordered).toEqual([]);

  userEvent.cancel(draggableEl);

  expect(ordered).toEqual(['drop']);

  cleanup();
});

it('should cancel a drag if a "pointermove" occurs (should not happen during a drag)', () => {
  const [draggableEl] = getElements();
  const ordered: string[] = [];
  const cleanup = combine(
    appendToBody(draggableEl),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('start'),
      onDrop: () => ordered.push('drop'),
    }),
  );

  userEvent.lift(draggableEl);

  expect(ordered).toEqual(['start']);
  ordered.length = 0;

  userEvent.leaveWindow();

  // no changes yet
  expect(ordered).toEqual([]);

  // pointer events
  userEvent.rougePointerMoves();
  expect(ordered).toEqual(['drop']);

  cleanup();
});
