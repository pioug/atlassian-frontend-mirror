import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  dropTargetForElements,
} from '../../../src/entry-point/adapter/element';
import { combine } from '../../../src/entry-point/util/combine';
import {
  appendToBody,
  getBubbleOrderedTree,
  getElements,
  reset,
  setElementFromPoint,
  userEvent,
} from '../_util';

afterEach(reset);

/** Ideally we would be validating the bug still exists, and that our fix works, through browser tests.
 * However, I could not get puppeteer to replicate the browser bug, so some basic unit tests is
 * all we can do at this stage 😢
 */

it('should apply the fix after a microtask to allow frameworks to update the UI in a microtask', async () => {
  const [target] = getElements();
  const ordered: string[] = [];
  const cleanup = combine(
    appendToBody(target),
    draggable({
      element: target,
      onDragStart: () => ordered.push('draggable:start'),
      onDrop: () => ordered.push('draggable:drop'),
    }),
    dropTargetForElements({
      element: target,
      onDragStart: () => ordered.push('dropTarget:start'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(target);
  userEvent.drop(target);
  expect(ordered).toEqual([
    'draggable:start',
    'dropTarget:start',
    'draggable:drop',
    'dropTarget:drop',
  ]);

  expect(document.body.style.pointerEvents).toBe('');

  await 'microtask';

  expect(document.body.style.pointerEvents).toBe('none');

  cleanup();
});

test('the fix should block pointer events on all elements except for the one under the users pointer (successful drop)', async () => {
  const [grandChild, child, parent, grandParent] = getBubbleOrderedTree();
  const [X] = getElements();

  const ordered: string[] = [];
  const cleanups: (() => void)[] = [];
  cleanups.push(
    combine(
      appendToBody(parent),
      appendToBody(X),
      draggable({
        element: X,
        onDragStart: () => ordered.push('X:start'),
        onDrop: () => ordered.push('X:drop'),
      }),
      dropTargetForElements({
        element: parent,
        onDragStart: () => ordered.push('parent:start'),
        onDragEnter: () => ordered.push('parent:enter'),
        onDrop: () => ordered.push('parent:drop'),
      }),
    ),
  );

  userEvent.lift(X);
  expect(ordered).toEqual(['X:start']);
  ordered.length = 0;

  fireEvent.dragEnter(parent);
  expect(ordered).toEqual(['parent:enter']);
  ordered.length = 0;

  cleanups.push(setElementFromPoint(parent));
  userEvent.drop(parent);
  expect(ordered).toEqual(['X:drop', 'parent:drop']);

  // fix not yet applied
  expect(document.body.style.pointerEvents).toBe('');

  // after a microtask the fix will be applied
  await 'microtask';

  // pointer events blocked on document.body
  expect(document.body.style.pointerEvents).toBe('none');

  // pointer events allowed on the element under the users cursor
  expect(parent.style.pointerEvents).toBe('auto');

  // pointer events blocked on child
  expect(child.style.pointerEvents).toBe('none');

  // pointer events not blocked on grandChild (will be blocked by `child`)
  expect(grandChild.style.pointerEvents).toBe('');

  // pointer events not blocked on grandParent (will be blocked by `body`)
  expect(grandParent.style.pointerEvents).toBe('');

  cleanups.forEach(cleanup => cleanup());
});

test('the fix should block pointer events on all elements except for the one under the users pointer (cancelled drag)', async () => {
  const [grandChild, child, parent, grandParent] = getBubbleOrderedTree();
  const [X] = getElements();

  const ordered: string[] = [];
  const cleanups: (() => void)[] = [];
  cleanups.push(
    combine(
      appendToBody(parent),
      appendToBody(X),
      draggable({
        element: X,
        onDragStart: () => ordered.push('X:start'),
        onDrop: () => ordered.push('X:drop'),
      }),
      dropTargetForElements({
        element: parent,
        onDragStart: () => ordered.push('parent:start'),
        onDragEnter: () => ordered.push('parent:enter'),
        onDragLeave: () => ordered.push('parent:leave'),
        onDrop: () => ordered.push('parent:drop'),
      }),
    ),
  );

  userEvent.lift(X);
  expect(ordered).toEqual(['X:start']);
  ordered.length = 0;

  fireEvent.dragEnter(parent);
  expect(ordered).toEqual(['parent:enter']);
  ordered.length = 0;

  // cancel the drag
  cleanups.push(setElementFromPoint(parent));
  userEvent.cancel(parent);
  expect(ordered).toEqual(['parent:leave', 'X:drop']);

  // fix not yet applied
  expect(document.body.style.pointerEvents).toBe('');

  // after a microtask the fix will be applied
  await 'microtask';

  // pointer events blocked on document.body
  expect(document.body.style.pointerEvents).toBe('none');

  // pointer events allowed on the element under the users cursor
  expect(parent.style.pointerEvents).toBe('auto');

  // pointer events blocked on child
  expect(child.style.pointerEvents).toBe('none');

  // pointer events not blocked on grandChild (will be blocked by `child`)
  expect(grandChild.style.pointerEvents).toBe('');

  // pointer events not blocked on grandParent (will be blocked by `body`)
  expect(grandParent.style.pointerEvents).toBe('');

  cleanups.forEach(cleanup => cleanup());
});

['pointerdown', 'pointermove', 'focusin', 'focusout', 'dragstart'].forEach(
  eventName => {
    it(`should remove the fix after a user interaction [trigger: ${eventName}]`, async () => {
      const [grandChild, child, parent, grandParent] = getBubbleOrderedTree();
      const [X] = getElements();

      const ordered: string[] = [];
      const cleanups: (() => void)[] = [];
      cleanups.push(
        combine(
          appendToBody(parent),
          appendToBody(X),
          draggable({
            element: X,
            onDragStart: () => ordered.push('X:start'),
            onDrop: () => ordered.push('X:drop'),
          }),
          dropTargetForElements({
            element: parent,
            onDragStart: () => ordered.push('parent:start'),
            onDragEnter: () => ordered.push('parent:enter'),
            onDrop: () => ordered.push('parent:drop'),
          }),
        ),
      );

      userEvent.lift(X);
      expect(ordered).toEqual(['X:start']);
      ordered.length = 0;

      fireEvent.dragEnter(parent);
      expect(ordered).toEqual(['parent:enter']);
      ordered.length = 0;

      cleanups.push(setElementFromPoint(parent));
      userEvent.drop(parent);
      expect(ordered).toEqual(['X:drop', 'parent:drop']);

      // fix not yet applied
      expect(document.body.style.pointerEvents).toBe('');

      // after a microtask the fix will be applied
      await 'microtask';

      // pointer events blocked on document.body
      expect(document.body.style.pointerEvents).toBe('none');

      window.dispatchEvent(
        new Event(eventName, { cancelable: true, bubbles: true }),
      );

      // fix no longer applied
      expect(document.body.style.pointerEvents).toBe('');
      expect(grandChild.style.pointerEvents).toBe('');
      expect(child.style.pointerEvents).toBe('');
      expect(parent.style.pointerEvents).toBe('');
      expect(grandParent.style.pointerEvents).toBe('');
    });
  },
);
