import React from 'react';

import { useIntl } from 'react-intl';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages/selection-toolbar';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import { PinIcon } from '@atlaskit/editor-toolbar/pin-icon';
import { PinnedIcon } from '@atlaskit/editor-toolbar/pinned-icon';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar/toolbar-dropdown-item';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

const shouldShowPinMenuItem = (editMode?: ViewMode) => {
	return editMode !== 'view';
};

type PinMenuItemProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
	disablePin?: boolean;
};

const usePluginState = (_api?: ExtractInjectionAPI<SelectionToolbarPlugin> | undefined) => {
	const { editorViewMode, editorToolbarDockingPreference, isOffline } = useEditorToolbar();

	return {
		editorViewMode,
		editorToolbarDockingPreference,
		isOffline,
	};
};

/**
 * The menu-item version of pin only appears in selection toolbar - the primary toolbar will have its own component
 */
export const PinMenuItem = ({ api, disablePin }: PinMenuItemProps): React.JSX.Element | null => {
	const intl = useIntl();
	const runtimeOverride = useSharedPluginStateWithSelector(
		api,
		['toolbar'],
		(states) => states.toolbarState?.contextualFormattingModeOverride,
	);
	const {
		editorViewMode,
		editorToolbarDockingPreference,
		isOffline: isDisabled,
	} = usePluginState(api);
	const isToolbarDocked = editorToolbarDockingPreference === 'top';

	if (disablePin || !shouldShowPinMenuItem(editorViewMode) || runtimeOverride === 'always-pinned') {
		return null;
	}

	const onClick = () => {
		if (!api || isDisabled) {
			return;
		}

		api?.core.actions.execute(
			api?.userPreferences?.actions.updateUserPreference(
				'toolbarDockingPosition',
				isToolbarDocked ? 'none' : 'top',
			),
		);
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
