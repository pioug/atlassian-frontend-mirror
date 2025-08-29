import React from 'react';

import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { RegisterBlockMenuComponent } from '@atlaskit/editor-plugin-block-menu';
import {
	ToolbarDropdownItem,
	ToolbarDropdownItemSection,
	ToolbarNestedDropdownMenu,
} from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionConfiguration } from '../../types';
import { getBlockMenuItemExtensions } from '../extensions';

export function registerBlockMenuItems(
	extensionList: ExtensionConfiguration[],
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined,
) {
	const blockMenuExtensions = getBlockMenuItemExtensions(extensionList, 'first-party');
	if (!blockMenuExtensions?.length) {
		return;
	}
	blockMenuExtensions.forEach((extension, index) => {
		const menuItem = extension.menuItem;
		const nestedMenuItems = extension.nestedMenuItems;

		const blockMenuItemKey = `selection-extension-${index}`;

		// If there are nested menu items, create a nested dropdown menu
		if (nestedMenuItems && nestedMenuItems.length > 0) {
			const nestedMenuComponents = [
				{
					type: 'block-menu-nested' as const,
					key: `${blockMenuItemKey}-nested`,
					parent: {
						type: 'block-menu-section' as const,
						key: 'block-menu-section-primary',
						rank: 200,
					},
					component: ({ children }: { children: React.ReactNode } = { children: null }) => {
						return (
							<ToolbarNestedDropdownMenu
								text={menuItem.label}
								elemBefore={
									menuItem.icon ? React.createElement(menuItem.icon, { label: '' }) : undefined
								}
								elemAfter={<ChevronRightIcon label={'nested menu'} />}
							>
								{children}
							</ToolbarNestedDropdownMenu>
						);
					},
				},
				{
					type: 'block-menu-section' as const,
					key: `${blockMenuItemKey}-nested-section`,
					parent: {
						type: 'block-menu-nested' as const,
						key: `${blockMenuItemKey}-nested`,
						rank: 100,
					},
					component: ({ children }: { children: React.ReactNode } = { children: null }) => {
						return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
					},
				},
				// Add nested menu items
				...nestedMenuItems.reduce<RegisterBlockMenuComponent[]>((acc, nestedItem, nestedIndex) => {
					if ('label' in nestedItem) {
						acc.push({
							type: 'block-menu-item' as const,
							key: `${blockMenuItemKey}-nested-item-${nestedIndex}`,
							parent: {
								type: 'block-menu-section' as const,
								key: `${blockMenuItemKey}-nested-section`,
								rank: nestedIndex + 100,
							},
							component: () => {
								return (
									<ToolbarDropdownItem
										elemBefore={
											nestedItem.icon
												? React.createElement(nestedItem.icon, { label: '' })
												: undefined
										}
										onClick={nestedItem.onClick}
										isDisabled={nestedItem.isDisabled}
									>
										{nestedItem.label}
									</ToolbarDropdownItem>
								);
							},
						});
					}
					return acc;
				}, []),
			];
			api?.blockMenu?.actions.registerBlockMenuComponents(nestedMenuComponents);
		} else {
			// If no nested items, create a regular menu item
			const blockMenuComponent = [
				{
					type: 'block-menu-item' as const,
					key: blockMenuItemKey,
					parent: {
						type: 'block-menu-section' as const,
						key: 'block-menu-section-primary',
						rank: 200,
					},
					component: () => {
						return (
							<ToolbarDropdownItem
								elemBefore={
									menuItem.icon ? React.createElement(menuItem.icon, { label: '' }) : undefined
								}
								onClick={menuItem.onClick}
								isDisabled={menuItem.isDisabled}
							>
								{menuItem.label}
							</ToolbarDropdownItem>
						);
					},
				},
			];
			api?.blockMenu?.actions.registerBlockMenuComponents(blockMenuComponent);
		}
	});
}
