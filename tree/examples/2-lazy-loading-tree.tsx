import React, { Component } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';
import Tree, {
  mutateTree,
  RenderItemParams,
  TreeItem,
  TreeData,
  ItemId,
} from '../src';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';

const Container = styled.div`
  display: flex;
`;

const Dot = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

const SpinnerContainer = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

type State = {
  tree: TreeData;
};

export default class LazyTree extends Component<void, State> {
  state = {
    tree: mutateTree(treeWithTwoBranches, '1-1', { isExpanded: false }),
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
    if (item.hasChildren) {
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

  componentWillUnmount() {
    window.clearTimeout(this.expandTimeoutId);
  }

  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => (
    <div ref={provided.innerRef} {...provided.draggableProps}>
      <AkNavigationItem
        text={item.data ? item.data.title : ''}
        icon={LazyTree.getIcon(item, onExpand, onCollapse)}
        dnd={{ dragHandleProps: provided.dragHandleProps }}
      />
    </div>
  );

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

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, {
        isExpanded: false,
        isChildrenLoading: false,
      }),
    });
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
          />
        </Navigation>
      </Container>
    );
  }
}
