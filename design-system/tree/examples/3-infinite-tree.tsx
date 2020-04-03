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
  Path,
} from '../src';
import { range } from '../src/utils/handy';

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

const addRandomChildren = (
  tree: TreeData,
  itemId: ItemId,
  path: Path,
  n: number,
): TreeData => {
  const newChildrenHash: Record<string, TreeItem> = {};
  range(n)
    .map(() => {
      return {
        id: Math.random(),
        children: [],
        hasChildren: true,
        isExpanded: false,
        isChildrenLoading: false,
        data: { title: `Title ${path.length}` },
      };
    })
    .forEach(c => {
      newChildrenHash[c.id] = c;
    });
  const newChildren = [
    ...tree.items[itemId].children,
    ...Object.keys(newChildrenHash),
  ];
  const newTree = {
    rootId: tree.rootId,
    items: {
      ...tree.items,
      ...newChildrenHash,
    },
  };
  return mutateTree(newTree, itemId, { children: newChildren });
};

const starterTree = {
  rootId: '1',
  items: {
    '1': {
      id: '1',
      children: [],
      hasChildren: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {},
    },
  },
};

export default class InfiniteTree extends Component<void, State> {
  state = {
    tree: addRandomChildren(starterTree, starterTree.rootId, [], 20),
  };

  static getIcon(
    item: TreeItem,
    onExpand: (item: ItemId) => void,
    onCollapse: (item: ItemId) => void,
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

  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => {
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <AkNavigationItem
          text={item.data ? item.data.title : ''}
          icon={InfiniteTree.getIcon(item, onExpand, onCollapse)}
          dnd={{ dragHandleProps: provided.dragHandleProps }}
        />
      </div>
    );
  };

  onExpand = (itemId: ItemId, path: Path) => {
    const { tree }: State = this.state;
    const newTree = mutateTree(tree, itemId, { isExpanded: true });
    const newerTree = addRandomChildren(newTree, itemId, path, 20);
    this.setState({
      tree: newerTree,
    });
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
