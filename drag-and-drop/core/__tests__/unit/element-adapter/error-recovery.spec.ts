import { fireEvent } from '@testing-library/dom';

import { draggable } from '../../../src/entry-point/adapter/element';
import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getElements } from '../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

test('an error in "dragstart" will cause a "dragend" which will cancel the drag', () => {
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

  fireEvent.dragStart(draggableEl);

  // simulating an error in "dragstart"
  fireEvent.dragEnd(draggableEl);

  expect(ordered).toEqual(['start', 'drop']);

  cleanup();
});
