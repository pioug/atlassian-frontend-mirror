import React, { useState } from 'react';

import type { OpenChangedEvent } from '@atlaskit/editor-common/ui';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import {
	ArrowKeyNavigationType,
	DropdownMenuWithKeyboardNavigation as DropdownMenu,
	ToolbarButton,
} from '@atlaskit/editor-common/ui-menu';

import type { ExtensionToolbarItemConfiguration, GetMenuItemsFn, GetToolbarItemFn } from '../types';

export type ToolbarItemExtension = {
	getMenuItems?: GetMenuItemsFn;
	getToolbarItem: GetToolbarItemFn;
};

type LegacyPrimaryToolbarComponentProps = {
	primaryToolbarItemExtensions: ToolbarItemExtension[];
};

export const LegacyPrimaryToolbarComponent = ({
	primaryToolbarItemExtensions,
}: LegacyPrimaryToolbarComponentProps): React.JSX.Element => {
	// NEXT PR: need to render a separator after – if there are extensions added
	return (
		<>
			{primaryToolbarItemExtensions.map((toolbarItemExtension, _i) => {
				const toolbarItem = toolbarItemExtension.getToolbarItem();
				return <LegacyExtensionToolbarItem key={toolbarItem.tooltip} toolbarItem={toolbarItem} />;
			})}
		</>
	);
};

type LegacyExtensionToolbarItemProps = {
	getMenuItems?: GetMenuItemsFn;
	toolbarItem: ExtensionToolbarItemConfiguration;
};

export const LegacyExtensionToolbarItem = ({
	toolbarItem,
	getMenuItems,
}: LegacyExtensionToolbarItemProps): React.JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	const { icon: Icon, tooltip, isDisabled, onClick, label: _label } = toolbarItem;

	if (!getMenuItems) {
		return (
			<ToolbarButton
				spacing="default"
				disabled={isDisabled}
				selected={isOpen}
				title={tooltip}
				aria-label={tooltip}
				aria-expanded={isOpen}
				aria-haspopup
				onClick={onClick}
				iconBefore={<Icon label={tooltip} />}
			/>
		);
	}

	const toggleOpen = () => {
		setIsOpen((prev) => !prev);
	};

	const toggleOpenByKeyboard = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			toggleOpen();
		}
	};

	const handleItemActivated = ({
		item,
		shouldCloseMenu = true,
	}: {
		item: MenuItem;
		shouldCloseMenu?: boolean;
	}) => {
		item.onClick?.();

		if (shouldCloseMenu) {
			setIsOpen(false);
		}
	};

	const handleOnOpenChange = (attrs: OpenChangedEvent) => {
		setIsOpen(!!attrs?.isOpen);
	};

	const items = isOpen
		? // eslint-disable-next-line @atlassian/perf-linting/no-expensive-computations-in-render -- Ignored via go/ees017 (to be fixed)
			getMenuItems()
				.map<MenuItem | undefined>((menuItem, i) => {
					// Only process ExtensionMenuItemConfiguration, skip ExtensionMenuSectionConfiguration
					if ('label' in menuItem && 'icon' in menuItem) {
						return {
							key: `menu-item-${i}`,
							content: menuItem.label,
							elemBefore: <menuItem.icon label={menuItem.label} />,
							onClick: () => {
								menuItem.onClick?.();
								// NEXT PR: here we need to set the active extension so the contentComponent can render
								// menuItem.contentComponent
							},
							isDisabled: menuItem.isDisabled,
							'aria-label': menuItem.label,
							value: { name: menuItem.label },
						};
					}
					return undefined;
				})
				.filter((item): item is MenuItem => item !== undefined)
		: [];

	return (
		<DropdownMenu
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			arrowKeyNavigationProviderOptions={{
				type: ArrowKeyNavigationType.MENU,
			}}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			items={[{ items }]}
			isOpen={isOpen}
			onItemActivated={handleItemActivated}
			onOpenChange={handleOnOpenChange}
			fitWidth={200}
		>
			<ToolbarButton
				spacing="default"
				disabled={isDisabled}
				selected={isOpen}
				title={tooltip}
				aria-label={tooltip}
				aria-expanded={isOpen}
				aria-haspopup
				onClick={toggleOpen}
				onKeyDown={toggleOpenByKeyboard}
				iconBefore={<Icon label={tooltip} />}
			/>
		</DropdownMenu>
	);
};
