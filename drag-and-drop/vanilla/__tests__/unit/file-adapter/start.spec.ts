import {
  dropTargetForFiles,
  monitorForFiles,
} from '../../../src/entry-point/adapter/file';
import { combine } from '../../../src/entry-point/util/combine';
import { appendToBody, getBubbleOrderedTree } from '../_util';

it('should only start a drag if files are being dragged', () => {
  const [A] = getBubbleOrderedTree();
  const monitorOnDragStart = jest.fn();
  const cleanup = combine(
    appendToBody(A),
    dropTargetForFiles({
      element: A,
    }),
    monitorForFiles({
      onDragStart: monitorOnDragStart,
    }),
  );

  // Entering the window with something other than files won't start a drag
  const enterWindowWithoutFiles = new DragEvent('dragenter', {
    cancelable: true,
    bubbles: true,
  });
  // not dataTransfer.types set
  window.dispatchEvent(enterWindowWithoutFiles);
  // @ts-expect-error
  requestAnimationFrame.step();

  expect(monitorOnDragStart).toHaveBeenCalledTimes(0);

  // Entering the window with files will start a drag
  const enterWindowWithFiles = new DragEvent('dragenter', {
    cancelable: true,
    bubbles: true,
  });
  // @ts-expect-error
  enterWindowWithFiles.dataTransfer?.types.push('Files');
  window.dispatchEvent(enterWindowWithFiles);
  // @ts-expect-error
  requestAnimationFrame.step();

  expect(monitorOnDragStart).toHaveBeenCalledTimes(1);

  cleanup();
});
