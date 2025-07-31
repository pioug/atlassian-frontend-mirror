import React from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { trackChangesMessages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import HistoryIcon from '@atlaskit/icon-lab/core/history';

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
		api?.core.actions.execute(api?.trackChanges.commands.toggleChanges);
	}, [api?.trackChanges?.commands, api?.core.actions]);

	return (
		<IconButton
			icon={HistoryIcon}
			label={formatMessage(trackChangesMessages.toolbarIconLabel)}
			appearance="subtle"
			isDisabled={!isShowDiffAvailable}
			isSelected={isDisplayingChanges}
			onClick={handleClick}
		/>
	);
};
