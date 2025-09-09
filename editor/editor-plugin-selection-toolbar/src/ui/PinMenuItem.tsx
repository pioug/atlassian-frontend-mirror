import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { PinIcon, PinnedIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import { conditionalHooksFactory } from '@atlaskit/platform-feature-flags-react';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

const shouldShowPinMenuItem = (editMode?: ViewMode) => {
	return editMode !== 'view';
};

type PinMenuItemProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
};

const usePluginState = conditionalHooksFactory(
	() => expValEquals('platform_editor_toolbar_aifc_patch_3', 'isEnabled', true),
	(api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
		const { editorViewMode, editorToolbarDockingPreference } = useEditorToolbar();

		return {
			editorViewMode,
			editorToolbarDockingPreference,
		};
	},
	(api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
		const editorViewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
		const editorToolbarDockingPreference = useSharedPluginStateSelector(
			api,
			'userPreferences.preferences.toolbarDockingPosition',
		);

		return {
			editorViewMode,
			editorToolbarDockingPreference,
		};
	},
);

/**
 * The menu-item version of pin only appears in selection toolbar - the primary toolbar will have its own component
 */
export const PinMenuItem = ({ api }: PinMenuItemProps) => {
	const intl = useIntl();
	const { editorViewMode, editorToolbarDockingPreference } = usePluginState(api);
	const isToolbarDocked = editorToolbarDockingPreference === 'top';

	if (!shouldShowPinMenuItem(editorViewMode)) {
		return null;
	}

	const onClick = () => {
		if (!api) {
			return;
		}
		if (isToolbarDocked) {
			api.selectionToolbar.actions?.setToolbarDocking?.('none');
		} else {
			api.selectionToolbar.actions?.setToolbarDocking?.('top');
		}
	};

	const message = intl.formatMessage(
		isToolbarDocked
			? selectionToolbarMessages.toolbarPositionPinedAtTop
			: selectionToolbarMessages.toolbarPositionUnpinnedConcise,
	);

	return (
		<ToolbarDropdownItem
			onClick={onClick}
			elemBefore={
				isToolbarDocked ? <PinnedIcon size="small" label="" /> : <PinIcon size="small" label="" />
			}
		>
			{message}
		</ToolbarDropdownItem>
	);
};
