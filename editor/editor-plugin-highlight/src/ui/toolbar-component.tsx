import React from 'react';

import {
	HIGHLIGHT_MENU_ITEM,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION,
	TEXT_COLOR_HIGHLIGHT_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

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
			component: () => <HighlightColorMenuItem api={api} />,
		},
	];
};
