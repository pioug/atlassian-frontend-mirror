import React, { Component } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import Button from '@atlaskit/button/new';

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
const Container = styled.div({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Dot = styled.span({
	display: 'flex',
	width: '24px',
	height: '32px',
	justifyContent: 'center',
	fontSize: '12px',
	lineHeight: '32px',
});

type State = {
	tree: TreeData;
};

export default class DragDropTree extends Component<void, State> {
	state = {
		tree: complexTree,
	};

	static getIcon(
		item: TreeItem,
		onExpand: (itemId: ItemId) => void,
		onCollapse: (itemId: ItemId) => void,
	) {
		if (item.children && item.children.length > 0) {
			return item.isExpanded ? (
				<Button appearance="subtle" onClick={() => onCollapse(item.id)}>
					<ChevronDownIcon color="currentColor" label="" />
				</Button>
			) : (
				<Button appearance="subtle" onClick={() => onExpand(item.id)}>
					<ChevronRightIcon color="currentColor" label="" />
				</Button>
			);
		}
		return <Dot>&bull;</Dot>;
	}

	renderItem = ({ item, onExpand, onCollapse, provided, snapshot }: RenderItemParams) => {
		return (
			<div ref={provided.innerRef} {...provided.draggableProps}>
				<AkNavigationItem
					isDragging={snapshot.isDragging}
					text={item.data ? item.data.title : ''}
					icon={DragDropTree.getIcon(item, onExpand, onCollapse)}
					dnd={{ dragHandleProps: provided.dragHandleProps }}
				/>
			</div>
		);
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

	onDragEnd = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
		const { tree } = this.state;

		if (!destination) {
			return;
		}

		const newTree = moveItemOnTree(tree, source, destination);
		this.setState({
			tree: newTree,
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
						onDragEnd={this.onDragEnd}
						isDragEnabled
					/>
				</Navigation>
			</Container>
		);
	}
}
