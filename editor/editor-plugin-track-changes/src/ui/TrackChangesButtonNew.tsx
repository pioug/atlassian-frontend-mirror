import React from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, HistoryIcon } from '@atlaskit/editor-toolbar';

import { type TrackChangesPlugin } from '../trackChangesPluginType';

type TrackChangesButtonNewProps = {
	api?: ExtractInjectionAPI<TrackChangesPlugin>;
};

export const TrackChangesButtonNew = ({ api }: TrackChangesButtonNewProps) => {
	const { isDisplayingChanges, isShowDiffAvailable } = useSharedPluginStateWithSelector(
		api,
		['trackChanges'],
		(states) => ({
			isDisplayingChanges: states.trackChangesState?.isDisplayingChanges,
			isShowDiffAvailable: states.trackChangesState?.isShowDiffAvailable,
		}),
	);

	const { formatMessage } = useIntl();

	const handleClick = React.useCallback(() => {
		const wasShowingDiffSelected = isDisplayingChanges;
		const result = api?.core.actions.execute(api?.trackChanges?.commands.toggleChanges);
		// On de-selection - focus back on the editor
		if (result && wasShowingDiffSelected) {
			api?.core.actions.focus();
		}
	}, [api, isDisplayingChanges]);

	return (
		<ToolbarTooltip content={formatMessage(trackChangesMessages.toolbarIconLabel)}>
			<ToolbarButton
				iconBefore={
					<HistoryIcon label={formatMessage(trackChangesMessages.toolbarIconLabel)} size="small" />
				}
				onClick={handleClick}
				isDisabled={!isShowDiffAvailable}
				isSelected={isDisplayingChanges}
			/>
		</ToolbarTooltip>
	);
};
