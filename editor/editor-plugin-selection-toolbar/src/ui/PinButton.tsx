import React from 'react';

import { useIntl } from 'react-intl';

import { selectionToolbarMessages } from '@atlaskit/editor-common/messages/selection-toolbar';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar/context';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/useSharedPluginStateWithSelector';
import { PinnedIcon } from '@atlaskit/editor-toolbar/pinned-icon';
import { ToolbarButton } from '@atlaskit/editor-toolbar/toolbar-button';
import { ToolbarTooltip } from '@atlaskit/editor-toolbar/toolbar-tooltip';

import type { SelectionToolbarPlugin } from '../selectionToolbarPluginType';

export const PinButton = ({
	api,
}: {
	api?: ExtractInjectionAPI<SelectionToolbarPlugin>;
}): React.JSX.Element | null => {
	const intl = useIntl();
	const message = intl.formatMessage(selectionToolbarMessages.toolbarPositionPinedAtTop);
	const { isOffline: isDisabled } = useEditorToolbar();
	// Pin/unpin is meaningless when a runtime override forces `'always-pinned'`
	// (e.g. Markdown Mode source / preview view). Subscribe so we re-render and
	// hide ourselves on flip.
	const runtimeOverride = useSharedPluginStateWithSelector(
		api,
		['toolbar'],
		(states) => states.toolbarState?.contextualFormattingModeOverride,
	);
	if (runtimeOverride === 'always-pinned') {
		return null;
	}

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
