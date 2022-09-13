import { fireEvent } from '@testing-library/dom';

import {
  dropTargetForFiles,
  FileMonitorCanMonitorArgs,
  monitorForFiles,
} from '../../../src/entry-point/adapter/file';
import { combine } from '../../../src/entry-point/util/combine';
import {
  appendToBody,
  getDefaultInput,
  getElements,
  userEvent,
} from '../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should give the `source` from the beginning of the drag and not the latest (`source` can be updated for external drag types)', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const cleanup1 = combine(
    appendToBody(A),
    monitorForFiles({
      onDragStart: () => ordered.push('monitor1:start'),
      onDrag: () => ordered.push('monitor1:drag'),
      onDropTargetChange: () => ordered.push('monitor1:change'),
      onDrop: () => ordered.push('monitor1:drop'),
    }),
    dropTargetForFiles({
      element: A,
      onDrag: () => ordered.push('a:drag'),
      onDragEnter: () => ordered.push('a:enter'),
      onDropTargetChange: () => ordered.push('a:change'),
      onDrop: () => ordered.push('a:drop'),
    }),
  );

  // entering body
  userEvent.startExternalDrag({ types: ['Files'] });
  expect(ordered).toEqual(['monitor1:start']);
  ordered.length = 0;

  // entering A
  fireEvent.dragEnter(A);
  expect(ordered).toEqual(['a:change', 'a:enter', 'monitor1:change']);
  ordered.length = 0;

  const canMonitor = jest.fn(() => true);
  const cleanup2 = monitorForFiles({
    canMonitor,
    onDragStart: () => ordered.push('monitor2:start'),
    onDrag: () => ordered.push('monitor2:drag'),
    onDropTargetChange: () => ordered.push('monitor2:change'),
    onDrop: () => ordered.push('monitor2:drop'),
  });

  // dropping
  const drop = new DragEvent('drop', {
    cancelable: true,
    bubbles: true,
  });
  // @ts-expect-error
  drop.dataTransfer?.types.push('Files');
  drop.dataTransfer?.items.add(
    new File(['🕺💃'], 'dance.png', { type: 'image/png' }),
  );
  A.dispatchEvent(drop);

  expect(ordered).toEqual(['a:drop', 'monitor1:drop', 'monitor2:drop']);
  const expected: FileMonitorCanMonitorArgs = {
    // items is not populated
    source: { items: null },
    initial: { input: getDefaultInput(), dropTargets: [] },
  };
  expect(canMonitor).toHaveBeenCalledWith(expected);

  cleanup1();
  cleanup2();
});
