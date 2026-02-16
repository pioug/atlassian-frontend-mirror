import React, { useCallback, useRef, useState } from 'react';

import { cssMap } from '@atlaskit/css';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { ToolbarDropdownItem, ToolbarTooltip } from '@atlaskit/editor-toolbar';
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
	contentWrapper: {
		display: 'flex',
		alignItems: 'center',
		minWidth: '0px',
	},
	label: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		minWidth: '0px',
	},
	lozenge: {
		marginLeft: token('space.050'),
		flexShrink: 0,
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

	const labelRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	const handleMouseEnter = useCallback(() => {
		const el = labelRef.current;
		if (el) {
			setIsTruncated(el.scrollWidth > el.clientWidth);
		}
	}, []);

	if (fg('platform_editor_block_menu_v2_patch_2')) {
		return (
			<ToolbarTooltip content={isTruncated ? dropdownItem.label : null} position="top">
				<ToolbarDropdownItem
					elemBefore={
						IconComponent ? (
							<IconComponent
								size={
									extensionLocation === 'inline-toolbar' &&
									fg('platform_editor_block_menu_v2_patch_1')
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
					<Box as="span" xcss={styles.contentWrapper} onMouseOver={handleMouseEnter}>
						<Box as="span" xcss={styles.label} ref={labelRef}>
							{dropdownItem.label}
						</Box>
						{dropdownItem.lozenge ? (
							<Box as="span" xcss={styles.lozenge}>
								<Lozenge appearance="new">{dropdownItem.lozenge.label}</Lozenge>
							</Box>
						) : undefined}
					</Box>
				</ToolbarDropdownItem>
			</ToolbarTooltip>
		);
	}

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
