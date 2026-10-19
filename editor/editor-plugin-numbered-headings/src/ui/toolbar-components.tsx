import React from 'react';

import {
	NUMBERED_HEADINGS_MENU_ITEM,
	NUMBERED_HEADINGS_MENU_SECTION,
	TEXT_COLLAPSED_MENU,
	TEXT_STYLES_MENU,
} from '@atlaskit/editor-common/toolbar/keys';
import {
	NUMBERED_HEADINGS_MENU_SECTION_RANK,
	TEXT_COLLAPSED_MENU_RANK,
	TEXT_STYLES_MENU_RANK,
} from '@atlaskit/editor-common/toolbar/rank';
// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model/types';

import type { InternalNumberedHeadingsPlugin } from '../numberedHeadingsPluginType';
import { NumberedHeadingsMenuItem } from './NumberedHeadingsMenuItem';
import { NumberedHeadingsMenuSection } from './NumberedHeadingsMenuSection';

export const getToolbarComponents = (
	api: ExtractInjectionAPI<InternalNumberedHeadingsPlugin> | undefined,
): RegisterComponent[] => [
	{
		type: NUMBERED_HEADINGS_MENU_SECTION.type,
		key: NUMBERED_HEADINGS_MENU_SECTION.key,
		parents: [
			{
				type: TEXT_STYLES_MENU.type,
				key: TEXT_STYLES_MENU.key,
				rank: TEXT_STYLES_MENU_RANK[NUMBERED_HEADINGS_MENU_SECTION.key],
			},
			{
				type: TEXT_COLLAPSED_MENU.type,
				key: TEXT_COLLAPSED_MENU.key,
				rank: TEXT_COLLAPSED_MENU_RANK[NUMBERED_HEADINGS_MENU_SECTION.key],
			},
		],
		component: ({ children }: { children: React.ReactNode }) => (
			<NumberedHeadingsMenuSection api={api}>{children}</NumberedHeadingsMenuSection>
		),
	},
	{
		type: NUMBERED_HEADINGS_MENU_ITEM.type,
		key: NUMBERED_HEADINGS_MENU_ITEM.key,
		parents: [
			{
				type: NUMBERED_HEADINGS_MENU_SECTION.type,
				key: NUMBERED_HEADINGS_MENU_SECTION.key,
				rank: NUMBERED_HEADINGS_MENU_SECTION_RANK[NUMBERED_HEADINGS_MENU_ITEM.key],
			},
		],
		component: () => <NumberedHeadingsMenuItem api={api} />,
	},
];
