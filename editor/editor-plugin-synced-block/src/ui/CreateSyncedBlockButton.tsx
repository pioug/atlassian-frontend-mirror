import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isOfflineMode } from '@atlaskit/editor-plugin-connectivity';
import { ToolbarButton, ToolbarTooltip } from '@atlaskit/editor-toolbar';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';
type CreateSyncedBlockButtonProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

export const CreateSyncedBlockButton = ({
	api,
}: CreateSyncedBlockButtonProps): React.JSX.Element => {
	const intl = useIntl();
	const { selection, mode } = useSharedPluginStateWithSelector(
		api,
		['selection', 'connectivity'],
		(states) => ({
			selection: states.selectionState?.selection,
			mode: states.connectivityState?.mode,
		}),
	);

	// for toolbar button, we allow both creating a new synced block
	// and converting existing block to synced block
	const canBeConverted = Boolean(selection && canBeConvertedToSyncBlock(selection));
	const canInsertEmptyBlock = Boolean(selection?.empty);

	const isDisabled = Boolean(isOfflineMode(mode) || (!canBeConverted && !canInsertEmptyBlock));

	const onClick = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => api?.syncedBlock.commands.insertSyncedBlock()({ tr }));
		api?.core?.actions.focus();
	}, [api]);

	const message = intl.formatMessage(syncBlockMessages.createSyncBlockLabel);

	return (
		<ToolbarTooltip content={message}>
			<ToolbarButton
				label={message}
				iconBefore={<BlockSyncedIcon size="small" label="" />}
				isDisabled={isDisabled}
				onClick={onClick}
			/>
		</ToolbarTooltip>
	);
};
