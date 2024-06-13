/** @jsx jsx */
import React, { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
	DragDropContext,
	Draggable,
	Droppable,
	type DroppableProvided,
	type DropResult,
} from 'react-beautiful-dnd';

import Button from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
import InlineMessage from '@atlaskit/inline-message';
import { Box } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '../src';

interface CardProps {
	isActive?: boolean;
	isDraggable?: boolean;
	isDragging?: boolean;
	isHovering?: boolean;
	ref: (ref: HTMLElement | null) => any;
}

const baseCardStyles = css({
	display: 'flex',
	height: '20px',
	padding: `${token('space.100', '8px')} ${token('space.050', '4px')}`,
	position: 'relative',
	background: token('color.background.neutral'),

	borderBlockEnd: `1px solid ${token('color.border')}`,
	borderRadius: token('border.radius.100', '3px'),

	cursor: 'pointer',
	userSelect: 'none',

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':focus': {
		zIndex: 1,
		borderBlockEndColor: 'transparent',
	},
});

const draggingCardStyles = css({
	cursor: 'grabbing',
});

const hoverCardStyles = css({
	background: token('color.background.neutral.hovered'),
	textDecoration: 'none',
});

const activeCardStyles = css({
	background: token('color.background.neutral.pressed'),
});

const isMiddleClick = (event: React.MouseEvent) => event.button === 1;

interface Item {
	id: string;
	message: string;
}

interface ItemLineCardProps {
	item: Item;
	index: number;
	children: (
		isHovering: boolean,
		isActive: boolean,
		isFocused: boolean,
		item: Item,
	) => React.ReactNode;
	onClick: (item: Item, e?: any) => void;
}

function ItemLineCard(props: ItemLineCardProps) {
	const { onClick = noop, item, children, index } = props;
	const [isHovering, setIsHovering] = useState(false);
	const [isActive, setIsActive] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const propagateClick = (event: React.MouseEvent) => {
		event.persist();
		onClick(item, event);
	};

	const eventHandlers = {
		onBlur: () => setIsFocused(false),
		onClick: (event: React.MouseEvent) => {
			// Middle clicks are handled in onMouseDown
			// for cross browser support.
			if (!isMiddleClick(event)) {
				propagateClick(event);
			}
		},
		onFocus: () => setIsFocused(true),
		onMouseEnter: () => setIsHovering(true),
		onMouseLeave: () => {
			setIsActive(false);
			setIsHovering(false);
		},
		onMouseDown: (event: React.MouseEvent) => {
			if (isMiddleClick(event)) {
				propagateClick(event);
			}

			setIsActive(true);
		},
		onMouseUp: () => setIsActive(false),
	};

	const renderCard = (cardProps: CardProps) => {
		const innerIsActive = !!cardProps.isDragging || isActive;

		return (
			<div
				css={[
					baseCardStyles,
					cardProps.isDragging && draggingCardStyles,
					innerIsActive && activeCardStyles,
					isHovering && hoverCardStyles,
				]}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...cardProps}
			>
				{children(isHovering, innerIsActive, isFocused, item)}
			</div>
		);
	};

	return (
		<Draggable draggableId={item.id} index={index}>
			{(provided, snapshot) => (
				<div>
					{renderCard({
						ref: provided.innerRef,
						isDraggable: true,
						isDragging: snapshot.isDragging,
						...provided.draggableProps,
						...provided.dragHandleProps,
						...eventHandlers,
					})}
				</div>
			)}
		</Draggable>
	);
}

interface ItemLineCardGroupProps {
	groupId: string;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items: Item[];
	isReorderEnabled?: boolean;
	children: (
		isHovering: boolean,
		isActive: boolean,
		isFocused: boolean,
		item: Item,
	) => React.ReactNode;
	onOrderChange: (items: Item[], target: Item, sourceIndex: number, destIndex: number) => void;
	onClick: () => void;
}

function ItemLineCardGroup(props: ItemLineCardGroupProps) {
	const { onOrderChange = noop, onClick = noop, groupId, items: consumerItems, children } = props;

	const onDragEnd = (result: DropResult) => {
		const { source } = result;
		const { destination } = result;

		if (!destination || source.droppableId !== destination.droppableId) {
			return;
		}

		const items = [...consumerItems];
		const target = items.find((item) => item.id === result.draggableId);

		if (!target) {
			return;
		}

		// Move the dropped item into the correct spot
		items.splice(source.index, 1);
		items.splice(destination.index, 0, target);
		onOrderChange(items, target, source.index, destination.index);
	};

	const renderList = (props: { isDraggingOver: boolean; provided: DroppableProvided }) => {
		const { provided } = props;
		return (
			<div ref={provided.innerRef} {...provided.droppableProps}>
				{consumerItems.map((item, index) => (
					<ItemLineCard key={item.id} item={item} index={index} onClick={onClick}>
						{children}
					</ItemLineCard>
				))}
				{provided.placeholder}
			</div>
		);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={groupId}>
				{(provided, snapshot) =>
					renderList({
						isDraggingOver: snapshot.isDraggingOver,
						provided,
					})
				}
			</Droppable>
		</DragDropContext>
	);
}

const ITEMS = [...new Array(5).keys()].map((item) => ({
	id: `id-${item}`,
	message: `Line item card ${item}: `,
}));

function Wrapper() {
	const [items, setItems] = useState(() => [...ITEMS]);

	return (
		<ItemLineCardGroup
			groupId="test-group"
			items={items}
			onOrderChange={(updated) => {
				setItems([...updated]);
			}}
			isReorderEnabled
			onClick={() => console.log('on click')}
		>
			{(isHovering, isActive, isFocused, item) => (
				<div>
					<span>{item.message}</span>
					<span>
						isHovering=
						{isHovering.toString()}
					</span>
					<span>
						, isActive=
						{isActive.toString()}
					</span>
					<span>
						, isFocused=
						{isFocused.toString()}
					</span>
				</div>
			)}
		</ItemLineCardGroup>
	);
}

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<div>
			<Button appearance="primary" testId={'open-modal'} onClick={open}>
				Open Modal
			</Button>
			<p>
				We remove the transform css rule used for animating transitions after the enter animation
				occurs to work around an issue in react-beautiful-dnd where ancestor elements with a
				transform property cause dragging position issues. See AK-4328.
			</p>
			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close} testId={'my-modal'}>
						<ModalHeader>
							<ModalTitle>Drag and drop</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Box paddingBlockEnd="space.300">
								<InlineMessage appearance="info" title="Keyboard dragging instructions">
									<p>
										Navigate through the draggable items using the tab key to move forward through
										the tabbable items and shift + tab to move backwards. When a draggable element
										has focus press the spacebar key to start the drag.
									</p>
									<p>Once a drag is started, the following keyboard shortcuts can be used:</p>
									<ul>
										<li>Spacebar - drop the element</li>
										<li>Escape - cancel the drag</li>
										<li>Up arrow - move the element upwards</li>
										<li>Down arrow - move the element downwards</li>
									</ul>
								</InlineMessage>
							</Box>
							<Wrapper />
						</ModalBody>
						<ModalFooter>
							<Button appearance="primary" onClick={close}>
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
			</ModalTransition>
		</div>
	);
}
