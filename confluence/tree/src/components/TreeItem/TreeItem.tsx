import { Component } from 'react';
// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
	type DraggableProvidedDraggableProps,
	type DraggableStateSnapshot,
} from 'react-beautiful-dnd-next';
import { isSamePath } from '../../utils/path';
import { sameProps } from '../../utils/react';
import { type Props, type TreeDraggableProvided } from './TreeItem-types';

export default class TreeItem extends Component<Props> {
	shouldComponentUpdate(nextProps: Props) {
		return (
			!sameProps(this.props, nextProps, [
				'item',
				'provided',
				'snapshot',
				'onCollapse',
				'onExpand',
			]) ||
			!isSamePath(this.props.path, nextProps.path) ||
			// also rerender tree item even if the item is not draggable, this allows draggable/nondraggable items to behave the same
			this.props.provided.dragHandleProps === null
		);
	}

	patchDraggableProps = (
		draggableProps: DraggableProvidedDraggableProps,
		snapshot: DraggableStateSnapshot,
	): DraggableProvidedDraggableProps => {
		const { path, offsetPerLevel } = this.props;

		const transitions =
			draggableProps.style && draggableProps.style.transition
				? [draggableProps.style.transition]
				: [];
		if (snapshot.dropAnimation) {
			transitions.push(
				// @ts-ignore
				`padding-left ${snapshot.dropAnimation.duration}s ${snapshot.dropAnimation.curve}`,
			);
		}
		const transition = transitions.join(', ');

		return {
			...draggableProps,
			style: {
				...draggableProps.style,
				paddingLeft: (path.length - 1) * offsetPerLevel,
				// @ts-ignore
				transition,
			},
		};
	};

	render() {
		const { item, path, onExpand, onCollapse, renderItem, provided, snapshot, itemRef } =
			this.props;

		const innerRef = (el: HTMLElement | null) => {
			itemRef(item.id, el);
			provided.innerRef(el);
		};

		const finalProvided: TreeDraggableProvided = {
			draggableProps: this.patchDraggableProps(provided.draggableProps, snapshot),
			dragHandleProps: provided.dragHandleProps,
			innerRef,
		};

		return renderItem({
			item,
			depth: path.length - 1,
			onExpand: (itemId) => onExpand(itemId, path),
			onCollapse: (itemId) => onCollapse(itemId, path),
			provided: finalProvided,
			snapshot,
		});
	}
}
