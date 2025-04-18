import React, { Component } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';
import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/utility/chevron-right';
import Tree, { type RenderItemParams, type TreeItem } from '../src';
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

export default class StaticTree extends Component {
	static getIcon(item: TreeItem) {
		if (item.children && item.children.length > 0) {
			return item.isExpanded ? (
				<ChevronDownIcon color="currentColor" label="" />
			) : (
				<ChevronRightIcon color="currentColor" label="" />
			);
		}
		return <Dot>&bull;</Dot>;
	}

	renderItem = ({ item, provided }: RenderItemParams) => (
		<div ref={provided.innerRef} {...provided.draggableProps}>
			<AkNavigationItem
				text={item.data ? item.data.title : ''}
				icon={StaticTree.getIcon(item)}
				dnd={{ dragHandleProps: provided.dragHandleProps }}
			/>
		</div>
	);

	render() {
		return (
			<Container>
				<Navigation>
					<Tree tree={treeWithTwoBranches} renderItem={this.renderItem} />
				</Navigation>
			</Container>
		);
	}
}
