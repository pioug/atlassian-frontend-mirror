import React from 'react';

import {
	BLOCK_ACTIONS_COPY_LINK_TO_BLOCK_MENU_ITEM,
	BLOCK_ACTIONS_MENU_SECTION,
	BLOCK_ACTIONS_MENU_SECTION_RANK,
	DELETE_MENU_SECTION,
	DELETE_MENU_SECTION_RANK,
	DELETE_MENU_ITEM,
	POSITION_MENU_SECTION,
	POSITION_MENU_SECTION_RANK,
	POSITION_MOVE_DOWN_MENU_ITEM,
	POSITION_MOVE_UP_MENU_ITEM,
	TRANSFORM_MENU_ITEM,
	TRANSFORM_MENU_ITEM_RANK,
	TRANSFORM_MENU_SECTION,
	TRANSFORM_MENU_SECTION_RANK,
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_SUGGESTED_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION,
	TRANSFORM_HEADINGS_MENU_SECTION,
	MAIN_BLOCK_MENU_SECTION_RANK,
	TRANSFORM_SUGGESTED_MENU_SECTION_RANK,
	TRANSFORM_SUGGESTED_MENU_ITEM,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type {
	BlockMenuPlugin,
	BlockMenuPluginOptions,
	RegisterBlockMenuComponent,
} from '../blockMenuPluginType';

import { CopyLinkDropdownItem } from './copy-link';
import { CopySection } from './copy-section';
import { DeleteDropdownItem } from './delete-button';
import { DeleteSection } from './delete-section';
import { FormatMenuComponent } from './format-menu-nested';
import { FormatMenuSection } from './format-menu-section';
import { MoveDownDropdownItem } from './move-down';
import { MoveUpDropdownItem } from './move-up';
import { SuggestedItemsMenuSection } from './suggested-items-menu-section';
import { SuggestedMenuItems } from './suggested-menu-items';
import { createMenuItemsMap } from './utils/createMenuItemsMap';
import { getSuggestedItemsFromSelection } from './utils/getSuggestedItemsFromSelection';

const getMoveUpMoveDownMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item' as const,
			key: POSITION_MOVE_UP_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: POSITION_MENU_SECTION.key,
				rank: POSITION_MENU_SECTION_RANK[POSITION_MOVE_UP_MENU_ITEM.key],
			},
			component: () => <MoveUpDropdownItem api={api} />,
		},
		{
			type: 'block-menu-item' as const,
			key: POSITION_MOVE_DOWN_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: POSITION_MENU_SECTION.key,
				rank: POSITION_MENU_SECTION_RANK[POSITION_MOVE_DOWN_MENU_ITEM.key],
			},
			component: () => <MoveDownDropdownItem api={api} />,
		},
	];
};

const getTurnIntoMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-nested' as const,
			key: TRANSFORM_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_MENU_SECTION.key,
				rank: TRANSFORM_MENU_SECTION_RANK[TRANSFORM_MENU_ITEM.key],
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return <FormatMenuComponent api={api}>{children}</FormatMenuComponent>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: TRANSFORM_SUGGESTED_MENU_SECTION.key,
			parent: {
				type: 'block-menu-nested' as const,
				key: TRANSFORM_MENU_ITEM.key,
				rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_SUGGESTED_MENU_SECTION.key],
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => (
				<SuggestedItemsMenuSection api={api}>{children}</SuggestedItemsMenuSection>
			),
		},
		{
			type: 'block-menu-item' as const,
			key: TRANSFORM_SUGGESTED_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: TRANSFORM_SUGGESTED_MENU_SECTION.key,
				rank: TRANSFORM_SUGGESTED_MENU_SECTION_RANK[TRANSFORM_SUGGESTED_MENU_ITEM.key],
			},
			component: () => <SuggestedMenuItems api={api} />,
			isHidden: () => {
				const blockMenuComponents = api?.blockMenu?.actions.getBlockMenuComponents();
				const menuItemsMap = createMenuItemsMap(blockMenuComponents);
				const selection = api?.selection?.sharedState.currentState()?.selection;
				const preservedSelection =
					api?.blockControls?.sharedState.currentState()?.preservedSelection;
				const currentSelection = preservedSelection || selection;
				const suggestedItems = getSuggestedItemsFromSelection(menuItemsMap, currentSelection);
				return suggestedItems.length === 0;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: TRANSFORM_CREATE_MENU_SECTION.key,
			parent: {
				type: 'block-menu-nested' as const,
				key: TRANSFORM_MENU_ITEM.key,
				rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_CREATE_MENU_SECTION.key],
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return <ToolbarDropdownItemSection title="Create">{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: TRANSFORM_STRUCTURE_MENU_SECTION.key,
			parent: {
				type: 'block-menu-nested' as const,
				key: TRANSFORM_MENU_ITEM.key,
				rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_STRUCTURE_MENU_SECTION.key],
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return (
					<ToolbarDropdownItemSection title="Structure">{children}</ToolbarDropdownItemSection>
				);
			},
		},
		{
			type: 'block-menu-section' as const,
			key: TRANSFORM_HEADINGS_MENU_SECTION.key,
			parent: {
				type: 'block-menu-nested' as const,
				key: TRANSFORM_MENU_ITEM.key,
				rank: TRANSFORM_MENU_ITEM_RANK[TRANSFORM_HEADINGS_MENU_SECTION.key],
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return (
					<ToolbarDropdownItemSection title="Headings" hasSeparator>
						{children}
					</ToolbarDropdownItemSection>
				);
			},
		},
		{
			type: 'block-menu-section' as const,
			key: TRANSFORM_MENU_SECTION.key,
			rank: MAIN_BLOCK_MENU_SECTION_RANK[TRANSFORM_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <FormatMenuSection api={api}>{children}</FormatMenuSection>;
			},
		},
	];
};

export const getBlockMenuComponents = ({
	api,
	config,
}: {
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined;
	config: BlockMenuPluginOptions | undefined;
}): RegisterBlockMenuComponent[] => {
	return [
		...getTurnIntoMenuComponents(api),
		{
			type: 'block-menu-section',
			key: BLOCK_ACTIONS_MENU_SECTION.key,
			rank: MAIN_BLOCK_MENU_SECTION_RANK[BLOCK_ACTIONS_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => (
				<CopySection api={api}>{children}</CopySection>
			),
		},
		{
			type: 'block-menu-item' as const,
			key: BLOCK_ACTIONS_COPY_LINK_TO_BLOCK_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: BLOCK_ACTIONS_MENU_SECTION.key,
				rank: BLOCK_ACTIONS_MENU_SECTION_RANK[BLOCK_ACTIONS_COPY_LINK_TO_BLOCK_MENU_ITEM.key],
			},
			component: () => <CopyLinkDropdownItem api={api} config={config} />,
		},
		{
			type: 'block-menu-section' as const,
			key: POSITION_MENU_SECTION.key,
			rank: MAIN_BLOCK_MENU_SECTION_RANK[POSITION_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		...getMoveUpMoveDownMenuComponents(api),
		{
			type: 'block-menu-section' as const,
			key: DELETE_MENU_SECTION.key,
			rank: MAIN_BLOCK_MENU_SECTION_RANK[DELETE_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <DeleteSection>{children}</DeleteSection>;
			},
		},
		{
			type: 'block-menu-item' as const,
			key: DELETE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: DELETE_MENU_SECTION.key,
				rank: DELETE_MENU_SECTION_RANK[DELETE_MENU_ITEM.key],
			},
			component: () => <DeleteDropdownItem api={api} />,
		},
	];
};
