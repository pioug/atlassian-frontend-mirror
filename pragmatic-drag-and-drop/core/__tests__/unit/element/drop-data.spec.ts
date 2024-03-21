import { fireEvent } from '@testing-library/dom';
import invariant from 'tiny-invariant';

import { combine } from '../../../src/entry-point/combine';
import {
  draggable,
  dropTargetForElements,
} from '../../../src/entry-point/element/adapter';
import type { DropData } from '../../../src/entry-point/types';
import {
  appendToBody,
  getBubbleOrderedTree,
  getElements,
  reset,
  userEvent,
} from '../_util';

afterEach(reset);

test('internal (drop) [A]', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);
  userEvent.drop(A);
  expect(ordered).toEqual([
    'draggable:start',
    'dropTarget:start',
    'draggable:drop',
    'dropTarget:drop',
  ]);

  const expected: DropData = {
    dropEffect: 'link',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal (drop) []', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);

  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  // [A] → []
  fireEvent.dragEnter(document.body);

  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
  ]);
  ordered.length = 0;

  userEvent.drop(A);

  expect(ordered).toEqual(['draggable:drop']);
  ordered.length = 0;

  const expected: DropData = {
    // when dropping on nothing, the drop effect will be "none"
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal (cancel)', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);

  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  userEvent.cancel();

  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
    'draggable:drop',
  ]);

  const expected: DropData = {
    // the platform drop effect for cancelling is "none"
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal → external (drop)', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);
  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  // leave the window
  userEvent.leaveWindow();
  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
  ]);
  ordered.length = 0;

  // faking an external drop
  {
    const event = new DragEvent('dragend');
    invariant(event.dataTransfer);
    event.dataTransfer.dropEffect = 'copy';
    A.dispatchEvent(event);
  }

  expect(ordered).toEqual(['draggable:drop']);

  const expected: DropData = {
    dropEffect: 'copy',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal → external (cancel)', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);
  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  // leave the window
  userEvent.leaveWindow();
  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
  ]);
  ordered.length = 0;

  // faking an external cancel
  {
    const event = new DragEvent('dragend');
    invariant(event.dataTransfer);
    event.dataTransfer.dropEffect = 'none';
    A.dispatchEvent(event);
  }

  expect(ordered).toEqual(['draggable:drop']);

  const expected: DropData = {
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal → external → internal', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);
  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  // leave the window
  userEvent.leaveWindow();
  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
  ]);
  ordered.length = 0;

  // going back over the window

  fireEvent.dragEnter(document.body);

  // drop target hierarchy has not changed
  expect(ordered).toEqual([]);

  fireEvent.dragEnd(A);

  expect(ordered).toEqual(['draggable:drop']);

  const expected: DropData = {
    // drop effect for cancelled events is "none"
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal [drag corrupted]', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);

  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  userEvent.rougePointerMoves();

  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
    'draggable:drop',
  ]);

  const expected: DropData = {
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal → external [drag corrupted]', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForElements({
      element: A,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('dropTarget:start'),
      onDropTargetChange: () => ordered.push('dropTarget:change'),
      onDragLeave: () => ordered.push('dropTarget:leave'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  userEvent.lift(A);

  expect(ordered).toEqual(['draggable:start', 'dropTarget:start']);
  ordered.length = 0;

  userEvent.leaveWindow();

  expect(ordered).toEqual([
    'draggable:change',
    'dropTarget:change',
    'dropTarget:leave',
  ]);
  ordered.length = 0;

  // let's say something went wrong and now we start seeing broken events locally
  userEvent.rougePointerMoves();

  expect(ordered).toEqual(['draggable:drop']);

  const expected: DropData = {
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('should expose the innermost drop targets drop effect', () => {
  const [child, parent] = getBubbleOrderedTree();
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(parent),
    draggable({
      element: child,
      onDragStart: () => ordered.push('draggable:start'),
      onDropTargetChange: () => ordered.push('draggable:change'),
      onDrop({ drop, location }) {
        ordered.push('draggable:drop');
        dropData.push(drop);
        // just a little validation of understanding
        expect(location.current.dropTargets[0]?.element).toBe(child);
      },
    }),
    dropTargetForElements({
      element: parent,
      getDropEffect: () => 'link',
      onDragStart: () => ordered.push('parent:start'),
      onDropTargetChange: () => ordered.push('parent:change'),
      onDragLeave: () => ordered.push('parent:leave'),
      onDrop: () => ordered.push('parent:drop'),
    }),
    dropTargetForElements({
      element: child,
      getDropEffect: () => 'copy',
      onDragStart: () => ordered.push('child:start'),
      onDropTargetChange: () => ordered.push('child:change'),
      onDragLeave: () => ordered.push('child:leave'),
      onDrop: () => ordered.push('child:drop'),
    }),
  );

  userEvent.lift(child);

  expect(ordered).toEqual(['draggable:start', 'child:start', 'parent:start']);

  userEvent.drop(child);

  const expected: DropData = {
    dropEffect: 'copy',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});
