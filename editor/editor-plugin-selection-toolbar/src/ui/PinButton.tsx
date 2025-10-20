import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PinnedIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

export const PinButton = ({ api }: { api?: ExtractInjectionAPI<SelectionToolbarPlugin> }) => {
	const intl = useIntl();
	const message = intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop);
	const { isOffline } = useEditorToolbar();

	const isDisabled = fg('platform_editor_toolbar_aifc_patch_7') ? isOffline : false;

	const onClick = () => {
		if (!api || isDisabled) {
			return;
		}
		if (fg('platform_editor_migrate_toolbar_docking')) {
			api?.core.actions.execute(
				api?.userPreferences?.actions.updateUserPreference('toolbarDockingPosition', 'none'),
			);
			return;
		}
		api.selectionToolbar.actions?.setToolbarDocking?.('none');
	};

	return (
		<ToolbarTooltip content={message}>
			<ToolbarButton
				iconBefore={<PinnedIcon size="small" label="" />}
				label={message}
				onClick={onClick}
				isDisabled={isDisabled}
			/>
		</ToolbarTooltip>
	);
};
