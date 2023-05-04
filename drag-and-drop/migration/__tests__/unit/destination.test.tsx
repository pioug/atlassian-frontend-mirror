import React from 'react';

import { act, fireEvent, render } from '@testing-library/react';
import invariant from 'tiny-invariant';

import * as closestEdge from '@atlaskit/drag-and-drop-hitbox/addon/closest-edge';
import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import Board from '../../examples/01-board';
import { customAttributes } from '../../src/utils/attributes';

import { setElementFromPoint } from './_util';

const getDraggable = (container: HTMLElement, draggableId: string) => {
  const selector = `[data-rbd-draggable-id="${draggableId}"]`;
  const el = container.querySelector(selector);
  invariant(el instanceof HTMLElement);
  return el;
};

const extractClosestEdge = jest.spyOn(closestEdge, 'extractClosestEdge');

function dragAndDrop({
  handle,
  target,
}: {
  handle: HTMLElement;
  target: { element: HTMLElement; edge: Edge };
}) {
  const cleanup = setElementFromPoint(handle);
  fireEvent.dragStart(handle);
  act(() => {
    // @ts-expect-error
    requestAnimationFrame.step();
  });
  cleanup();

  extractClosestEdge.mockReturnValue(target.edge);
  fireEvent.dragEnter(target.element);

  fireEvent.drop(handle);
}

beforeEach(() => {
  extractClosestEdge.mockReturnValue(null);
});

describe('drop destination', () => {
  describe('target: self', () => {
    it('should not move if dropped on backward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({ handle, target: { element: handle, edge: 'top' } });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');
    });

    it('should not move if dropped on forward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({ handle, target: { element: handle, edge: 'bottom' } });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');
    });
  });

  describe('target: after self', () => {
    test('backward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'A3'),
          edge: 'top',
        },
      });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '2');
    });

    test('forward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'A3'),
          edge: 'bottom',
        },
      });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '3');
    });
  });

  describe('target: before self', () => {
    test('backward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A3');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '3');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'A0'),
          edge: 'top',
        },
      });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');
    });

    test('forward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A3');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '3');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'A0'),
          edge: 'bottom',
        },
      });
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '1');
    });
  });

  describe('target: other list', () => {
    test('backward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'B0'),
          edge: 'top',
        },
      });
      expect(getDraggable(container, 'A0')).toHaveAttribute(
        customAttributes.draggable.index,
        '0',
      );
    });

    test('forward edge', () => {
      const { container } = render(<Board />);

      const handle = getDraggable(container, 'A0');
      expect(handle).toHaveAttribute(customAttributes.draggable.index, '0');

      dragAndDrop({
        handle,
        target: {
          element: getDraggable(container, 'B0'),
          edge: 'bottom',
        },
      });
      expect(getDraggable(container, 'A0')).toHaveAttribute(
        customAttributes.draggable.index,
        '1',
      );
    });
  });
});
