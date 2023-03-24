import { fireEvent } from '@testing-library/dom';
import invariant from 'tiny-invariant';

import {
  draggable,
  ElementEventPayloadMap,
} from '../../../src/entry-point/adapter/element';
import { combine } from '../../../src/entry-point/util/combine';
import { setCustomNativeDragPreview } from '../../../src/entry-point/util/set-custom-native-drag-preview';
import {
  appendToBody,
  getElements,
  getRect,
  reset,
  setBoundingClientRect,
  userEvent,
} from '../_util';

/**
 * Note: I have tested what I can about custom native drag previews in this file.
 * Ideally we would have VR tests that ensured the custom native drag preview
 * behaved how we expected in lots of scenarios. However, our VR testing today
 * does not capture native drag previews as drag previews are rendered outside of
 * the browser window on a separate native layer.
 */

afterEach(reset);

describe('cleanup in `onDragStart`', () => {
  it('should remove the container element from the body', () => {
    const [A] = getElements();
    const ordered: string[] = [];
    let pointerToContainer: HTMLElement | null = null;
    const cleanup = combine(
      appendToBody(A),
      draggable({
        element: A,
        onGenerateDragPreview({ nativeSetDragImage }) {
          ordered.push('preview');
          setCustomNativeDragPreview({
            render({ container }) {
              pointerToContainer = container;
              const preview = document.createElement('div');
              container.appendChild(preview);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => ordered.push('start'),
      }),
    );

    fireEvent.dragStart(A);

    expect(ordered).toEqual(['preview']);
    ordered.length = 0;
    expect(document.body.contains(pointerToContainer)).toBe(true);

    // After lift we expect `container` is removed from the `document.body`
    // @ts-expect-error
    requestAnimationFrame.step();
    expect(document.body.contains(pointerToContainer)).toBe(false);
    expect(ordered).toEqual(['start']);

    cleanup();
  });

  it('should only call the cleanup function once', () => {
    const [A] = getElements();
    const ordered: string[] = [];
    let useCustomNativeDragPreview = true;
    const cleanup = combine(
      appendToBody(A),
      draggable({
        element: A,
        onGenerateDragPreview({ nativeSetDragImage }) {
          ordered.push('preview');
          if (useCustomNativeDragPreview) {
            setCustomNativeDragPreview({
              render({ container }) {
                const preview = document.createElement('div');
                container.appendChild(preview);
                return () => ordered.push('preview-cleanup');
              },
              nativeSetDragImage,
            });
          }
        },
        onDragStart: () => ordered.push('start'),
        onDrop: () => ordered.push('drop'),
      }),
    );

    fireEvent.dragStart(A);

    expect(ordered).toEqual(['preview']);
    ordered.length = 0;

    // After lift we expect `container` is removed from the `document.body`
    // @ts-expect-error
    requestAnimationFrame.step();
    expect(ordered).toEqual(['start', 'preview-cleanup']);
    ordered.length = 0;

    userEvent.cancel();
    expect(ordered).toEqual(['drop']);
    ordered.length = 0;

    // Start another drag, this time not using a custom drag preview
    // Our old function should not be called again
    useCustomNativeDragPreview = false;
    userEvent.lift(A);
    userEvent.cancel();
    expect(ordered).toEqual(['preview', 'start', 'drop']);

    cleanup();
  });
});

test('placement: {type: "center" } should position the center of the drag preview user the users pointer', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  let pointerToContainer: HTMLElement | null = null;
  const rect: DOMRect = getRect({ top: 0, bottom: 100, left: 0, right: 20 });
  const setImageMock = jest.fn();
  function makeMock(
    nativeSetDragImage: ElementEventPayloadMap['onGenerateDragPreview']['nativeSetDragImage'],
  ) {
    invariant(nativeSetDragImage);
    return (...args: Parameters<typeof nativeSetDragImage>) => {
      setImageMock(...args);
      nativeSetDragImage(...args);
    };
  }
  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview({ nativeSetDragImage }) {
        ordered.push('preview');
        setCustomNativeDragPreview({
          placement: { type: 'center' },
          render({ container }) {
            pointerToContainer = container;
            setBoundingClientRect(container, rect);
            const preview = document.createElement('div');
            container.appendChild(preview);
          },
          nativeSetDragImage: makeMock(nativeSetDragImage),
        });
      },
      onDragStart: () => ordered.push('start'),
    }),
  );

  fireEvent.dragStart(A);

  expect(ordered).toEqual(['preview']);
  ordered.length = 0;
  expect(setImageMock).nthCalledWith(
    1,
    pointerToContainer,
    rect.width / 2,
    rect.height / 2,
  );

  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['start']);

  cleanup();
});

test('placement: {type: "offset-from-pointer" } should position shift the drag preview off the users pointer', () => {
  const [A] = getElements();
  const ordered: string[] = [];
  let pointerToContainer: HTMLElement | null = null;
  const rect: DOMRect = getRect({ top: 0, bottom: 100, left: 0, right: 20 });
  const setImageMock = jest.fn();
  function makeMock(
    nativeSetDragImage: ElementEventPayloadMap['onGenerateDragPreview']['nativeSetDragImage'],
  ) {
    invariant(nativeSetDragImage);
    return (...args: Parameters<typeof nativeSetDragImage>) => {
      setImageMock(...args);
      nativeSetDragImage(...args);
    };
  }
  const cleanup = combine(
    appendToBody(A),
    draggable({
      element: A,
      onGenerateDragPreview({ nativeSetDragImage }) {
        ordered.push('preview');
        setCustomNativeDragPreview({
          placement: {
            type: 'offset-from-pointer',
            x: '10px',
            y: '20px',
          },
          render({ container }) {
            pointerToContainer = container;
            setBoundingClientRect(container, rect);
            const preview = document.createElement('div');
            container.appendChild(preview);
          },
          nativeSetDragImage: makeMock(nativeSetDragImage),
        });
      },
      onDragStart: () => ordered.push('start'),
    }),
  );

  fireEvent.dragStart(A);

  expect(ordered).toEqual(['preview']);
  ordered.length = 0;
  // position drag preview at default of top / left at 0 on the users pointer
  invariant(pointerToContainer);
  expect(setImageMock).nthCalledWith(1, pointerToContainer, 0, 0);
  // use a transparent border to shift the drag preview
  expect((pointerToContainer as HTMLElement).style.borderLeft).toEqual(
    '10px solid transparent',
  );
  expect((pointerToContainer as HTMLElement).style.borderTop).toEqual(
    '20px solid transparent',
  );

  // @ts-expect-error
  requestAnimationFrame.step();
  expect(ordered).toEqual(['start']);

  cleanup();
});
