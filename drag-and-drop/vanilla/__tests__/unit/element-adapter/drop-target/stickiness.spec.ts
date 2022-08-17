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

test('[A(sticky)] -> [] = [A]', () => {
  const [draggableEl, A] = getBubbleOrderedTree();
  A.id = 'A';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(document.body);

  expect(ordered).toEqual([]);

  cleanup();
});

test('[B(sticky), A(sticky)] -> [] = [B, A]', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(document.body);

  expect(ordered).toEqual([]);

  cleanup();
});

test('[C, B(sticky), A(sticky)] -> [] = [B, A]', () => {
  const [draggableEl, C, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  C.id = 'C';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
    dropTargetForElements({
      element: C,
      getIsSticky: () => false,
      onDragStart: () => ordered.push('c:start'),
      onDropTargetChange: () => ordered.push('c:update'),
      onDragLeave: () => ordered.push('c:leave'),
      onDragEnter: () => ordered.push('c:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'c:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(document.body);

  expect(ordered).toEqual([
    'draggable:update',
    'c:update',
    'c:leave',
    // not leaving b or a, but letting them know something changed
    'b:update',
    'a:update',
  ]);

  cleanup();
});

test('[A(sticky)] -> [B] = [B]', () => {
  const [draggableEl, A] = getBubbleOrderedTree();
  const [B] = getElements();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A, B),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(B);

  expect(ordered).toEqual([
    'draggable:update',
    'a:update',
    'a:leave',
    'b:update',
    'b:enter',
  ]);

  cleanup();
});

test('[B(sticky), A] -> [A] = [B, A]', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(A);

  expect(ordered).toEqual([]);

  cleanup();
});

test('[B, A(sticky)] -> [A] = [A]', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(A);

  expect(ordered).toEqual([
    'draggable:update',
    'b:update',
    'b:leave',
    'a:update',
  ]);

  cleanup();
});

// parent changes: not sure

test('[B(sticky), A] -> [X] = [X]', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  const [X] = getElements();
  A.id = 'A';
  B.id = 'B';
  X.id = 'X';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A, X),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
    dropTargetForElements({
      element: X,
      getIsSticky: () => false,
      onDragStart: () => ordered.push('x:start'),
      onDropTargetChange: () => ordered.push('x:update'),
      onDragLeave: () => ordered.push('x:leave'),
      onDragEnter: () => ordered.push('x:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(X);

  expect(ordered).toEqual([
    'draggable:update',
    'b:update',
    'b:leave',
    'a:update',
    'a:leave',
    'x:update',
    'x:enter',
  ]);

  cleanup();
});

test('[B(sticky), A] -> [] = []', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(document.body);

  expect(ordered).toEqual([
    'draggable:update',
    'b:update',
    'b:leave',
    'a:update',
    'a:leave',
  ]);

  cleanup();
});

test('[B(sticky), A(sticky)] -> [X] = [X]', () => {
  const [draggableEl, B, A] = getBubbleOrderedTree();
  A.id = 'A';
  B.id = 'B';
  const [X] = getElements();
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A, X),
    draggable({
      element: draggableEl,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:update'),
    }),
    dropTargetForElements({
      element: A,
      onDragStart: () => ordered.push('a:start'),
      onDropTargetChange: () => ordered.push('a:update'),
      onDragLeave: () => ordered.push('a:leave'),
      onDragEnter: () => ordered.push('a:enter'),
    }),
    dropTargetForElements({
      element: B,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('b:start'),
      onDropTargetChange: () => ordered.push('b:update'),
      onDragLeave: () => ordered.push('b:leave'),
      onDragEnter: () => ordered.push('b:enter'),
    }),
    dropTargetForElements({
      element: X,
      getIsSticky: () => true,
      onDragStart: () => ordered.push('x:start'),
      onDropTargetChange: () => ordered.push('x:update'),
      onDragLeave: () => ordered.push('x:leave'),
      onDragEnter: () => ordered.push('x:enter'),
    }),
  );

  userEvent.lift(draggableEl);
  // validating [draggable, A]
  expect(ordered).toEqual(['draggable:start', 'b:start', 'a:start']);
  ordered.length = 0;

  fireEvent.dragEnter(X);

  expect(ordered).toEqual([
    'draggable:update',
    'b:update',
    'b:leave',
    'a:update',
    'a:leave',
    'x:update',
    'x:enter',
  ]);

  cleanup();
});
