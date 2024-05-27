import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import Button from '@atlaskit/button/standard-button';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';
import Tree, {
  mutateTree,
  moveItemOnTree,
  type RenderItemParams,
  type TreeItem,
  type TreeData,
  type ItemId,
  type TreeSourcePosition,
  type TreeDestinationPosition,
} from '../src';
import { complexTree } from '../mockdata/complexTree';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div`
  display: flex;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Dot = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SpinnerContainer = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: ${token('space.100', '8px')};
`;

type State = {
  tree: TreeData;
};

const DRAGGABLE_ITEM_ID = '1-0';

export default class DragDropWithNestingTree extends Component<void, State> {
  state = {
    tree: complexTree,
  };

  private expandTimeoutId: number | undefined;

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
    if (item.isChildrenLoading) {
      return (
        <SpinnerContainer onClick={() => onCollapse(item.id)}>
          <Spinner size={16} />
        </SpinnerContainer>
      );
    }
    if (item.id === DRAGGABLE_ITEM_ID) {
      return <DragHandlerIcon label="" size="medium" />;
    }

    if (item.children && item.children.length > 0) {
      return item.isExpanded ? (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onCollapse(item.id)}
        >
          <ChevronDownIcon label="" size="medium" />
        </Button>
      ) : (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onExpand(item.id)}
        >
          <ChevronRightIcon label="" size="medium" />
        </Button>
      );
    }
    return <Dot>&bull;</Dot>;
  }

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
  }: RenderItemParams) => {
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <AkNavigationItem
          isDragging={snapshot.isDragging}
          text={item.data ? item.data.title : ''}
          icon={DragDropWithNestingTree.getIcon(item, onExpand, onCollapse)}
          dnd={{ dragHandleProps: provided.dragHandleProps }}
        />
      </div>
    );
  };

  // Lazy loaded example by emulating a fake long lasting request to server
  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;

    // 1. Marking the expanded item with `isChildrenLoading` flag
    this.setState({
      tree: mutateTree(tree, itemId, { isChildrenLoading: true }),
    });

    // 2. Setting up a timeout to emulate an async server request
    this.expandTimeoutId = window.setTimeout(() => {
      // 3. When the request comes back we can mutate the tree.
      //    It's important to get a fresh reference from the state.
      const freshTree = this.state.tree;
      const currentItem: TreeItem = freshTree.items[itemId];
      if (currentItem.isChildrenLoading) {
        // 4. Good to check if it's still loading. Loading is cancelled by collapsing the same item in this example.
        this.setState({
          // 5. Mutating the tree to expand and removing the loading indicator.
          tree: mutateTree(freshTree, itemId, {
            isExpanded: true,
            isChildrenLoading: false,
          }),
        });
      }
    }, 2000);
  };

  componentWillUnmount() {
    window.clearTimeout(this.expandTimeoutId);
  }

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
    });
  };

  onDragEnd = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition,
  ) => {
    const { tree } = this.state;

    if (!destination) {
      return;
    }

    const newTree = moveItemOnTree(tree, source, destination);
    newTree.items[destination.parentId].isExpanded = true;
    this.setState({
      tree: newTree,
    });
  };

  isDragEnabled = (item: TreeItem) => {
    if (item.id === DRAGGABLE_ITEM_ID) {
      return true;
    }

    return false;
  };

  render() {
    const { tree } = this.state;

    return (
      <Container>
        <Navigation>
          <Tree
            tree={tree}
            renderItem={this.renderItem}
            onExpand={this.onExpand}
            onCollapse={this.onCollapse}
            onDragEnd={this.onDragEnd}
            isDragEnabled={this.isDragEnabled}
            isNestingEnabled={true}
          />
        </Navigation>
      </Container>
    );
  }
}
