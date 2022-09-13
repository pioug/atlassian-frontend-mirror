import { fireEvent } from '@testing-library/dom';
import { bind } from 'bind-event-listener';

import { draggable } from '../../../src/entry-point/adapter/element';
import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getBubbleOrderedTree } from '../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

test('do not start a drag if an unmanaged child element is being dragged', () => {
  const [child, parent] = getBubbleOrderedTree();
  const ordered: string[] = [];
  const cleanup = combine(
    appendToBody(parent),
    draggable({
      element: parent,
      onGenerateDragPreview: () => ordered.push('parent:preview'),
    }),
  );

  // the closest draggable element will be marked as the `event.target` for the dragstart event
  child.draggable = true;
  fireEvent.dragStart(child);

  expect(ordered).toEqual([]);

  cleanup();
});

test('a unmanaged child draggable should not start dragging if a managed parent is dragging', () => {
  const [unmanagedChild, parent] = getBubbleOrderedTree();
  const ordered: string[] = [];
  unmanagedChild.draggable = true;
  const cleanup = combine(
    appendToBody(parent),
    draggable({
      element: parent,
      onGenerateDragPreview: () => ordered.push('parent:preview'),
    }),
    bind(unmanagedChild, {
      type: 'dragstart',
      listener: () => ordered.push('child:start'),
    }),
  );

  // the closest draggable element will be marked as the `event.target` for the dragstart event
  fireEvent.dragStart(parent);

  expect(ordered).toEqual(['parent:preview']);

  cleanup();
});
