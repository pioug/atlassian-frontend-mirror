import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import { PinIcon, PinnedIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

const shouldShowPinMenuItem = (editMode?: ViewMode) => {
	return editMode !== 'view';
};

type PinMenuItemProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
};

/**
 * The menu-item version of pin only appears in selection toolbar - the primary toolbar will have its own component
 */
export const PinMenuItem = ({ api }: PinMenuItemProps) => {
	const intl = useIntl();
	const editMode = useSharedPluginStateSelector(api, 'editorViewMode.mode');
	const toolbarDocking = useSharedPluginStateSelector(
		api,
		'userPreferences.preferences.toolbarDockingPosition',
	);
	const isToolbarDocked = toolbarDocking === 'top';

	if (!shouldShowPinMenuItem(editMode)) {
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
			elemBefore={isToolbarDocked ? <PinnedIcon label="" /> : <PinIcon label="" />}
		>
			{message}
		</ToolbarDropdownItem>
	);
};
