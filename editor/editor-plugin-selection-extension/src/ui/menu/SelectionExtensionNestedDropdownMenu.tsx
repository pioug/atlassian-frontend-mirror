import React from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { ToolbarDropdownItemSection, ToolbarNestedDropdownMenu } from '@atlaskit/editor-toolbar';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';

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
			elemBefore={IconComponent ? <IconComponent label="" /> : undefined}
			elemAfter={<ChevronRightIcon label={'nested menu'} />}
			onClick={handleClick}
		>
			<ChildItems nestedDropdownMenu={nestedDropdownMenu} />
		</ToolbarNestedDropdownMenu>
	);
};
