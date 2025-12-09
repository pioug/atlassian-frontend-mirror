import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { PinIcon, PinnedIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';
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
		const { editorViewMode, editorToolbarDockingPreference, isOffline } = useEditorToolbar();

		return {
			editorViewMode,
			editorToolbarDockingPreference,
			isOffline,
		};
	},
	(api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
		const editorViewMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
		const editorToolbarDockingPreference = useSharedPluginStateSelector(
			api,
			'userPreferences.preferences.toolbarDockingPosition',
		);
		const isOffline = useSharedPluginStateSelector(api, 'connectivity.mode') === 'offline';

		return {
			editorViewMode,
			editorToolbarDockingPreference,
			isOffline,
		};
	},
);

/**
 * The menu-item version of pin only appears in selection toolbar - the primary toolbar will have its own component
 */
export const PinMenuItem = ({ api }: PinMenuItemProps): React.JSX.Element | null => {
	const intl = useIntl();
	const { editorViewMode, editorToolbarDockingPreference, isOffline } = usePluginState(api);
	const isToolbarDocked = editorToolbarDockingPreference === 'top';

	const isDisabled = fg('platform_editor_toolbar_aifc_patch_7') ? isOffline : false;

	if (!shouldShowPinMenuItem(editorViewMode)) {
		return null;
	}

	const onClick = () => {
		if (!api || isDisabled) {
			return;
		}

		if (fg('platform_editor_migrate_toolbar_docking')) {
			api?.core.actions.execute(
				api?.userPreferences?.actions.updateUserPreference(
					'toolbarDockingPosition',
					isToolbarDocked ? 'none' : 'top',
				),
			);
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
			isDisabled={isDisabled}
			elemBefore={
				isToolbarDocked ? <PinnedIcon size="small" label="" /> : <PinIcon size="small" label="" />
			}
		>
			{message}
		</ToolbarDropdownItem>
	);
};
