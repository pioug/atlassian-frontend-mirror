import { fireEvent } from '@testing-library/dom';

import {
  draggable,
  monitorForElements,
} from '../../../../src/entry-point/adapter/element';
import { combine } from '../../../../src/entry-point/util/combine';
import { appendToBody, getElements } from '../../_util';

afterEach(() => {
  // cleanup any pending drags
  fireEvent.dragEnd(window);
});

it('should not treat two monitors as equal that share the same arguments', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  const args = {
    onGenerateDragPreview: () => ordered.push('monitor:preview'),
  };
  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview: () => ordered.push('draggable:preview'),
    }),
    monitorForElements(args),
    monitorForElements(args),
  );

  fireEvent.dragStart(A);

  expect(ordered).toEqual([
    'draggable:preview',
    'monitor:preview',
    'monitor:preview',
  ]);

  cleanup();
});
