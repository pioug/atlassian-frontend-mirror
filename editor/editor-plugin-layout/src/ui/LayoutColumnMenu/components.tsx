import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { RegisterComponent, SurfaceFallbacks } from '@atlaskit/editor-ui-control-model';

import type { LayoutPlugin } from '../../layoutPluginType';

import { createDistributeColumnsDropdownItem } from './DistributeColumnsDropdownItem';

export const LAYOUT_COLUMN_MENU = {
	key: 'layout-column-menu',
	type: 'menu' as const,
};

const LAYOUT_COLUMN_MENU_SECTION = {
	key: 'layout-column-menu-section',
	type: 'menu-section' as const,
};

const DISTRIBUTE_COLUMNS_MENU_ITEM = {
	key: 'layout-column-menu-distribute-columns-item',
	type: 'menu-item' as const,
};

const LAYOUT_COLUMN_MENU_RANK = {
	[LAYOUT_COLUMN_MENU_SECTION.key]: 0,
};

const LAYOUT_COLUMN_MENU_SECTION_RANK = {
	[DISTRIBUTE_COLUMNS_MENU_ITEM.key]: 0,
};

type MenuSectionFallbackProps = {
	children?: React.ReactNode;
};

export const LAYOUT_COLUMN_MENU_FALLBACKS: SurfaceFallbacks = {
	'menu-section': ({ children }: MenuSectionFallbackProps) => (
		<ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>
	),
};

export const getLayoutColumnMenuComponents = ({
	api,
}: {
	api: ExtractInjectionAPI<LayoutPlugin> | undefined;
}): RegisterComponent[] => {
	return [
		{
			...LAYOUT_COLUMN_MENU,
		},
		{
			...LAYOUT_COLUMN_MENU_SECTION,
			parents: [
				{
					...LAYOUT_COLUMN_MENU,
					rank: (LAYOUT_COLUMN_MENU_RANK as Record<string, number>)[
						LAYOUT_COLUMN_MENU_SECTION.key
					],
				},
			],
		},
		{
			...DISTRIBUTE_COLUMNS_MENU_ITEM,
			component: createDistributeColumnsDropdownItem(api),
			parents: [
				{
					...LAYOUT_COLUMN_MENU_SECTION,
					rank: (LAYOUT_COLUMN_MENU_SECTION_RANK as Record<string, number>)[
						DISTRIBUTE_COLUMNS_MENU_ITEM.key
					],
				},
			],
		},
	];
};
