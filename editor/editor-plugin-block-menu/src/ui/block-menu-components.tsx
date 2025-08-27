import React from 'react';

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
			key: 'block-menu-item-move-up',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-move-up-down',
				rank: 100,
			},
			component: () => <MoveUpDropdownItem api={api} />,
		},
		{
			type: 'block-menu-item' as const,
			key: 'block-menu-item-move-down',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-move-up-down',
				rank: 200,
			},
			component: () => <MoveDownDropdownItem api={api} />,
		},
	];
};

const getFormatMenuComponents = (): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-nested' as const,
			key: 'nested-menu-format',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-primary',
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
			key: 'nested-menu-format-section-primary',
			parent: {
				type: 'block-menu-nested' as const,
				key: 'nested-menu-format',
				rank: 100,
			},
			component: ({ children }: { children: React.ReactNode } = { children: null }) => {
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
			type: 'block-menu-section' as const,
			key: 'block-menu-section-primary',
			rank: 100,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section',
			key: 'block-menu-section-copy',
			rank: 200,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-item',
			key: 'block-menu-copy-block',
			parent: { type: 'block-menu-section', key: 'block-menu-section-copy', rank: 200 },
			component: () => {
				return <CopyBlockMenuItem api={api} />;
			},
		},
		{
			type: 'block-menu-item' as const,
			key: 'block-menu-item-copy-link',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-copy',
				rank: 100,
			},
			component: () => <CopyLinkDropdownItem api={api} config={config} />,
		},
		{
			type: 'block-menu-section' as const,
			key: 'block-menu-section-move-up-down',
			rank: 300,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: 'block-menu-section-delete',
			rank: 400,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		...getMoveUpMoveDownMenuComponents(api),
		{
			type: 'block-menu-item' as const,
			key: 'block-menu-item-delete',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-delete',
				rank: 50,
			},
			component: () => <DeleteDropdownItem api={api} />,
		},
	];
};
