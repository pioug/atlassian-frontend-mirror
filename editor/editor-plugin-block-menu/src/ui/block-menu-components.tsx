import React from 'react';

import {
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
import { ToolbarDropdownItemSection, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import type { BlockMenuPlugin, BlockMenuPluginOptions } from '../blockMenuPluginType';
import { type RegisterBlockMenuComponent } from '../blockMenuPluginType';

import CopyBlockMenuItem from './copy-block';
import { CopyLinkDropdownItem } from './copy-link';
import { DeleteDropdownItem } from './delete-button';
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

const getFormatMenuComponents = (): RegisterBlockMenuComponent[] => {
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
				return (
					<ToolbarNestedDropdownMenu
						text="Format"
						elemBefore={<ChangesIcon label="" />}
						elemAfter={<ChevronRightIcon label={'example nested menu'} />}
					>
						{children}
					</ToolbarNestedDropdownMenu>
				);
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
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
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
		...(fg('platform_editor_block_menu_format') ? getFormatMenuComponents() : []),

		{
			type: 'block-menu-section',
			key: COPY_MENU_SECTION.key,
			rank: BLOCK_MENU_SECTION_RANK[COPY_MENU_SECTION.key],
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
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
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
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
