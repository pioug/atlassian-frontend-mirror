import { fireEvent } from '@testing-library/dom';

import { combine } from '../../../../src/entry-point/combine';
import {
  dropTargetForExternal,
  monitorForExternal,
} from '../../../../src/entry-point/external/adapter';
import type { DropData } from '../../../../src/entry-point/types';
import {
  appendToBody,
  getBubbleOrderedTree,
  getElements,
  nativeDrag,
  reset,
  userEvent,
} from '../../_util';

afterEach(reset);

test('internal → internal', () => {
  const dropData: DropData[] = [];
  const ordered: string[] = [];
  const [A] = getElements('div');

  const cleanup = combine(
    appendToBody(A),
    monitorForExternal({
      onDragStart: () => ordered.push('monitor:start'),
      onDropTargetChange: () => ordered.push('monitor:change'),
      onDrop: ({ drop }) => {
        ordered.push('monitor:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForExternal({
      element: A,
      getDropEffect: () => 'move',
      onDragEnter: () => ordered.push('dropTarget:enter'),
      onDrop: () => ordered.push('dropTarget:drop'),
    }),
  );

  nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

  expect(ordered).toEqual(['monitor:start']);
  ordered.length = 0;

  // [] → [A]
  fireEvent.dragEnter(A);

  expect(ordered).toEqual(['dropTarget:enter', 'monitor:change']);
  ordered.length = 0;

  nativeDrag.drop({ items: [{ type: 'text/plain', data: 'hello' }] });
  expect(ordered).toEqual(['dropTarget:drop', 'monitor:drop']);

  const expected: DropData = {
    dropEffect: 'move',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal → external', () => {
  const [A] = getElements('div');
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    appendToBody(A),
    monitorForExternal({
      onDragStart: () => ordered.push('monitor:start'),
      onDropTargetChange: () => ordered.push('monitor:change'),
      onDrop: ({ drop }) => {
        ordered.push('monitor:drop');
        dropData.push(drop);
      },
    }),
  );

  nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });
  expect(ordered).toEqual(['monitor:start']);
  ordered.length = 0;

  userEvent.leaveWindow();

  expect(ordered).toEqual(['monitor:drop']);

  const expected: DropData = {
    dropEffect: 'none',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});

test('internal [drag corrupted]', () => {
  const dropData: DropData[] = [];
  const ordered: string[] = [];

  const cleanup = combine(
    monitorForExternal({
      onDragStart: () => ordered.push('monitor:start'),
      onDropTargetChange: () => ordered.push('monitor:change'),
      onDrop: ({ drop }) => {
        ordered.push('monitor:drop');
        dropData.push(drop);
      },
    }),
  );

  nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });
  expect(ordered).toEqual(['monitor:start']);
  ordered.length = 0;

  userEvent.rougePointerMoves();

  expect(ordered).toEqual(['monitor:drop']);

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
    monitorForExternal({
      onDragStart: () => ordered.push('monitor:start'),
      onDropTargetChange: () => ordered.push('monitor:change'),
      onDrop: ({ drop }) => {
        ordered.push('monitor:drop');
        dropData.push(drop);
      },
    }),
    dropTargetForExternal({
      element: parent,
      getDropEffect: () => 'link',
      onDropTargetChange: () => ordered.push('parent:change'),
      onDragEnter: () => ordered.push('parent:enter'),
      onDragLeave: () => ordered.push('parent:leave'),
      onDrop: () => ordered.push('parent:drop'),
    }),
    dropTargetForExternal({
      element: child,
      getDropEffect: () => 'copy',
      onDropTargetChange: () => ordered.push('child:change'),
      onDragEnter: () => ordered.push('child:enter'),
      onDragLeave: () => ordered.push('child:leave'),
      onDrop: () => ordered.push('child:drop'),
    }),
  );

  nativeDrag.startExternal({ items: [{ type: 'text/plain', data: 'hello' }] });

  expect(ordered).toEqual(['monitor:start']);
  ordered.length = 0;

  fireEvent.dragEnter(child);

  expect(ordered).toEqual([
    'child:change',
    'child:enter',
    'parent:change',
    'parent:enter',
    'monitor:change',
  ]);
  ordered.length = 0;

  nativeDrag.drop({
    items: [{ type: 'text/plain', data: 'hello' }],
    target: child,
  });

  const expected: DropData = {
    dropEffect: 'copy',
  };
  expect(dropData).toEqual([expected]);

  cleanup();
});
