import React from 'react';

import {
	OVERFLOW_MENU,
	OVERFLOW_MENU_RANK,
	PIN_MENU_ITEM,
	PIN_MENU_SECTION,
	PIN_MENU_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { PinMenuItem } from './PinMenuItem';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>,
): RegisterComponent[] => {
	return [
		{
			type: PIN_MENU_SECTION.type,
			key: PIN_MENU_SECTION.key,
			parents: [
				{
					type: OVERFLOW_MENU.type,
					key: OVERFLOW_MENU.key,
					rank: OVERFLOW_MENU_RANK[PIN_MENU_SECTION.key],
				},
			],
		},
		{
			type: PIN_MENU_ITEM.type,
			key: PIN_MENU_ITEM.key,
			parents: [
				{
					type: PIN_MENU_SECTION.type,
					key: PIN_MENU_SECTION.key,
					rank: PIN_MENU_SECTION_RANK[PIN_MENU_ITEM.key],
				},
			],
			component: () => {
				return <PinMenuItem api={api} />;
			},
		},
	];
};
