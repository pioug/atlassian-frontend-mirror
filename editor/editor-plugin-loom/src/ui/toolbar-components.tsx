import React from 'react';

import {
	LOOM_MENU_SECTION,
	LOOM_MENU_ITEM,
	LOOM_MENU_SECTION_RANK,
	OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK,
	OVERFLOW_MENU_PRIMARY_TOOLBAR,
	OVERFLOW_EXTENSIONS_MENU_SECTION,
	OVERFLOW_EXTENSIONS_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { LoomPlugin } from '../loomPluginType';
import type { LoomPluginOptions } from '../types';

import { LoomMenuItem } from './LoomMenuItem';
import { MenuSection } from './MenuSection';

export const getToolbarComponents = (
	config: LoomPluginOptions,
	api: ExtractInjectionAPI<LoomPlugin> | undefined,
): RegisterComponent[] => {
	return [
		{
			type: LOOM_MENU_SECTION.type,
			key: LOOM_MENU_SECTION.key,
			parents: [
				{
					type: OVERFLOW_MENU_PRIMARY_TOOLBAR.type,
					key: OVERFLOW_MENU_PRIMARY_TOOLBAR.key,
					rank: OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK[LOOM_MENU_SECTION.key],
				},
			],
			component: ({ children }) => {
				return <MenuSection api={api}>{children}</MenuSection>;
			},
		},
		{
			type: LOOM_MENU_ITEM.type,
			key: LOOM_MENU_ITEM.key,
			parents: [
				{
					type: LOOM_MENU_SECTION.type,
					key: LOOM_MENU_SECTION.key,
					rank: LOOM_MENU_SECTION_RANK[LOOM_MENU_ITEM.key],
				},
				{
					type: OVERFLOW_EXTENSIONS_MENU_SECTION.type,
					key: OVERFLOW_EXTENSIONS_MENU_SECTION.key,
					rank: OVERFLOW_EXTENSIONS_MENU_SECTION_RANK[LOOM_MENU_ITEM.key],
				},
			],
			component: () => {
				return <LoomMenuItem api={api} renderButton={config.renderButton} />;
			},
		},
	];
};
