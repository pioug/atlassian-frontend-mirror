import React from 'react';

import { SELECTION_EXTENSION_MENU_SECTION, APPS_SECTION } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';

import { MenuItem } from './MenuItem';
import { ToolbarButton } from './ToolbarButton';
import { ToolbarMenu } from './ToolbarMenu';

type RegisterExtensionProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	extension: ExtensionConfiguration;
	index: number;
};

const EXTENSION_RANK_MULTIPLIER = 100;

export const registerInlineToolbar = ({ api, extension, index }: RegisterExtensionProps) => {
	const { key, inlineToolbar } = extension;

	const baseKey = `selection-extension-${key}`;

	const components: RegisterComponent[] = [];

	if (!inlineToolbar) {
		return components;
	}

	const { getToolbarItem, getMenuItems } = inlineToolbar;

	const groupKey = `${baseKey}-toolbar-group`;
	const toolbarItemKey = `${baseKey}-toolbar-${getMenuItems ? 'menu' : 'button'}`;
	const menuSectionKey = `${baseKey}-toolbar-menu-section`;

	if (getToolbarItem) {
		// first we register the group for the button or menu to be added to
		components.push({
			type: 'group',
			key: groupKey,
			parents: [
				{
					type: APPS_SECTION.type,
					key: APPS_SECTION.key,
					rank: (index + 1) * EXTENSION_RANK_MULTIPLIER,
				},
			],
		});

		const toolbarItemConfig = getToolbarItem();

		// if toolbar item has menu items, assume it's a menu
		if (getMenuItems) {
			components.push({
				type: 'menu',
				key: toolbarItemKey,
				parents: [
					{
						type: 'group',
						key: groupKey,
						rank: EXTENSION_RANK_MULTIPLIER,
					},
				],
				component: () => {
					return <ToolbarMenu api={api} config={toolbarItemConfig} />;
				},
			});
		} else {
			// else just regsiter a button
			components.push({
				type: 'button',
				key: toolbarItemKey,
				parents: [
					{
						type: 'group',
						key: groupKey,
						rank: EXTENSION_RANK_MULTIPLIER,
					},
				],
				component: () => {
					return <ToolbarButton api={api} config={toolbarItemConfig} />;
				},
			});
		}
	}

	if (getMenuItems) {
		if (getToolbarItem) {
			components.push({
				type: 'menu-section',
				key: menuSectionKey,
				parents: [
					{
						type: 'menu',
						key: toolbarItemKey,
						rank: EXTENSION_RANK_MULTIPLIER,
					},
				],
			});
		}

		// Remove ExtensionMenuSectionConfiguration - only care about items
		const menuItems = getMenuItems().filter((item) => 'label' in item && 'icon' in item);

		components.push({
			type: 'menu-item',
			key,
			parents: [
				{
					type: 'menu-section',
					// if we have a custom menu, place items in there, otherwise in the overflow menu
					key: getToolbarItem ? menuSectionKey : SELECTION_EXTENSION_MENU_SECTION.key,
					rank: (index + 1) * EXTENSION_RANK_MULTIPLIER,
				},
			],
			component: () => {
				return <MenuItem api={api} extensionMenuItems={menuItems} />;
			},
		});
	}

	return components;
};
