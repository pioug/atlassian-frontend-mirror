import React from 'react';

import {
	ADD_BLOCKS_MENU_SECTION,
	MOVE_UP_MENU_ITEM,
	MOVE_UP_DOWN_MENU_SECTION,
	MOVE_DOWN_MENU_ITEM,
	MOVE_BLOCK_SECTION_RANK,
	PRIMARY_MENU_SECTION,
	BLOCK_MENU_SECTION_RANK,
	COPY_MENU_SECTION,
	COPY_BLOCK_MENU_ITEM,
	COPY_MENU_SECTION_RANK,
	COPY_LINK_MENU_ITEM,
	DELETE_MENU_SECTION,
	DELETE_MENU_ITEM,
	DELETE_SECTION_RANK,
	NESTED_FORMAT_MENU_SECTION,
	NESTED_FORMAT_MENU,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	BlockMenuPlugin,
	BlockMenuPluginOptions,
	RegisterBlockMenuComponent,
} from '../blockMenuPluginType';

import CopyBlockMenuItem from './copy-block';
import { CopyLinkDropdownItem } from './copy-link';
import { CopySection } from './copy-section';
import { DeleteDropdownItem } from './delete-button';
import { DeleteSection } from './delete-section';
import { FormatMenuComponent } from './format-menu-nested';
import { FormatMenuSection } from './format-menu-section';
import { MoveDownDropdownItem } from './move-down';
import { MoveUpDropdownItem } from './move-up';

const getMoveUpMoveDownMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-item' as const,
			key: MOVE_UP_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: MOVE_UP_DOWN_MENU_SECTION.key,
				rank: MOVE_BLOCK_SECTION_RANK[MOVE_UP_MENU_ITEM.key],
			},
			component: () => <MoveUpDropdownItem api={api} />,
		},
		{
			type: 'block-menu-item' as const,
			key: MOVE_DOWN_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: MOVE_UP_DOWN_MENU_SECTION.key,
				rank: MOVE_BLOCK_SECTION_RANK[MOVE_DOWN_MENU_ITEM.key],
			},
			component: () => <MoveDownDropdownItem api={api} />,
		},
	];
};

const getFormatMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-nested' as const,
			key: NESTED_FORMAT_MENU.key,
			parent: {
				type: 'block-menu-section' as const,
				key: PRIMARY_MENU_SECTION.key,
				rank: 100,
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return <FormatMenuComponent api={api}>{children}</FormatMenuComponent>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: NESTED_FORMAT_MENU_SECTION.key,
			parent: {
				type: 'block-menu-nested' as const,
				key: NESTED_FORMAT_MENU.key,
				rank: 100,
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: PRIMARY_MENU_SECTION.key,
			rank: 100,
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
		...getFormatMenuComponents(api),
		...(expValEquals('platform_synced_block', 'isEnabled', true)
			? [
					{
						type: 'block-menu-section' as const,
						key: ADD_BLOCKS_MENU_SECTION.key,
						rank: BLOCK_MENU_SECTION_RANK[ADD_BLOCKS_MENU_SECTION.key],
						component: ({ children }: { children: React.ReactNode }) => (
							<ToolbarDropdownItemSection hasSeparator={true}>
								{children}
							</ToolbarDropdownItemSection>
						),
					},
				]
			: []),
		{
			type: 'block-menu-section',
			key: COPY_MENU_SECTION.key,
			rank: BLOCK_MENU_SECTION_RANK[COPY_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => (
				<CopySection api={api}>{children}</CopySection>
			),
		},
		{
			type: 'block-menu-item',
			key: COPY_BLOCK_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section',
				key: COPY_MENU_SECTION.key,
				rank: COPY_MENU_SECTION_RANK[COPY_BLOCK_MENU_ITEM.key],
			},
			component: () => {
				return <CopyBlockMenuItem api={api} />;
			},
		},
		{
			type: 'block-menu-item' as const,
			key: COPY_LINK_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: COPY_MENU_SECTION.key,
				rank: COPY_MENU_SECTION_RANK[COPY_LINK_MENU_ITEM.key],
			},
			component: () => <CopyLinkDropdownItem api={api} config={config} />,
		},
		{
			type: 'block-menu-section' as const,
			key: MOVE_UP_DOWN_MENU_SECTION.key,
			rank: BLOCK_MENU_SECTION_RANK[MOVE_UP_DOWN_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: DELETE_MENU_SECTION.key,
			rank: BLOCK_MENU_SECTION_RANK[DELETE_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <DeleteSection api={api}>{children}</DeleteSection>;
			},
		},
		...getMoveUpMoveDownMenuComponents(api),
		{
			type: 'block-menu-item' as const,
			key: DELETE_MENU_ITEM.key,
			parent: {
				type: 'block-menu-section' as const,
				key: DELETE_MENU_SECTION.key,
				rank: DELETE_SECTION_RANK[DELETE_MENU_ITEM.key],
			},
			component: () => <DeleteDropdownItem api={api} />,
		},
	];
};
