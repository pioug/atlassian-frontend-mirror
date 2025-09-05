import React from 'react';

import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import { selectionExtensionPluginKey } from '../../pm-plugins/main';
import { getSelectionAdfInfoNew, getSelectionTextInfo } from '../../pm-plugins/utils';
import type { SelectionExtensionPlugin } from '../../selectionExtensionPluginType';
import type { ExtensionMenuItemConfiguration } from '../../types';
import { SelectionExtensionActionTypes } from '../../types';

type MenuItemProps = {
	api: ExtractInjectionAPI<SelectionExtensionPlugin> | undefined;
	extensionMenuItems: ExtensionMenuItemConfiguration[];
};

export const MenuItem = ({ extensionMenuItems, api }: MenuItemProps) => {
	const { editorView } = useEditorToolbar();
	if (!extensionMenuItems?.length || !editorView || !api) {
		return null;
	}

	const onClickHandle = (extension: ExtensionMenuItemConfiguration) => () => {
		if (extension.contentComponent) {
			const selection = getSelectionTextInfo(editorView, api);

			api.core.actions.execute(
				api.selectionExtension.commands.setActiveExtension({
					extension,
					selection,
				}),
			);
		}

		api.core.actions.execute(({ tr }) => {
			const { selectedNode, nodePos } = getSelectionAdfInfoNew(tr.selection);

			tr.setMeta(selectionExtensionPluginKey, {
				type: SelectionExtensionActionTypes.SET_SELECTED_NODE,
				selectedNode,
				nodePos,
			});

			return tr;
		});

		extension.onClick && extension.onClick();
	};

	return (
		<>
			{extensionMenuItems.map((extension) => {
				const Icon = extension.icon;

				return (
					<ToolbarDropdownItem
						key={extension.label}
						elemBefore={<Icon size="small" label="" />}
						onClick={onClickHandle(extension)}
						isDisabled={extension.isDisabled}
					>
						{extension.label}
					</ToolbarDropdownItem>
				);
			})}
		</>
	);
};
