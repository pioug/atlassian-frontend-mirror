import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PinIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

const shouldShowPinMenuItem = (api?: ExtractInjectionAPI<SelectionToolbarPlugin>) => {
	const isDocked = fg('platform_editor_use_preferences_plugin')
		? api?.userPreferences?.sharedState.currentState()?.preferences?.toolbarDockingPosition ===
			'top'
		: api?.selectionToolbar.sharedState.currentState()?.toolbarDocking === 'top';

	return !isDocked;
};

type PinMenuItemProps = {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
};

/**
 * The menu-item version of pin only appears in selection toolbar - the primary toolbar will have its own component
 */
export const PinMenuItem = ({ api }: PinMenuItemProps) => {
	const intl = useIntl();

	if (!shouldShowPinMenuItem(api)) {
		return null;
	}

	const onClick = () => {
		api?.selectionToolbar.actions?.setToolbarDocking?.('top');
	};

	const message = intl.formatMessage(selectionToolbarMessages.toolbarPositionUnpinnedConcise);

	return (
		<ToolbarDropdownItem onClick={onClick} elemBefore={<PinIcon label="" />}>
			{message}
		</ToolbarDropdownItem>
	);
};
