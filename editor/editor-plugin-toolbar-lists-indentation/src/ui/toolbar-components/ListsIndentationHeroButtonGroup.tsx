import React from 'react';

import {
	LISTS_INDENTATION_GROUP,
	LISTS_INDENTATION_GROUP_COLLAPSED,
	LISTS_INDENTATION_GROUP_COLLAPSED_RANK,
	LISTS_INDENTATION_GROUP_INLINE,
	LISTS_INDENTATION_GROUP_RANK,
	LISTS_INDENTATION_HERO_BUTTON,
	LISTS_INDENTATION_HERO_BUTTON_COLLAPSED,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { ToolbarListsIndentationPlugin } from '../../toolbarListsIndentationPluginType';

import {
	ListsIndentationHeroButtonCollapsed,
	ListsIndentationHeroButtonNew,
} from './ListsIndentationHeroButton';

export const getListsIndentationHeroButton = (
	api?: ExtractInjectionAPI<ToolbarListsIndentationPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: LISTS_INDENTATION_HERO_BUTTON.type,
			key: LISTS_INDENTATION_HERO_BUTTON.key,
			parents: [
				{
					type: LISTS_INDENTATION_GROUP.type,
					key: LISTS_INDENTATION_GROUP.key,
					rank: LISTS_INDENTATION_GROUP_RANK[LISTS_INDENTATION_HERO_BUTTON.key],
				},
			],
			component: ({ parents }) => <ListsIndentationHeroButtonNew api={api} parents={parents} />,
		},
		{
			type: LISTS_INDENTATION_HERO_BUTTON_COLLAPSED.type,
			key: LISTS_INDENTATION_HERO_BUTTON_COLLAPSED.key,
			parents: [
				{
					type: LISTS_INDENTATION_GROUP_COLLAPSED.type,
					key: LISTS_INDENTATION_GROUP_COLLAPSED.key,
					rank: LISTS_INDENTATION_GROUP_COLLAPSED_RANK[LISTS_INDENTATION_HERO_BUTTON_COLLAPSED.key],
				},
				{
					type: LISTS_INDENTATION_GROUP_INLINE.type,
					key: LISTS_INDENTATION_GROUP_INLINE.key,
					rank: LISTS_INDENTATION_GROUP_COLLAPSED_RANK[LISTS_INDENTATION_HERO_BUTTON_COLLAPSED.key],
				},
			],
			component: ({ parents }) => (
				<ListsIndentationHeroButtonCollapsed api={api} parents={parents} />
			),
		},
	];
};
