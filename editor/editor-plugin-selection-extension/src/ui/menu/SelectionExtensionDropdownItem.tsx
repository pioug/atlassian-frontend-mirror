import React from 'react';

import { cssMap } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import Lozenge from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { selectionExtensionPluginKey } from '../../pm-plugins/main';
import { getSelectionAdfInfoNew, getSelectionTextInfoNew } from '../../pm-plugins/utils';
import type { ExtensionDropdownItemConfiguration } from '../../types';
import { SelectionExtensionActionTypes } from '../../types';
import { useSelectionExtensionComponentContext } from '../SelectionExtensionComponentContext';

const styles = cssMap({
	lozenge: {
		marginLeft: token('space.050'),
	},
});

type SelectionExtensionDropdownItemProps = {
	dropdownItem: ExtensionDropdownItemConfiguration;
};

export const SelectionExtensionDropdownItem = ({
	dropdownItem,
}: SelectionExtensionDropdownItemProps): React.JSX.Element => {
	const IconComponent = dropdownItem.icon;

	const { api, editorView, extensionKey, extensionSource, extensionLocation } =
		useSelectionExtensionComponentContext();

	const handleClick = () => {
		const preservedSelection = api?.blockControls?.sharedState.currentState()?.preservedSelection;
		const selection = preservedSelection || editorView.state.selection;

		if (dropdownItem.contentComponent) {
			const selectionInfo = getSelectionTextInfoNew(selection, editorView, api);

			api.core.actions.execute(
				api.selectionExtension.commands.setActiveExtension({
					extension: dropdownItem,
					selection: selectionInfo,
				}),
			);
		}

		api.core.actions.execute(({ tr }) => {
			const { selectedNode, nodePos } = getSelectionAdfInfoNew(selection);

			tr.setMeta(selectionExtensionPluginKey, {
				type: SelectionExtensionActionTypes.SET_SELECTED_NODE,
				selectedNode,
				nodePos,
			});

			if (fg('platform_editor_block_menu_v2_patch_1')) {
				if (extensionLocation === 'block-menu') {
					api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });
				}
			} else {
				api?.blockControls?.commands.toggleBlockMenu({ closeMenu: true })({ tr });
			}

			return tr;
		});

		dropdownItem.onClick?.();

		api.analytics?.actions.fireAnalyticsEvent({
			action: ACTION.CLICKED,
			actionSubject: ACTION_SUBJECT.BUTTON,
			actionSubjectId: ACTION_SUBJECT_ID.EDITOR_PLUGIN_SELECTION_EXTENSION_ITEM,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				extensionKey,
				extensionSource,
				extensionLocation,
				extensionElement: 'dropdown-item',
				extensionItemKey: dropdownItem.key,
			},
		});
	};

	return (
		<ToolbarDropdownItem
			elemBefore={
				IconComponent ? (
					<IconComponent
						size={
							extensionLocation === 'inline-toolbar' && fg('platform_editor_block_menu_v2_patch_1')
								? 'small'
								: undefined
						}
						label=""
					/>
				) : undefined
			}
			onClick={handleClick}
			isDisabled={dropdownItem.isDisabled}
		>
			{dropdownItem.label}
			{dropdownItem.lozenge ? (
				<Box as="span" xcss={styles.lozenge}>
					<Lozenge appearance="new">{dropdownItem.lozenge.label}</Lozenge>
				</Box>
			) : undefined}
		</ToolbarDropdownItem>
	);
};
