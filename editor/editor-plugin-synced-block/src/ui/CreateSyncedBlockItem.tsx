import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { syncBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ToolbarDropdownItem } from '@atlaskit/editor-toolbar';
import BlockSyncedIcon from '@atlaskit/icon-lab/core/block-synced';
import Lozenge from '@atlaskit/lozenge';

import { canBeConvertedToSyncBlock } from '../pm-plugins/utils/utils';
import type { SyncedBlockPlugin } from '../syncedBlockPluginType';

type CreateSyncedBlockItemProps = {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
};

export const CreateSyncedBlockItem = ({ api }: CreateSyncedBlockItemProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const { selection, mode } = useSharedPluginStateWithSelector(
		api,
		['selection', 'connectivity'],
		(states) => ({
			selection: states.selectionState?.selection,
			mode: states.connectivityState?.mode,
		}),
	);
	const isDisabled = Boolean(
		!selection || !canBeConvertedToSyncBlock(selection) || mode === 'offline',
	);

	const onClick = useCallback(() => {
		api?.core?.actions.execute(({ tr }) => api?.syncedBlock.commands.insertSyncedBlock()({ tr }));
		api?.core?.actions.focus();
	}, [api]);

	return (
		<ToolbarDropdownItem
			onClick={onClick}
			isDisabled={isDisabled}
			elemBefore={<BlockSyncedIcon size="small" label="" />}
			elemAfter={<Lozenge appearance="new">{formatMessage(syncBlockMessages.newLozenge)}</Lozenge>}
		>
			{formatMessage(syncBlockMessages.createSyncBlockLabel)}
		</ToolbarDropdownItem>
	);
};
