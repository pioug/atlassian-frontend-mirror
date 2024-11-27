import React, { Component, type KeyboardEvent } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/utility/migration/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/utility/migration/chevron-right';
import Tree, {
	mutateTree,
	type RenderItemParams,
	type TreeItem,
	type TreeData,
	type ItemId,
} from '../src';
import { treeWithTwoBranches } from '../mockdata/treeWithTwoBranches';

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
			return item.isExpanded ? (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<div role="button" tabIndex={0} onClick={() => onCollapse(item.id)}>
					<ChevronDownIcon color="currentColor" label="" LEGACY_size="medium" />
				</div>
			) : (
				// eslint-disable-next-line jsx-a11y/click-events-have-key-events
				<div role="button" tabIndex={0} onClick={() => onExpand(item.id)}>
					<ChevronRightIcon color="currentColor" label="" LEGACY_size="medium" />
				</div>
			);
		}

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
