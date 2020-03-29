import { mount, configure } from 'enzyme';
//@ts-ignore
import Adapter from 'enzyme-adapter-react-16';
import React, { useState } from 'react';
import {
  DropResult,
  DragUpdate,
  DragStart,
  Droppable,
} from 'react-beautiful-dnd-next';
import { getBox } from 'css-box-model';
import Tree from '../../Tree';
// import { Props as TreeProps } from '../../Tree-types';
import { mutateTree } from '../../../../utils/tree';
import { treeWithThreeLeaves } from '../../../../../mockdata/treeWithThreeLeaves';
import { treeWithTwoBranches } from '../../../../../mockdata/treeWithTwoBranches';
import { treeInitiallyClosed } from '../../../../../mockdata/treeInitiallyClosed';
import { RenderItemParams } from '../../../TreeItem/TreeItem-types';

configure({ adapter: new Adapter() });

const dragStart: DragStart = {
  draggableId: '1-1',
  type: 'any',
  source: {
    droppableId: 'list',
    index: 1,
  },
  mode: 'FLUID',
};

const dragUpdate: DragUpdate = {
  ...dragStart,
  destination: {
    droppableId: 'list',
    index: 4,
  },
  combine: undefined,
};

const dropResult: DropResult = {
  ...dragUpdate,
  reason: 'DROP',
};

jest.mock('css-box-model');
jest.useFakeTimers();

describe('@atlaskit/tree - Tree', () => {
  const mockRender = jest.fn(({ provided }) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      Draggable
    </div>
  ));

  beforeEach(() => {
    mockRender.mockClear();
  });

  describe('#closeParentIfNeeded', () => {
    it("collapses parent if it's draggen", () => {
      expect(treeWithTwoBranches.items['1-1'].isExpanded).toBe(true);
      const newTree = Tree.closeParentIfNeeded(treeWithTwoBranches, '1-1');
      expect(newTree.items['1-1'].isExpanded).toBe(false);
    });
  });

  describe('#render', () => {
    it('renders Droppable with the correct props', () => {
      const tree = mount(
        <Tree tree={treeWithThreeLeaves} renderItem={mockRender} />,
      );
      const droppable = tree.find(Droppable);
      expect(droppable.prop('droppableId')).toBe('tree');
      expect(droppable.prop('isCombineEnabled')).toBe(false);
      expect(droppable.prop('ignoreContainerClipping')).toBe(true);
    });

    it('renders a flat list using renderItem', () => {
      mount(<Tree tree={treeWithThreeLeaves} renderItem={mockRender} />);
      expect(mockRender).toHaveBeenCalledTimes(3);
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-1'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-2'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
      expect(mockRender).toBeCalledWith({
        item: treeWithThreeLeaves.items['1-3'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
    });

    it('re-renders only the items which have been changed', () => {
      const wrapper = mount(
        <Tree tree={treeWithThreeLeaves} renderItem={mockRender} />,
      );
      expect(mockRender).toHaveBeenCalledTimes(3);
      mockRender.mockClear();
      const mutatedTree = {
        rootId: treeWithThreeLeaves.rootId,
        items: {
          ...treeWithThreeLeaves.items,
          '1-3': {
            ...treeWithThreeLeaves.items['1-3'],
          },
        },
      };
      wrapper.setProps({ tree: mutatedTree, renderItem: mockRender });
      expect(mockRender).toHaveBeenCalledTimes(1);
      expect(mockRender).toBeCalledWith({
        item: mutatedTree.items['1-3'],
        depth: 0,
        onExpand: expect.any(Function),
        onCollapse: expect.any(Function),
        provided: expect.any(Object),
        snapshot: expect.any(Object),
      });
    });
  });

  describe('#onExpand', () => {
    it('calls with the right item', () => {
      const mockOnExpand = jest.fn();
      const firstItem = treeWithThreeLeaves.items['1-1'];
      mount(
        <Tree
          tree={treeWithThreeLeaves}
          renderItem={mockRender}
          onExpand={mockOnExpand}
        />,
      );
      mockRender.mock.calls[0][0].onExpand(firstItem);
      expect(mockOnExpand).toHaveBeenCalledTimes(1);
      expect(mockOnExpand).toBeCalledWith(firstItem, [0]);
    });
    it('shows only the relevant children', () => {
      const DynamicTree = () => {
        const [tree, setTree] = useState(treeInitiallyClosed);

        const renderItem = (params: RenderItemParams) => {
          const { item, provided, onCollapse, onExpand } = params;
          return (
            <div
              data-testid={item.id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              onClick={() => {
                if (item.isExpanded) {
                  onCollapse(item.id);
                } else {
                  onExpand(item.id);
                }
              }}
            >
              {item.id}
            </div>
          );
        };

        const onExpand = (itemId: React.ReactText) => {
          const newTree = mutateTree(tree, itemId, { isExpanded: true });
          setTree(newTree);
        };

        const onCollapse = (itemId: React.ReactText) => {
          const newTree = mutateTree(tree, itemId, { isExpanded: false });
          setTree(newTree);
        };

        return (
          <Tree
            tree={tree}
            renderItem={renderItem}
            onExpand={onExpand}
            onCollapse={onCollapse}
          />
        );
      };

      const wrapper = mount(<DynamicTree />);

      wrapper.find('[data-testid="a"]').simulate('click');
      wrapper.find('[data-testid="a"]').simulate('click');
      wrapper.find('[data-testid="b"]').simulate('click');
      wrapper.find('[data-testid="b"]').simulate('click');
      wrapper.find('[data-testid="a"]').simulate('click');

      expect(wrapper.find('[data-testid="a"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="c"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="d"]').exists()).toBe(false);
    });
  });

  describe('#onCollapse', () => {
    it('calls with the right item', () => {
      const mockOnCollapse = jest.fn();
      const firstItem = treeWithThreeLeaves.items['1-1'];
      mount(
        <Tree
          tree={treeWithThreeLeaves}
          renderItem={mockRender}
          onCollapse={mockOnCollapse}
        />,
      );
      mockRender.mock.calls[0][0].onCollapse(firstItem);
      expect(mockOnCollapse).toHaveBeenCalledTimes(1);
      expect(mockOnCollapse).toBeCalledWith(firstItem, [0]);
    });
  });

  describe('#onDragStart', () => {
    it('saves the draggedItemId and source', () => {
      const instance = mount<Tree>(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      expect(instance.dragState).toEqual({
        source: dragStart.source,
        destination: dragStart.source,
        mode: dragStart.mode,
      });
      expect(instance.state.draggedItemId).toBe(dragStart.draggableId);
    });
    it('calls onDragStart if it is defined', () => {
      const mockOnStartCb = jest.fn();
      const instance = mount<Tree>(
        <Tree
          tree={treeWithTwoBranches}
          renderItem={mockRender}
          onDragStart={mockOnStartCb}
        />,
      ).instance();
      instance.onDragStart(dragStart);
      expect(mockOnStartCb).toHaveBeenCalledTimes(1);
      expect(mockOnStartCb).toHaveBeenCalledWith('1-1');
    });
  });

  describe('#onDragUpdate', () => {
    it('updates dragState', () => {
      const instance = mount<Tree>(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onDragUpdate(dragUpdate);
      expect(instance.dragState).toEqual({
        source: dragUpdate.source,
        destination: dragUpdate.destination,
        mode: dragUpdate.mode,
      });
      expect(instance.state.draggedItemId).toBe(dragUpdate.draggableId);
    });

    it('expands parent after timeout', () => {
      const treeWithClosedParent = mutateTree(treeWithTwoBranches, '1-2', {
        isExpanded: false,
      });
      const onExpand = jest.fn();
      const instance = mount<Tree>(
        <Tree
          tree={treeWithClosedParent}
          renderItem={mockRender}
          onExpand={onExpand}
        />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onDragUpdate({
        ...dragUpdate,
        combine: {
          draggableId: '1-2',
          droppableId: '',
        },
        destination: undefined,
      });

      jest.runAllTimers();

      expect(onExpand).toHaveBeenCalledWith('1-2', [1]);
    });
  });

  describe('#onPointerMove', () => {
    it('calculates horizontal level based on the horizontal position', () => {
      ((getBox as Function) as jest.Mock<{}>).mockReturnValue({
        contentBox: {
          left: 120,
        },
        borderBox: {
          left: 120,
        },
      });
      const instance = mount<Tree>(
        <Tree tree={treeWithTwoBranches} renderItem={mockRender} />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onPointerMove();
      expect(instance.dragState).toEqual({
        source: dragStart.source,
        destination: dragStart.source,
        mode: dragStart.mode,
        horizontalLevel: 1,
      });
    });
  });

  describe('#onDropAnimating', () => {
    it('stops expansion timer for hovered ', () => {
      const treeWithClosedParent = mutateTree(treeWithTwoBranches, '1-2', {
        isExpanded: false,
      });
      const onExpand = jest.fn();
      const instance = mount<Tree>(
        <Tree
          tree={treeWithClosedParent}
          renderItem={mockRender}
          onExpand={onExpand}
        />,
      ).instance();
      instance.onDragStart(dragStart);
      instance.onDragUpdate({
        ...dragUpdate,
        combine: {
          draggableId: '1-2',
          droppableId: '',
        },
        destination: undefined,
      });
      instance.onDropAnimating();

      jest.runAllTimers();

      expect(onExpand).not.toHaveBeenCalled();
    });
  });

  describe('#onDragEnd', () => {
    it('calls props.onDragEnd when drag ends successfully', () => {
      const mockOnDragEnd = jest.fn();
      const instance = mount<Tree>(
        <Tree
          tree={treeWithTwoBranches}
          renderItem={mockRender}
          onDragEnd={mockOnDragEnd}
        />,
      ).instance();
      instance.onDragEnd(dropResult);
      expect(mockOnDragEnd).toHaveBeenCalledTimes(1);
      expect(mockOnDragEnd).toBeCalledWith(
        { parentId: '1-1', index: 0 },
        { parentId: '1-2', index: 1 },
      );
    });

    it('calls props.onDragEnd when nesting successfully', () => {
      const mockOnDragEnd = jest.fn();
      const instance = mount<Tree>(
        <Tree
          tree={treeWithTwoBranches}
          renderItem={mockRender}
          onDragEnd={mockOnDragEnd}
        />,
      ).instance();
      const dropResultWithCombine = {
        ...dropResult,
        destination: undefined,
        combine: {
          draggableId: '1-2',
          droppableId: 'list',
        },
      };
      instance.onDragEnd(dropResultWithCombine);
      expect(mockOnDragEnd).toHaveBeenCalledTimes(1);
      expect(mockOnDragEnd).toBeCalledWith(
        { parentId: '1-1', index: 0 },
        { parentId: '1-2' },
      );
    });
  });
});
