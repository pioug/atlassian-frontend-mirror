import React from 'react';

import {
	OVERFLOW_MENU,
	OVERFLOW_MENU_RANK,
	PIN_BUTTON,
	PIN_GROUP,
	PIN_MENU_ITEM,
	PIN_MENU_SECTION,
	PIN_MENU_SECTION_RANK,
	PIN_GROUP_RANK,
	PIN_SECTION,
	PIN_SECTION_RANK,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

import { PinButton } from './PinButton';
import { PinMenuItem } from './PinMenuItem';

export const getToolbarComponents = (
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>,
	contextualFormattingEnabled?: boolean,
): RegisterComponent[] => {
	const components: RegisterComponent[] = [
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

	// Add pin button to primary toolbar when contextual formatting is enabled
	if (contextualFormattingEnabled) {
		const pinButtonComponents = [
			{
				type: PIN_GROUP.type,
				key: PIN_GROUP.key,
				parents: [
					{
						type: PIN_SECTION.type,
						key: PIN_SECTION.key,
						rank: PIN_SECTION_RANK[PIN_GROUP.key],
					},
				],
			},
			{
				type: PIN_BUTTON.type,
				key: PIN_BUTTON.key,
				parents: [
					{
						type: PIN_GROUP.type,
						key: PIN_GROUP.key,
						rank: PIN_GROUP_RANK[PIN_BUTTON.key],
					},
				],
				component: () => {
					return <PinButton api={api} />;
				},
			},
		];
		components.push(...pinButtonComponents);
	}

	return components;
};
