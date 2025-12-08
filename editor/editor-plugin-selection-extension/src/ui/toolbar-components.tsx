import React from 'react';

import {
	APPS_SECTION,
	EXTERNAL_EXTENSIONS_MENU_ITEM,
	FIRST_PARTY_EXTENSIONS_MENU_ITEM,
	OVERFLOW_EXTENSIONS_MENU_SECTION,
	OVERFLOW_EXTENSIONS_MENU_SECTION_RANK,
	OVERFLOW_MENU,
	OVERFLOW_MENU_RANK,
	SELECTION_EXTENSION_MENU_SECTION,
	TOOLBAR_RANK,
	TOOLBARS,
} from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionExtensionPlugin } from '../selectionExtensionPluginType';
import type { ExtensionMenuItemConfiguration } from '../types';
import { type SelectionExtensionPluginOptions } from '../types';

import { MenuItem } from './toolbar-components/MenuItem';
import { registerInlineToolbar } from './toolbar-components/register-inline-toolbar';
import { migrateSelectionExtensionToMenuItem } from './utils/migrate-selection-extention';

type GetToolbarComponentsProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	config: SelectionExtensionPluginOptions | undefined;
};

type GetToolbarComponents = (props: GetToolbarComponentsProps) => RegisterComponent[];

export const getToolbarComponents: GetToolbarComponents = ({ api, config }) => {
	const extensionToolbarComponents =
		config?.extensionList?.flatMap((extension, index) =>
			registerInlineToolbar({ api, extension, index }),
		) || [];

	/**
	 * Continue to support firstParty apps for now as some apps haven't migrated yet, this simply converts apps to new ExtensionMenuItemConfiguration type
	 * to process easier. extensionList and extensions?.firstParty will most likely be mutually exclusive.
	 *
	 * **Warning:** This is called on every selection change to ensure calls to api?.selectionExtension.actions.getSelectionAdf() are
	 * fresh and up to date.
	 */
	const firstPartyExtensions =
		config?.extensions?.firstParty
			?.map((extension) => migrateSelectionExtensionToMenuItem(extension, api))
			.filter((extension) => extension !== undefined) || [];

	const externalExtensions =
		config?.extensions?.external
			?.map((extension) => migrateSelectionExtensionToMenuItem(extension, api))
			.filter((extension) => extension !== undefined) || [];

	return [
		{
			type: APPS_SECTION.type,
			key: APPS_SECTION.key,
			parents: [
				{
					type: 'toolbar',
					key: TOOLBARS.INLINE_TEXT_TOOLBAR,
					rank: TOOLBAR_RANK[APPS_SECTION.key],
				},
				{
					type: 'toolbar',
					key: TOOLBARS.PRIMARY_TOOLBAR,
					rank: TOOLBAR_RANK[APPS_SECTION.key],
				},
			],
		},
		...(fg('platform_editor_toolbar_aifc_overflow_menu_update')
			? []
			: [
					// also register a section inside the overflow menu for extensions which only have menu items
					{
						type: SELECTION_EXTENSION_MENU_SECTION.type,
						key: SELECTION_EXTENSION_MENU_SECTION.key,
						parents: [
							{
								key: OVERFLOW_MENU.key,
								type: OVERFLOW_MENU.type,
								rank: OVERFLOW_MENU_RANK[SELECTION_EXTENSION_MENU_SECTION.key],
							},
						],
					},
				]),
		...extensionToolbarComponents,
		...registerFirstPartyExtensions(api, firstPartyExtensions),
		...registerExternalExtensions(api, externalExtensions),
	];
};

const registerFirstPartyExtensions = (
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
	extensions: ExtensionMenuItemConfiguration[],
) => {
	const components: RegisterComponent[] = [];

	if (fg('platform_editor_toolbar_aifc_overflow_menu_update')) {
		components.push({
			type: FIRST_PARTY_EXTENSIONS_MENU_ITEM.type,
			key: FIRST_PARTY_EXTENSIONS_MENU_ITEM.key,
			parents: [
				{
					type: OVERFLOW_EXTENSIONS_MENU_SECTION.type,
					key: OVERFLOW_EXTENSIONS_MENU_SECTION.key,
					rank: OVERFLOW_EXTENSIONS_MENU_SECTION_RANK[FIRST_PARTY_EXTENSIONS_MENU_ITEM.key],
				},
			],
			component: () => {
				return <MenuItem api={api} extensionMenuItems={extensions} />;
			},
		});

		return components;
	}

	components.push({
		type: 'menu-item',
		key: 'first-party-extensions-menu-item',
		parents: [
			{
				type: 'menu-section',
				key: SELECTION_EXTENSION_MENU_SECTION.key,
				rank: 100,
			},
		],
		component: () => {
			return <MenuItem api={api} extensionMenuItems={extensions} />;
		},
	});

	return components;
};

const registerExternalExtensions = (
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
	extensions: ExtensionMenuItemConfiguration[],
) => {
	const components: RegisterComponent[] = [];

	if (fg('platform_editor_toolbar_aifc_overflow_menu_update')) {
		components.push({
			type: EXTERNAL_EXTENSIONS_MENU_ITEM.type,
			key: EXTERNAL_EXTENSIONS_MENU_ITEM.key,
			parents: [
				{
					type: OVERFLOW_EXTENSIONS_MENU_SECTION.type,
					key: OVERFLOW_EXTENSIONS_MENU_SECTION.key,
					rank: OVERFLOW_EXTENSIONS_MENU_SECTION_RANK[EXTERNAL_EXTENSIONS_MENU_ITEM.key],
				},
			],
			component: () => {
				return <MenuItem api={api} extensionMenuItems={extensions} />;
			},
		});

		return components;
	}

	components.push({
		type: 'menu-item',
		key: 'external-extensions-menu-item',
		parents: [
			{
				type: 'menu-section',
				key: SELECTION_EXTENSION_MENU_SECTION.key,
				rank: 200,
			},
		],
		component: () => {
			return <MenuItem api={api} extensionMenuItems={extensions} />;
		},
	});

	return components;
};
