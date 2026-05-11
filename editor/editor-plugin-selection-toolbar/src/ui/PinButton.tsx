import React from 'react';

import { useIntl } from 'react-intl';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { selectionToolbarMessages } from '@atlaskit/editor-common/messages';
import { useEditorToolbar } from '@atlaskit/editor-common/toolbar';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { PinnedIcon, ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import { fg } from '@atlaskit/platform-feature-flags';

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
	if (runtimeOverride === 'always-pinned' && fg('platform_editor_toolbar_mode_override')) {
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
