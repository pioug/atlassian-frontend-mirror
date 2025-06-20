/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext, useEffect } from 'react';

import { jsx } from '@compiled/react';
import invariant from 'tiny-invariant';

import PersonAvatarIcon from '@atlaskit/icon/core/person-avatar';
import { ButtonMenuItem } from '@atlaskit/navigation-system/side-nav-items/button-menu-item';
import { useMenuItemDragAndDrop } from '@atlaskit/navigation-system/side-nav-items/drag-and-drop/use-menu-item-drag-and-drop';

import { getTopLevelItemData, isTopLevelItemData } from '../data';
import { RegistryContext } from '../registry';
import { TopLevelSharedMoreMenu } from '../top-level-shared-more-menu';

export function ForYouMenuItem({
	index,
	amountOfMenuItems,
}: {
	index: number;
	amountOfMenuItems: number;
}) {
	const { state, draggableButtonRef, dragPreview, dropTargetRef, dropIndicator } =
		useMenuItemDragAndDrop({
			draggable: {
				getInitialData: () => getTopLevelItemData('for-you'),
				getDragPreviewPieces: () => ({
					elemBefore: <PersonAvatarIcon label="" />,
					content: 'For you',
				}),
			},
			dropTarget: {
				getData: () => getTopLevelItemData('for-you'),
				getOperations: () => ({
					'reorder-after': 'available',
					'reorder-before': 'available',
				}),
				canDrop: ({ source }) => isTopLevelItemData(source.data),
			},
		});
	const registry = useContext(RegistryContext);

	useEffect(() => {
		const element = draggableButtonRef.current;
		invariant(element);
		return registry?.registerTopLevelItem({ item: 'for-you', element });
	}, [draggableButtonRef, registry]);

	return (
		<>
			<ButtonMenuItem
				ref={draggableButtonRef}
				isDragging={state.type === 'dragging'}
				hasDragIndicator
				dropIndicator={dropIndicator}
				visualContentRef={dropTargetRef}
				elemBefore={<PersonAvatarIcon label="" />}
				actionsOnHover={
					<TopLevelSharedMoreMenu
						value={'for-you'}
						index={index}
						amountOfMenuItems={amountOfMenuItems}
					/>
				}
			>
				For you
			</ButtonMenuItem>
			{dragPreview}
		</>
	);
}
