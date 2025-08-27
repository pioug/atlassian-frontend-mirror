import React from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarButton, ToolbarTooltip, HistoryIcon } from '@atlaskit/editor-toolbar';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { type TrackChangesPlugin } from '../trackChangesPluginType';

type TrackChangesToolbarButtonProps = {
	api: ExtractInjectionAPI<TrackChangesPlugin> | undefined;
};

export const TrackChangesToolbarButton = ({ api }: TrackChangesToolbarButtonProps) => {
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
			{expValEquals('platform_editor_toolbar_aifc', 'isEnabled', true) ? (
				<ToolbarButton
					iconBefore={
						<HistoryIcon
							label={formatMessage(trackChangesMessages.toolbarIconLabel)}
							size="small"
						/>
					}
					onClick={handleClick}
					isDisabled={!isShowDiffAvailable}
					isSelected={isDisplayingChanges}
				/>
			) : (
				<IconButton
					icon={HistoryIcon}
					label={formatMessage(trackChangesMessages.toolbarIconLabel)}
					appearance="subtle"
					isDisabled={!isShowDiffAvailable}
					isSelected={isDisplayingChanges}
					onClick={handleClick}
				/>
			)}
		</ToolbarTooltip>
	);
};
