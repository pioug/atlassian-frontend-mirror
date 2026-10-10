import React from 'react';

import {
	HIGHLIGHT_MENU_ITEM,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
} from '@atlaskit/editor-common/toolbar/keys';
import { TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK } from '@atlaskit/editor-common/toolbar/rank';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type {
	RegisterComponent,
	ToolbarComponentTypes,
} from '@atlaskit/editor-toolbar-model/types';

import type { HighlightPlugin } from '../highlightPluginType';
import { HighlightColorMenuItem } from './HighlightColorMenuItem';

export const getToolbarComponent = (
	api: ExtractInjectionAPI<HighlightPlugin> | undefined,
): RegisterComponent[] => {
	return [
		{
			...HIGHLIGHT_MENU_ITEM,
			parents: [
				{
					...TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
					rank: TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK[HIGHLIGHT_MENU_ITEM.key],
				},
			],
			component: ({ parents }: { parents: ToolbarComponentTypes }) => (
				<HighlightColorMenuItem api={api} parents={parents} />
			),
		},
	];
};
