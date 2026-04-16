import React, { useState } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

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

import type { MenuItemsType } from '../../types';

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
				// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

// eslint-disable-next-line @typescript-eslint/ban-types
export const SelectionExtensionDropdownMenu: React.FC<
	WithIntlProps<
		{
			editorAnalyticsAPI?: EditorAnalyticsAPI;
			items: MenuItemsType;
			onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
		} & WrappedComponentProps
	>
> & {
	WrappedComponent: React.ComponentType<
		{
			editorAnalyticsAPI?: EditorAnalyticsAPI;
			items: MenuItemsType;
			onItemActivated?: (attrs: { item: MenuItem; shouldCloseMenu?: boolean }) => void;
		} & WrappedComponentProps
	>;
} = injectIntl(SelectionExtensionDropdownMenuComponent);
