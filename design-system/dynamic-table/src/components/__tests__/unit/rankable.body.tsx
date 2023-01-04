import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { RankableBody } from '../../rankable/body';

import { head, rowsWithKeys } from './_data';

const testId = 'dynamic--table--test--id';

jest.mock('react-beautiful-dnd', () => {
  const actual = jest.requireActual('react-beautiful-dnd');
  return {
    __esModule: true,
    ...actual,
    DragDropContext: jest.fn().mockImplementation((props) => {
      const triggerDragEnd: React.MouseEventHandler<HTMLButtonElement> = (
        event,
      ) => {
        // @ts-ignore - Hack to pass custom data from test.
        props.onDragEnd(event.target.dragData);
      };

      return (
        <>
          <table>{props.children}</table>
          <button type="button" onClick={triggerDragEnd}>
            Trigger Drag End
          </button>
        </>
      );
    }),
    Droppable: jest.fn().mockImplementation((props) => {
      const innerRef = { current: {} };
      const droppableProps = {};
      return props.children({ innerRef, droppableProps });
    }),
    Draggable: jest.fn().mockImplementation((props) => {
      const innerRef = jest.fn();
      const droppableProps = {};

      const dragHandleProps = {};
      const draggableProps = {};

      const provided = {
        innerRef,
        droppableProps,
        dragHandleProps,
        draggableProps,
      };

      const snapshot = {
        isDragging: true,
      };

      return props.children(provided, snapshot);
    }),
  };
});

const createProps = () => ({
  head,
  isFixedSize: false,
  onRankStart: jest.fn(),
  onRankEnd: jest.fn(),
  isRanking: false,
  innerRef: jest.fn(),
  refWidth: -1,
  refHeight: -1,
  pageRows: rowsWithKeys,
  isRankingDisabled: false,
  testId,
});

const createDragEndProps = (
  sourceKey: string,
  sourceIndex: number,
  destinationIndex?: number,
) => {
  return {
    draggableId: sourceKey,
    source: {
      index: sourceIndex,
    },
    destination:
      destinationIndex !== undefined
        ? {
            index: destinationIndex,
          }
        : undefined,
  };
};

test('onDragEnd - onRankEnd is called with proper empty destination if drag was cancelled', () => {
  const props = createProps();
  const sourceKey = 'source-key-draggable';
  const sourceIndex = 1;

  render(<RankableBody {...props} />);
  const dragBtn = screen.getByRole('button', { name: 'Trigger Drag End' });

  fireEvent.click(dragBtn, {
    target: { dragData: createDragEndProps(sourceKey, sourceIndex) },
  });

  const { onRankEnd } = props;
  expect(onRankEnd).toHaveBeenCalledTimes(1);
  expect(onRankEnd).toHaveBeenLastCalledWith({ sourceKey, sourceIndex });
});

const testOnRankEnd = (
  sourceIndex: number,
  destinationIndex: number,
  afterKey?: string,
  beforeKey?: string,
) => {
  const props = createProps();
  const sourceKey = 'source-key-draggable';

  render(<RankableBody {...props} />);

  const dragBtn = screen.getByRole('button', { name: 'Trigger Drag End' });

  fireEvent.click(dragBtn, {
    target: {
      dragData: createDragEndProps(sourceKey, sourceIndex, destinationIndex),
    },
  });

  const { onRankEnd } = props;
  expect(onRankEnd).toHaveBeenCalledTimes(1);
  expect(onRankEnd).toHaveBeenLastCalledWith({
    sourceKey,
    sourceIndex,
    destination: {
      index: destinationIndex,
      afterKey,
      beforeKey,
    },
  });
};

const getKey = (index: number) => rowsWithKeys[index].key;

test('onDragEnd - onRankEnd is called with proper destination if was dropped on first position', () => {
  testOnRankEnd(2, 0, undefined, getKey(0));
});

test('onDragEnd - onRankEnd is called with proper destination if was dropped in the middle of list (move to the greater index)', () => {
  testOnRankEnd(0, 2, getKey(2), getKey(3));
});

test('onDragEnd - onRankEnd is called with proper destination if was dropped in the middle of list before an item', () => {
  testOnRankEnd(3, 1, getKey(0), getKey(1));
});

test('onDragEnd - onRankEnd is called with proper destination if was dropped on the last position', () => {
  const lastIndex = rowsWithKeys.length - 1;
  testOnRankEnd(1, lastIndex, getKey(lastIndex), undefined);
});
