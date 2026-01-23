import React from 'react';

import { useIntl } from 'react-intl-next';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PinnedIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

export const PinButton = ({
	api,
}: {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
}): React.JSX.Element => {
	const intl = useIntl();
	const message = intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop);
	const { isOffline: isDisabled } = useEditorToolbar();

	const onClick = () => {
		if (!api || isDisabled) {
			return;
		}
		api?.core.actions.execute(
			api?.userPreferences?.actions.updateUserPreference('toolbarDockingPosition', 'none'),
		);
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
