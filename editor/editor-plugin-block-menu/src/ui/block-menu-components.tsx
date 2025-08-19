import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import JiraIcon from '@atlaskit/icon-lab/core/jira';
import ChangesIcon from '@atlaskit/icon/core/changes';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import DeleteIcon from '@atlaskit/icon/core/delete';
import ListBulletedIcon from '@atlaskit/icon/core/list-bulleted';
import TaskIcon from '@atlaskit/icon/core/task';

import type { BlockMenuPlugin } from '../blockMenuPluginType';
import { type RegisterBlockMenuComponent } from '../blockMenuPluginType';

import { MoveDownDropdownItem } from './move-down';
import { MoveUpDropdownItem } from './move-up';

const getMoveUpMoveDownMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	if (!api?.blockControls?.commands.moveNode) {
		return [];
	}
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

export const getBlockMenuComponents = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): RegisterBlockMenuComponent[] => {
	return [
		{
			type: 'block-menu-section' as const,
			key: 'block-menu-section-format',
			rank: 100,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: 'block-menu-section-move-up-down',
			rank: 200,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-section' as const,
			key: 'block-menu-section-delete',
			rank: 300,
			component: ({ children }: { children: React.ReactNode }) => {
				return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
			},
		},
		{
			type: 'block-menu-nested' as const,
			key: 'nested-menu',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-format',
				rank: 100,
			},
			component: () => {
				return (
					<ToolbarNestedDropdownMenu
						text="Format"
						elemBefore={<ChangesIcon label="" />}
						elemAfter={<ChevronRightIcon label={'example nested menu'} />}
					>
						<ToolbarDropdownItemSection>
							<ToolbarDropdownItem elemBefore={<TaskIcon label="" />}>
								Action item
							</ToolbarDropdownItem>
							<ToolbarDropdownItem elemBefore={<ListBulletedIcon label="" />}>
								Bullet list
							</ToolbarDropdownItem>
						</ToolbarDropdownItemSection>
					</ToolbarNestedDropdownMenu>
				);
			},
		},
		{
			type: 'block-menu-item' as const,
			key: 'block-menu-item-create-jira',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-format',
				rank: 200,
			},
			component: () => {
				return (
					<ToolbarDropdownItem elemBefore={<JiraIcon label="" />}>
						Create Jira work item
					</ToolbarDropdownItem>
				);
			},
		},
		...getMoveUpMoveDownMenuComponents(api),
		{
			type: 'block-menu-item' as const,
			key: 'block-menu-item-delete',
			parent: {
				type: 'block-menu-section' as const,
				key: 'block-menu-section-delete',
				rank: 100,
			},
			component: () => {
				return (
					<ToolbarDropdownItem elemBefore={<DeleteIcon label="" />}>Delete</ToolbarDropdownItem>
				);
			},
		},
	];
};
