import React, { useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import {
	DropdownMenuWithKeyboardNavigation as DropdownMenu,
	type MenuItem,
} from '@atlaskit/editor-common/ui-menu';

import { type MenuItemsType } from '../../types';

import { SelectionExtensionDropdownMenuButton } from './SelectionExtensionDropdownMenuButton';

export type SelectionExtensionDropdownMenuProps = {
	editorAnalyticsAPI?: EditorAnalyticsAPI;
	items: MenuItemsType;
	onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
} & WrappedComponentProps;
const SelectionExtensionDropdownMenuComponent = React.memo(
	({ items, onItemActivated, editorAnalyticsAPI }: SelectionExtensionDropdownMenuProps) => {
		const [isMenuOpen, setIsMenuOpen] = useState(false);
		return (
			<DropdownMenu
				section={{ hasSeparator: true }}
				isOpen={isMenuOpen}
				items={items}
				fitHeight={188}
				fitWidth={136}
				onItemActivated={onItemActivated}
				data-testid="selection-extension-dropdown-menu"
			>
				<SelectionExtensionDropdownMenuButton
					aria-expanded={isMenuOpen}
					selected={isMenuOpen}
					onClick={() =>
						setIsMenuOpen((prevIsMenuOpen) => {
							const nextIsMenuOpen = !prevIsMenuOpen;
							if (editorAnalyticsAPI) {
								editorAnalyticsAPI.fireAnalyticsEvent({
									action: ACTION.CLICKED,
									actionSubject: ACTION_SUBJECT.BUTTON,
									actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_DROPDOWN,
									eventType: EVENT_TYPE.TRACK,
									attributes: {
										toggle: nextIsMenuOpen ? ACTION.OPENED : ACTION.CLOSED,
									},
								});
							}
							return nextIsMenuOpen;
						})
					}
				/>
			</DropdownMenu>
		);
	},
);

export const SelectionExtensionDropdownMenu = injectIntl(SelectionExtensionDropdownMenuComponent);
