import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { ToolbarDropdownItemSection, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';

import { type ExtensionNestedDropdownMenuConfiguration } from '../../types';
import { useSelectionExtensionComponentContext } from '../SelectionExtensionComponentContext';

import { SelectionExtensionDropdownItem } from './SelectionExtensionDropdownItem';

export type SelectionExtensionNestedDropdownMenuProps = {
	nestedDropdownMenu: ExtensionNestedDropdownMenuConfiguration;
};

const ChildItems = ({ nestedDropdownMenu }: SelectionExtensionNestedDropdownMenuProps) => {
	const childItems = nestedDropdownMenu.getMenuItems();

	return (
		<ToolbarDropdownItemSection>
			{childItems.map((dropdownItem) => (
				<SelectionExtensionDropdownItem
					key={dropdownItem.key || dropdownItem.label}
					dropdownItem={dropdownItem}
				/>
			))}
		</ToolbarDropdownItemSection>
	);
};

export const SelectionExtensionNestedDropdownMenu = ({
	nestedDropdownMenu,
}: SelectionExtensionNestedDropdownMenuProps): React.JSX.Element => {
	const IconComponent = nestedDropdownMenu.icon;
	const { api, extensionKey, extensionSource, extensionLocation } =
		useSelectionExtensionComponentContext();

	const handleClick = () => {
		api.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_DROPDOWN,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				extensionKey,
				extensionSource,
				extensionLocation,
				extensionElement: 'nested-dropdown',
				extensionItemKey: nestedDropdownMenu.key,
			},
		});
	};

	return (
		<ToolbarNestedDropdownMenu
			text={nestedDropdownMenu.label}
			elemBefore={
				IconComponent ? (
					// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
					// To clean up: keep only size="small"
					<IconComponent
						label=""
						size={fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined}
					/>
				) : undefined
			}
			elemAfter={
				// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
				// To clean up: keep only size="small"
				<ChevronRightIcon
					label=""
					size={fg('platform_editor_block_menu_v2_patch_3') ? 'small' : undefined}
				/>
			}
			onClick={handleClick}
			dropdownTestId="editor-selection-extension-menu"
			shouldTitleWrap={fg('platform_editor_block_menu_v2_patch_2') ? false : undefined}
			tooltipContent={
				fg('platform_editor_block_menu_v2_patch_2') ? nestedDropdownMenu.label : undefined
			}
		>
			<ChildItems nestedDropdownMenu={nestedDropdownMenu} />
		</ToolbarNestedDropdownMenu>
	);
};
