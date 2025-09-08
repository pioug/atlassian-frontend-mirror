import React from 'react';

import {
	LOOM_MENU_SECTION,
	OVERFLOW_MENU_RANK,
	OVERFLOW_MENU,
	LOOM_MENU_ITEM,
	LOOM_MENU_SECTION_RANK,
	OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK,
	OVERFLOW_MENU_PRIMARY_TOOLBAR,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
					type: OVERFLOW_MENU.type,
					key: OVERFLOW_MENU.key,
					rank: OVERFLOW_MENU_RANK[LOOM_MENU_SECTION.key],
				},
				{
					type: OVERFLOW_MENU_PRIMARY_TOOLBAR.type,
					key: OVERFLOW_MENU_PRIMARY_TOOLBAR.key,
					rank: OVERFLOW_MENU_PRIMARY_TOOLBAR_RANK[LOOM_MENU_SECTION.key],
				},
			],
			component: ({ children }) => {
				if (expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true)) {
					return <MenuSection api={api}>{children}</MenuSection>;
				}

				return (
					<ToolbarDropdownItemSection hasSeparator={true}>{children}</ToolbarDropdownItemSection>
				);
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
			],
			component: () => {
				return <LoomMenuItem api={api} renderButton={config.renderButton} />;
			},
		},
	];
};
