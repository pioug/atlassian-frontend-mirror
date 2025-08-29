import React from 'react';

import {
	TEXT_SECTION,
	TEXT_SECTION_RANK,
	TEXT_COLOR_HIGHLIGHT_GROUP,
	TEXT_COLOR_HIGHLIGHT_MENU,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
	TEXT_COLOR_MENU_ITEM,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK,
	TEXT_COLOR_HIGHLIGHT_GROUP_RANK,
	TEXT_COLOR_HIGHLIGHT_MENU_RANK,
	TEXT_COLLAPSED_MENU_RANK,
	TEXT_COLLAPSED_MENU,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent, ToolbarComponentTypes } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { TextColorPlugin } from '../textColorPluginType';

import { TextColorHighlightMenu } from './TextColorHighlightMenu';
import { TextColorMenuItem } from './TextColorMenuItem';
import { TextMenuSection } from './TextMenuSection';

export const getToolbarComponents = (
	api: ExtractInjectionAPI<TextColorPlugin> | undefined,
): RegisterComponent[] => {
	return [
		{
			...TEXT_COLOR_HIGHLIGHT_GROUP,
			parents: [
				{
					...TEXT_SECTION,
					rank: TEXT_SECTION_RANK[TEXT_COLOR_HIGHLIGHT_GROUP.key],
				},
			],
		},
		{
			...TEXT_COLOR_HIGHLIGHT_MENU,
			parents: [
				{
					...TEXT_COLOR_HIGHLIGHT_GROUP,
					rank: TEXT_COLOR_HIGHLIGHT_GROUP_RANK[TEXT_COLOR_HIGHLIGHT_MENU.key],
				},
			],
			component: ({ children }: { children: React.ReactNode }) => (
				<TextColorHighlightMenu api={api}>{children}</TextColorHighlightMenu>
			),
		},
		{
			...TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
			parents: [
				{
					...TEXT_COLOR_HIGHLIGHT_MENU,
					rank: TEXT_COLOR_HIGHLIGHT_MENU_RANK[TEXT_COLOR_HIGHLIGHT_MENU_SECTION.key],
				},
				...(expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
					? [
							{
								type: TEXT_COLLAPSED_MENU.type,
								key: TEXT_COLLAPSED_MENU.key,
								rank: TEXT_COLLAPSED_MENU_RANK[TEXT_COLOR_HIGHLIGHT_MENU_SECTION.key],
							},
						]
					: []),
			],
			component: expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)
				? TextMenuSection
				: undefined,
		},
		{
			...TEXT_COLOR_MENU_ITEM,
			parents: [
				{
					...TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
					rank: TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK[TEXT_COLOR_MENU_ITEM.key],
				},
			],
			component: ({ parents }: { parents: ToolbarComponentTypes }) => (
				<TextColorMenuItem api={api} parents={parents} />
			),
		},
	];
};
