import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

type CreateSyncedBlockItemProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

export const CreateSyncedBlockItem = ({ api }: CreateSyncedBlockItemProps) => {
	const intl = useIntl();

	const selection = useSharedPluginStateWithSelector(
		api,
		['selection'],
		(states) => states.selectionState?.selection,
	);
	const isDisabled = Boolean(!selection || !canBeConvertedToSyncBlock(selection));

	const onClick = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => api?.syncedBlock.commands.insertSyncedBlock()({ tr }));
		api?.core?.actions.focus();
	}, [api]);

	const message = intl.formatMessage(syncBlockMessages.createSyncBlockLabel);

	return (
		<ToolbarDropdownItem
			onClick={onClick}
			isDisabled={isDisabled}
			elemBefore={<BlockSyncedIcon label="" />}
		>
			{message}
		</ToolbarDropdownItem>
	);
};
