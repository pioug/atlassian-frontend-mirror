import React from 'react';

import { useIntl } from 'react-intl-next';

import { blockMenuMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { SyncBlocksIcon, ToolbarDropdownItem } from '@atlaskit/editor-toolbar';

import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

export const CreateSyncedBlockDropdownItem = ({
	api,
}: {
	api: ExtractInjectionAPI<SyncedBlockPlugin> | undefined;
}) => {
	const { formatMessage } = useIntl();

	const selection = api?.selection?.sharedState?.currentState()?.selection;
	if (!selection?.empty) {
		return null;
	}

	const onClick = () => {
		api?.core?.actions.execute(api?.syncedBlock.commands.insertSyncedBlock());
	};

	return (
		<ToolbarDropdownItem elemBefore={<SyncBlocksIcon label="" />} onClick={onClick}>
			{formatMessage(blockMenuMessages.createSyncedBlock)}
		</ToolbarDropdownItem>
	);
};
