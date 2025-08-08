import React from 'react';

import {
	TEXT_STYLES_GROUP,
	TEXT_SECTION_RANK,
	TEXT_SECTION,
	TEXT_STYLES_MENU,
	TEXT_STYLES_GROUP_RANK,
	TEXT_STYLES_MENU_SECTION,
	TEXT_STYLES_MENU_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { BlockTypePlugin } from '../../blockTypePluginType';
import { toolbarBlockTypesWithRank } from '../block-types';

import { HeadingButton } from './ToolbarBlockType/HeadingButton';
import { QuoteButton } from './ToolbarBlockType/QuoteButton';
import { TextStylesMenuButton } from './ToolbarBlockType/TextStylesMenuButton';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<BlockTypePlugin>,
): RegisterComponent[] => {
	const toolbarComponents: RegisterComponent[] = [
		{
			type: TEXT_STYLES_GROUP.type,
			key: TEXT_STYLES_GROUP.key,
			parents: [
				{
					type: TEXT_SECTION.type,
					key: TEXT_SECTION.key,
					rank: TEXT_SECTION_RANK[TEXT_STYLES_GROUP.key],
				},
			],
		},
		{
			type: TEXT_STYLES_MENU.type,
			key: TEXT_STYLES_MENU.key,
			parents: [
				{
					type: TEXT_STYLES_GROUP.type,
					key: TEXT_STYLES_GROUP.key,
					rank: TEXT_STYLES_GROUP_RANK[TEXT_STYLES_MENU.key],
				},
			],
			component: ({ children }: { children: React.ReactNode }) => (
				<TextStylesMenuButton api={api}>{children}</TextStylesMenuButton>
			),
		},
		{
			type: TEXT_STYLES_MENU_SECTION.type,
			key: TEXT_STYLES_MENU_SECTION.key,
			parents: [
				{
					type: TEXT_STYLES_MENU.type,
					key: TEXT_STYLES_MENU.key,
					rank: TEXT_STYLES_MENU_RANK[TEXT_STYLES_MENU_SECTION.key],
				},
			],
		},
	];

	Object.values(toolbarBlockTypesWithRank()).forEach((blockType) => {
		if (blockType.toolbarKey) {
			const menuItem: RegisterComponent = {
				type: 'menu-item',
				key: blockType.toolbarKey,
				parents: [
					{
						type: TEXT_STYLES_MENU_SECTION.type,
						key: TEXT_STYLES_MENU_SECTION.key,
						rank: blockType.toolbarRank,
					},
				],
				component:
					blockType.name === 'blockquote'
						? () => <QuoteButton blockType={blockType} api={api} />
						: () => <HeadingButton blockType={blockType} api={api} />,
			};

			toolbarComponents.push(menuItem);
		}
	});

	return toolbarComponents;
};
