/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useContext, useEffect, useState } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import { MenuList } from '@atlaskit/navigation-system';
import { useMenuItemDragAndDrop } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';
import {
	FlyoutMenuItem,
	FlyoutMenuItemContent,
	FlyoutMenuItemTrigger,
} from '@atlaskit/navigation-system/side-nav-items/flyout-menu-item';

import { getTopLevelItemData, isTopLevelItemData, type TTopLevelItem } from './data';
import { RegistryContext } from './registry';
import { ReorderActionMenu } from './reorder-actions';
import { useDispatch } from './state-context';

// A shared top level menu item flyout implementation to avoid
// duplicating this shared code
export function SharedTopLevelFlyout({
	value,
	label,
	icon,
	index,
	amountOfMenuItems,
	testId,
}: {
	value: TTopLevelItem;
	label: string;
	icon: ReactNode;
	index: number;
	amountOfMenuItems: number;
	testId?: string;
}) {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getTopLevelItemData(value),
				getDragPreviewPieces: () => ({
					elemBefore: icon,
					content: label,
				}),
			},
			dropTarget: {
				getData: () => getTopLevelItemData(value),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isTopLevelItemData(source.data),
			},
		});
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const dispatch = useDispatch();

	// Close flyout if dragging
	useEffect(() => {
		if (state.type === 'dragging') {
			setIsOpen(false);
		}
	}, [state.type, isOpen, setIsOpen]);

	const registry = useContext(RegistryContext);
	useEffect(() => {
		const element = draggableButtonRef.current;
		invariant(element);
		return registry?.registerTopLevelItem({ item: value, element });
	}, [draggableButtonRef, registry, value]);

	return (
		<>
			<FlyoutMenuItem isOpen={isOpen}>
				<FlyoutMenuItemTrigger
					elemBefore={icon}
					ref={draggableButtonRef}
					onClick={() => setIsOpen((current) => !current)}
					isDragging={state.type === 'dragging'}
					hasDragIndicator
					dropIndicator={dropIndicator}
					visualContentRef={dropTargetRef}
					testId={testId}
				>
					{label}
				</FlyoutMenuItemTrigger>
				<FlyoutMenuItemContent onClose={() => setIsOpen(false)}>
					<MenuList>
						<ReorderActionMenu
							label="Reorder menu item"
							index={index}
							listSize={amountOfMenuItems}
							onMoveToTop={() => {
								dispatch({
									type: 'top-level-menu-reorder',
									trigger: 'keyboard',
									value: value,
									startIndex: index,
									finishIndex: 0,
								});
								setIsOpen(false);
							}}
							onMoveUp={() => {
								dispatch({
									type: 'top-level-menu-reorder',
									trigger: 'keyboard',
									value: value,
									startIndex: index,
									finishIndex: index - 1,
								});
								setIsOpen(false);
							}}
							onMoveDown={() => {
								dispatch({
									type: 'top-level-menu-reorder',
									trigger: 'keyboard',
									value: value,
									startIndex: index,
									finishIndex: index + 1,
								});
								setIsOpen(false);
							}}
							onMoveToBottom={() => {
								dispatch({
									type: 'top-level-menu-reorder',
									trigger: 'keyboard',
									value: value,
									startIndex: index,
									finishIndex: amountOfMenuItems - 1,
								});
								setIsOpen(false);
							}}
						/>
					</MenuList>
				</FlyoutMenuItemContent>
			</FlyoutMenuItem>
			{dragPreview}
		</>
	);
}
