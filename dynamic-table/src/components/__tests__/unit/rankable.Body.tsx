import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { mount, shallow } from 'enzyme';
import { RankableBody } from '../../rankable/Body';
import { head, rowsWithKeys } from './_data';

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

test('only one DragDropContext and Droppable are rendered', () => {
  const props = createProps();
  const wrapper = mount(
    <table>
      <RankableBody {...props} />
    </table>,
  );

  const dragDropContext = wrapper.find(DragDropContext);
  const droppable = wrapper.find(Droppable);
  const draggable = wrapper.find(Draggable);

  expect(dragDropContext).toHaveLength(1);
  expect(droppable).toHaveLength(1);
  expect(draggable).toHaveLength(rowsWithKeys.length);
});

test('onDragStart - onRankStart is called with proper arguments', () => {
  const props = createProps();
  const key = 'draggable-id';
  const index = 1;

  const wrapper = shallow(<RankableBody {...props} isRanking />);

  const dndContext = wrapper.find(DragDropContext);
  dndContext.simulate('beforeDragStart', {
    draggableId: key,
    source: { index },
  });

  const { onRankStart } = props;
  expect(onRankStart).toHaveBeenCalledTimes(1);
  expect(onRankStart).toHaveBeenLastCalledWith({ key, index });
});

test('onDragEnd - onRankEnd is called with proper empty destination if drag was cancelled', () => {
  const props = createProps();
  const sourceKey = 'source-key-draggable';
  const sourceIndex = 1;

  const wrapper = shallow(<RankableBody {...props} />);

  const dndContext = wrapper.find(DragDropContext);
  dndContext.simulate('dragEnd', createDragEndProps(sourceKey, sourceIndex));

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

  const wrapper = shallow(<RankableBody {...props} />);

  const dndContext = wrapper.find(DragDropContext);
  dndContext.simulate(
    'dragEnd',
    createDragEndProps(sourceKey, sourceIndex, destinationIndex),
  );

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
