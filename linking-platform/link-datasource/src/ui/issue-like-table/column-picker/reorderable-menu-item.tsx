/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import DragHandleVerticalIcon from '@atlaskit/icon/core/drag-handle-vertical';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/attach-closest-edge';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge/extract-closest-edge';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import {
	draggable,
	dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/utils/combine';
import { Box } from '@atlaskit/primitives/compiled/box';
import { CheckboxOption } from '@atlaskit/select/checkbox-option';
import type { OptionProps, OptionType } from '@atlaskit/select/types';
import { token } from '@atlaskit/tokens';

import { useColumnPickerInstanceId } from './column-picker-instance';
import {
	COLUMN_PICKER_DRAG_TYPE,
	type ColumnPickerDropZone,
	isColumnPickerDragDataFor,
} from './drag-data';
import { useUnselectedDropTarget } from './use-unselected-drop-target';

const listItemStyles = cssMap({
	root: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.pressed'),
		},
	},
	withDragHandle: {
		paddingInlineStart: token('space.500'),
	},
	dragging: {
		opacity: token('opacity.disabled'),
	},
});

const dragHandleStyles = cssMap({
	container: {
		position: 'relative',
	},
	// Sits over the option's leading padding as a sibling, so clicking it doesn't toggle the option
	handle: {
		display: 'flex',
		position: 'absolute',
		alignItems: 'center',
		cursor: 'grab',
		insetBlockEnd: token('space.0'),
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.200'),
	},
});

const SELECTED_ZONE: ColumnPickerDropZone = 'selected';

const stopPropagation = (event: Event) => event.stopPropagation();

const SelectedMenuItem = ({ children, ...props }: OptionProps<OptionType, true>): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	const dragHandleRef = useRef<HTMLSpanElement>(null);
	const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const value = props.data.value as string;
	// Reordering a filtered list is ambiguous, so only allow it while not searching
	const canDrag = !props.selectProps.inputValue;
	const pickerId = useColumnPickerInstanceId();

	useEffect(() => {
		const element = ref.current;
		const dragHandle = dragHandleRef.current;
		if (!element || !dragHandle || !pickerId) {
			return;
		}

		// react-select prevents default on menu mousedown, which would stop the native drag from starting
		dragHandle.addEventListener('mousedown', stopPropagation);

		return combine(
			() => dragHandle.removeEventListener('mousedown', stopPropagation),
			draggable({
				element,
				dragHandle,
				canDrag: () => canDrag,
				getInitialData: () => ({ type: COLUMN_PICKER_DRAG_TYPE, value, pickerId }),
				onDragStart: () => setIsDragging(true),
				onDrop: () => setIsDragging(false),
			}),
			dropTargetForElements({
				element,
				canDrop: ({ source }) => isColumnPickerDragDataFor(source.data, pickerId),
				getData: ({ input, element }) =>
					attachClosestEdge(
						{ type: COLUMN_PICKER_DRAG_TYPE, zone: SELECTED_ZONE, value, pickerId },
						{ input, element, allowedEdges: ['top', 'bottom'] },
					),
				onDrag: ({ self, source }) =>
					setClosestEdge(source.data.value === value ? null : extractClosestEdge(self.data)),
				onDragLeave: () => setClosestEdge(null),
				onDrop: () => setClosestEdge(null),
			}),
		);
	}, [value, canDrag, pickerId]);

	return (
		<Box ref={ref} xcss={dragHandleStyles.container}>
			<Box
				as="span"
				ref={dragHandleRef}
				xcss={dragHandleStyles.handle}
				testId="column-picker-drag-handle"
			>
				<DragHandleVerticalIcon label="" color={token('color.icon.subtle')} />
			</Box>
			<CheckboxOption
				css={[
					listItemStyles.root,
					listItemStyles.withDragHandle,
					isDragging && listItemStyles.dragging,
				]}
				{...props}
			>
				{children}
			</CheckboxOption>
			{closestEdge && <DropIndicator edge={closestEdge} />}
		</Box>
	);
};

const UnselectedMenuItem = ({ children, ...props }: OptionProps<OptionType, true>): JSX.Element => {
	const ref = useRef<HTMLDivElement>(null);
	useUnselectedDropTarget(ref);

	return (
		<Box ref={ref}>
			<CheckboxOption css={listItemStyles.root} {...props}>
				{children}
			</CheckboxOption>
		</Box>
	);
};

export const ReorderableMenuItem = ({
	children,
	...props
}: OptionProps<OptionType, true>): JSX.Element => {
	if (!props.isSelected) {
		return <UnselectedMenuItem {...props}>{children}</UnselectedMenuItem>;
	}

	return <SelectedMenuItem {...props}>{children}</SelectedMenuItem>;
};
