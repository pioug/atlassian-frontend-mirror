import React, { Component, KeyboardEvent } from 'react';
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
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

type State = {
  tree: TreeData;
};

export default class StaticTree extends Component<void, State> {
  state = {
    tree: treeWithTwoBranches,
  };

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) {
    if (item.hasChildren) {
      /* eslint-disable jsx-a11y/click-events-have-key-events */
      return item.isExpanded ? (
        <div role="button" tabIndex={0} onClick={() => onCollapse(item.id)}>
          <ChevronDownIcon label="" size="medium" />
        </div>
      ) : (
        <div role="button" tabIndex={0} onClick={() => onExpand(item.id)}>
          <ChevronRightIcon label="" size="medium" />
        </div>
      );
    }
    /* eslint-enable jsx-a11y/click-events-have-key-events */

    return <Dot>&bull;</Dot>;
  }

  renderItem = ({ item, onExpand, onCollapse, provided }: RenderItemParams) => (
    <div ref={provided.innerRef} {...provided.draggableProps}>
      <AkNavigationItem
        text={item.data ? item.data.title : ''}
        icon={StaticTree.getIcon(item, onExpand, onCollapse)}
        onKeyDown={(event: KeyboardEvent<HTMLElement>) =>
          this.onKeyDown(event, item, onExpand, onCollapse)
        }
        dnd={{ dragHandleProps: provided.dragHandleProps }}
      />
    </div>
  );

  onKeyDown = (
    event: KeyboardEvent,
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void,
  ) => {
    if (event.key === 'Enter' && item.hasChildren) {
      if (item.isExpanded) {
        onCollapse(item.id);
      } else {
        onExpand(item.id);
      }
    }
  };

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: true }),
    });
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isExpanded: false }),
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
